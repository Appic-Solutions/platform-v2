'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Principal } from '@dfinity/principal';

import { useSharedStore } from '@/store/store';
import {
  FEE_TIERS,
  FEE_TIERS_DESC_MAP,
  getTickSpacing,
} from '@/blockchain_api/functions/icp/dex/constants';
import { get_market_price } from '@/blockchain_api/functions/icp/dex/utils/price';
import { sortTokens } from '@/blockchain_api/functions/icp/dex/utils/token_order';
import { CreatePoolFormDefaultValues, CreatePoolFormKeys, CreatePoolFormSchema } from '../schema';
import type {
  FeeTier,
  HandlePriceProps,
  SelectFeeHandlerProps,
  SelectTokenHandlerProps,
} from '../_types';
import { alignMinOrMaxPrice } from '@/blockchain_api/functions/icp/dex/align_min_max';
import { calculate_mint_amounts } from '@/blockchain_api/functions/icp/dex/calculate_mint_amounts';
import { limitDecimalPlaces } from '@/lib/utils';

export default function useCreatePoolLogic() {
  const { pools, icpTokens } = useSharedStore();

  const [step, setStep] = useState(0);
  const [feeTiers, setFeeTiers] = useState<FeeTier[]>([]);
  const [isToken0Selected, setIsToken0Selected] = useState(true);
  const feeManuallySelected = useRef(false);

  const methods = useForm<CreatePoolFormDefaultValues>({
    defaultValues: {
      searchTokenQuery: '',
      fee: 3000,
      tickSpacing: undefined,
      sqrtPriceX96: '',
      initialPrice: '',
      token0: undefined,
      token1: undefined,
      minPrice: '0',
      maxPrice: 'max',
      minTick: undefined,
      maxTick: undefined,
      token0DepositAmount: '',
      token1DepositAmount: '',
    },
    resolver: zodResolver(CreatePoolFormSchema),
    mode: 'onChange',
  });

  const [Token0, Token1, sqrtPriceX96, minTick, maxTick] = useWatch({
    control: methods.control,
    name: ['token0', 'token1', 'sqrtPriceX96', 'minTick', 'maxTick'],
  });

  const getStepValidationFields = (step: number): (keyof CreatePoolFormDefaultValues)[] => {
    switch (step) {
      case 0:
        return ['fee', 'token0', 'token1'];
      case 1:
        return ['initialPrice'];
      case 2:
        return ['token0DepositAmount', 'token1DepositAmount'];
      default:
        return [];
    }
  };

  const stepNextHandler = async () => {
    const fields = getStepValidationFields(step);
    const isValid = await methods.trigger(fields);
    if (!isValid) return;
    setStep((prev) => prev + 1);
  };

  const stepBackHandler = () => setStep((prev) => Math.max(prev - 1, 0));

  const resetFormHandler = () => {
    methods.reset();
    setFeeTiers([]);
  };

  const handleInitialPriceInput = (value: string) => {
    methods.setValue('initialPrice', value, { shouldValidate: true, shouldDirty: true });
    methods.trigger('initialPrice');
  };

  // Helper functions for price and deposit amount handling
  const getPriceField = (minOrMax: 'min' | 'max'): CreatePoolFormKeys =>
    minOrMax === 'min' ? 'minPrice' : 'maxPrice';

  const getTickField = (minOrMax: 'min' | 'max'): CreatePoolFormKeys =>
    minOrMax === 'min' ? 'minTick' : 'maxTick';

  const normalizePrice = (value: string, field: CreatePoolFormKeys) => {
    const trimmed = value.trim();
    if (field === 'minPrice' && (value === 'min' || trimmed === '' || value === '0')) return 'min';
    if (field === 'maxPrice' && (value === 'max' || trimmed === '' || value === '0')) return 'max';
    return trimmed;
  };

  const isEmptyOrZero = (value: string) => value.trim() === '' || value === '0';

  const setDefaultPrice = (field: CreatePoolFormKeys) => {
    const defaultVal = field === 'minPrice' ? 'min' : 'max';
    methods.setValue(field, defaultVal, {
      shouldValidate: false,
      shouldDirty: true,
    });
  };

  const updateAlignedValues = (
    field: CreatePoolFormKeys,
    tickField: CreatePoolFormKeys,
    alignedPrice: { tick: number; price: string },
  ) => {
    methods.setValue(tickField, alignedPrice.tick.toString());

    const fixedPrice = Number(alignedPrice.price)
      .toFixed(6)
      .replace(/\.?0+$/, '');

    methods.setValue(field, fixedPrice, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const triggerRelevantValidation = (field: CreatePoolFormKeys) => {
    const dirty = methods.formState.dirtyFields;
    const bothDirty = dirty.minPrice && dirty.maxPrice;

    if (bothDirty) {
      methods.trigger(['minPrice', 'maxPrice']);
    } else {
      methods.trigger(field);
    }
  };

  const handlePriceInput = ({ minOrMax, value }: HandlePriceProps) => {
    const field = getPriceField(minOrMax);
    const tickField = getTickField(minOrMax);
    const normalized = normalizePrice(value, field);

    const alignedPrice = alignMinOrMaxPrice({
      is_token0_selected: isToken0Selected,
      token0: Token0,
      token1: Token1,
      price: normalized,
      tick_spacing: methods.getValues('tickSpacing'),
    });

    if (isEmptyOrZero(value)) {
      setDefaultPrice(field);
      return;
    }

    const floatValue = parseFloat(value);
    if (isNaN(floatValue) || !alignedPrice) return;

    updateAlignedValues(field, tickField, alignedPrice);
    triggerRelevantValidation(field);
  };

  const handleDepositAmountInput = ({
    amount,
    isAmountZero,
  }: {
    isAmountZero: boolean;
    amount: string;
  }) => {
    console.log('before if');
    console.log({
      Token0,
      Token1,
      sqrtPriceX96,
      minTick,
      maxTick,
    });
    if (!Token0 || !Token1 || !sqrtPriceX96 || !minTick || !maxTick) return;
    console.log('after if');
    const trimmed = amount.trim();

    if (!trimmed || trimmed === '0') {
      console.log('resetting amounts');
      methods.setValue('token0DepositAmount', '', {
        shouldValidate: true,
        shouldDirty: true,
      });
      methods.setValue('token1DepositAmount', '', {
        shouldValidate: true,
        shouldDirty: true,
      });
      methods.trigger(['token0DepositAmount', 'token1DepositAmount']);
      return;
    }

    const validAmount = limitDecimalPlaces(trimmed);
    const parsed = parseFloat(validAmount);
    if (isNaN(parsed) || parsed <= 0) return;

    console.log('args', {
      selected_amount: validAmount,
      token0: Token0,
      token1: Token1,
      sqrt_price_x96: sqrtPriceX96,
      min_tick: minTick,
      max_tick: maxTick,
      is_amount_zero: isAmountZero,
    });
    const result = calculate_mint_amounts({
      selected_amount: validAmount,
      token0: Token0,
      token1: Token1,
      sqrt_price_x96: sqrtPriceX96,
      min_tick: minTick,
      max_tick: maxTick,
      is_amount_zero: isAmountZero,
    });
    console.log(result);

    methods.setValue('token0DepositAmount', result.token0.formatted, {
      shouldValidate: true,
      shouldDirty: true,
    });
    methods.setValue('token1DepositAmount', result.token1.formatted, {
      shouldValidate: true,
      shouldDirty: true,
    });

    methods.trigger(['token0DepositAmount', 'token1DepositAmount']);
  };

  const handleSetMarketPrice = () => {
    if (!Token0 || !Token1 || !icpTokens) return;
    const { price } = get_market_price(
      {
        is_token0_selected: isToken0Selected,
        token0: Token0,
        token1: Token1,
        price: '0',
      },
      icpTokens,
    );
    handleInitialPriceInput(price);
  };

  const selectTokenHandler = ({ name, value }: SelectTokenHandlerProps) => {
    methods.setValue('token0DepositAmount', '');
    methods.setValue('token1DepositAmount', '');
    methods.setValue('minPrice', '');
    methods.setValue('maxPrice', '');
    methods.setValue('initialPrice', '');
    methods.setValue('sqrtPriceX96', '');
    methods.setValue('tickSpacing', 0);
    methods.setValue('fee', 3000);
    methods.setValue(name, value);
    methods.clearErrors();
  };

  const selectFeeHandler = (value: SelectFeeHandlerProps) => {
    feeManuallySelected.current = true;
    methods.setValue('fee', value);
    methods.clearErrors('fee');
    getTickSpacingHandler(value);
  };

  const getTickSpacingHandler = (fee: number) => {
    const tickSpacing = getTickSpacing(fee);
    methods.setValue('tickSpacing', tickSpacing ?? 0);
  };

  useEffect(() => {
    if (!Token0 || !Token1 || !Token0.canisterId || !Token1.canisterId) return;

    const { token0, token1 } = sortTokens(Token0, Token1);

    if (token0.canisterId !== Token0.canisterId || token1.canisterId !== Token1.canisterId) {
      methods.setValue('token0', token0);
      methods.setValue('token1', token1);
    }

    const feeTiersList = FEE_TIERS.map((fee) => ({
      fee: BigInt(fee),
      token0: Principal.fromText(token0.canisterId),
      token1: Principal.fromText(token1.canisterId),
      tvl: '0',
      desc: FEE_TIERS_DESC_MAP.get(fee) || 'Best for very stable pairs.',
      isExist: false,
    }));

    const updatedFeeTiers = feeTiersList.map((feeTier) => {
      const matchingPool = pools?.find(
        (pool) =>
          pool.pool_id.fee === feeTier.fee &&
          pool.pool_id.token0.toText() === feeTier.token0.toText() &&
          pool.pool_id.token1.toText() === feeTier.token1.toText(),
      );

      return {
        ...feeTier,
        isExist: Boolean(matchingPool),
        tvl: matchingPool?.tvl_usd || '0',
      };
    });

    setFeeTiers(updatedFeeTiers);

    if (!feeManuallySelected.current && updatedFeeTiers.length > 0) {
      const feeTiersWithTvl = updatedFeeTiers
        .map((tier) => ({
          ...tier,
          numericTvl: parseFloat(tier.tvl) || 0,
        }))
        .filter((tier) => tier.numericTvl > 0);

      if (feeTiersWithTvl.length > 0) {
        feeTiersWithTvl.sort((a, b) => b.numericTvl - a.numericTvl);
        const highestTvlFee = feeTiersWithTvl[0].fee;
        methods.setValue('fee', Number(highestTvlFee));
      }
    }
    getTickSpacingHandler(methods.getValues('fee'));

    // Reset manual flag after token change
    feeManuallySelected.current = false;
  }, [Token0, Token1]);

  return {
    // Shared
    step,
    setStep,
    methods,
    stepNextHandler,
    stepBackHandler,
    getStepValidationFields,
    // Step One
    resetFormHandler,
    selectTokenHandler,
    feeTiers,
    selectFeeHandler,
    // Step Two
    isToken0Selected,
    setIsToken0Selected,
    handlePriceInput,
    handleSetMarketPrice,
    handleInitialPriceInput,
    handleDepositAmountInput,
    // Step Three
    submitHandler: (values: CreatePoolFormDefaultValues) => {},
  };
}
