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
      minPrice: 'min',
      maxPrice: 'max',
      minTick: undefined,
      maxTick: undefined,
      token0DepositAmount: '',
      token1DepositAmount: '',
    },
    resolver: zodResolver(CreatePoolFormSchema),
    mode: 'onChange',
  });

  const [Token0, Token1, sqrtPriceX96, minTick, maxTick, initialPrice] = useWatch({
    control: methods.control,
    name: ['token0', 'token1', 'sqrtPriceX96', 'minTick', 'maxTick', 'initialPrice'],
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

  const handleSelectedTokenChange = () => {
    const price = parseFloat(initialPrice);

    if (!price || price <= 0 || isNaN(price)) {
      methods.resetField('initialPrice');
      setIsToken0Selected(!isToken0Selected);
      return;
    }

    const newValue = (1 / price).toFixed(18).replace(/\.?0+$/, '');

    setIsToken0Selected(!isToken0Selected);

    methods.setValue('initialPrice', newValue, {
      shouldValidate: true,
      shouldDirty: true,
    });

    methods.trigger('initialPrice');
  };

  const handleInitialPriceInput = (value: string) => {
    methods.setValue('initialPrice', value, { shouldValidate: true, shouldDirty: true });
    methods.trigger('initialPrice');
  };

  const handlePriceInput = ({ minOrMax, value }: HandlePriceProps) => {
    const field: CreatePoolFormKeys = minOrMax === 'min' ? 'minPrice' : 'maxPrice';
    const tickField: CreatePoolFormKeys = minOrMax === 'min' ? 'minTick' : 'maxTick';

    const price = () => {
      if (minOrMax === 'min' && (value === '0' || value === '')) return 'min';
      if (minOrMax === 'max' && (value === '0' || value === '')) return 'max';
      return value;
    };

    const alignedPrice = alignMinOrMaxPrice({
      is_token0_selected: isToken0Selected,
      token0: Token0,
      token1: Token1,
      price: price(),
      tick_spacing: methods.getValues('tickSpacing'),
    });

    if (value.trim() === '' || value === '0') {
      if (field === 'minPrice') {
        methods.setValue('minPrice', 'min', {
          shouldValidate: false,
          shouldDirty: true,
        });
        return;
      } else {
        methods.setValue('maxPrice', 'max', {
          shouldValidate: false,
          shouldDirty: true,
        });
        return;
      }
    }

    const floatValue = parseFloat(value);
    if (isNaN(floatValue)) return;

    if (!alignedPrice) return;

    methods.setValue(tickField, alignedPrice.tick.toString());

    const fixedPrice = Number(alignedPrice.price)
      .toFixed(6)
      .replace(/\.?0+$/, '');

    methods.setValue(field, fixedPrice, {
      shouldValidate: true,
      shouldDirty: true,
    });

    const dirtyFields = methods.formState.dirtyFields;
    const bothFieldsDirty = dirtyFields.minPrice && dirtyFields.maxPrice;

    if (bothFieldsDirty) {
      methods.trigger(['minPrice', 'maxPrice']);
    } else {
      methods.trigger(field);
    }
  };

  const handleDepositAmountInput = ({
    amount,
    isAmountZero,
  }: {
    isAmountZero: boolean;
    amount: string;
  }) => {
    const trimmed = amount.trim();
    const fieldToUpdate = isAmountZero ? 'token0DepositAmount' : 'token1DepositAmount';
    const otherField = isAmountZero ? 'token1DepositAmount' : 'token0DepositAmount';

    const validAmount = limitDecimalPlaces(trimmed);
    methods.setValue(fieldToUpdate, validAmount, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (!trimmed) {
      console.log('Empty input, skipping calculation');
      methods.trigger([fieldToUpdate]);
      return;
    }

    const parsed = parseFloat(validAmount);
    if (isNaN(parsed) || parsed < 0) {
      console.log('Invalid or negative amount, skipping calculation');
      methods.setValue(fieldToUpdate, '', {
        shouldValidate: true,
        shouldDirty: true,
      });
      return;
    }

    if (!Token0 || !Token1 || !sqrtPriceX96 || !minTick || !maxTick) {
      console.log('Missing prerequisites for calculation', {
        Token0,
        Token1,
        sqrtPriceX96,
        minTick,
        maxTick,
      });
      return;
    }

    try {
      const result = calculate_mint_amounts({
        selected_amount: validAmount,
        token0: Token0,
        token1: Token1,
        sqrt_price_x96: sqrtPriceX96,
        min_tick: minTick,
        max_tick: maxTick,
        is_amount_zero: isAmountZero,
      });

      console.log('Mint amounts calculated', result);

      // Update both fields only if calculation is successful
      methods.setValue('token0DepositAmount', result.token0.formatted, {
        shouldValidate: true,
        shouldDirty: true,
      });
      methods.setValue('token1DepositAmount', result.token1.formatted, {
        shouldValidate: true,
        shouldDirty: true,
      });

      methods.trigger(['token0DepositAmount', 'token1DepositAmount']);
    } catch (error) {
      console.error('Error calculating mint amounts:', error);
      methods.setError(fieldToUpdate, {
        type: 'manual',
        message: 'Failed to calculate deposit amounts',
      });
    }
  };

  const handleSetMarketPrice = () => {
    if (!Token0 || !Token1 || !icpTokens) return;
    const { price } = get_market_price(
      {
        is_token0_selected: isToken0Selected,
        token0: Token0,
        token1: Token1,
        price: initialPrice,
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
      matchedPool: undefined,
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
        matchedPool: matchingPool,
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
    handleSelectedTokenChange,
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
