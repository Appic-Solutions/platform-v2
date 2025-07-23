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
import {
  CreatePositionFormDefaultValues,
  CreatePositionFormKeys,
  CreatePositionFormSchema,
} from '../schema';
import type {
  FeeTier,
  HandlePriceProps,
  SelectFeeHandlerProps,
  SelectTokenHandlerProps,
} from '../_types';
import { alignMinOrMaxPrice } from '@/blockchain_api/functions/icp/dex/align_min_max';
import { calculate_mint_amounts } from '@/blockchain_api/functions/icp/dex/calculate_mint_amounts';
import { limitDecimalPlaces } from '@/lib/utils';

export default function useCreatePositionLogic() {
  const { pools, icpTokens } = useSharedStore();

  const [step, setStep] = useState(0);
  const [feeTiers, setFeeTiers] = useState<FeeTier[]>([]);
  const [isToken0Selected, setIsToken0Selected] = useState(true);
  const feeManuallySelected = useRef(false);

  const createPositionForm = useForm<CreatePositionFormDefaultValues>({
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
    resolver: zodResolver(CreatePositionFormSchema),
    mode: 'onChange',
  });

  const [Token0, Token1, sqrtPriceX96, minTick, maxTick, initialPrice] = useWatch({
    control: createPositionForm.control,
    name: ['token0', 'token1', 'sqrtPriceX96', 'minTick', 'maxTick', 'initialPrice'],
  });

  // we don't use it
  const getStepValidationFields = (step: number): (keyof CreatePositionFormDefaultValues)[] => {
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
    const isValid = await createPositionForm.trigger(fields);

    if (!isValid) return;
    setStep((prev) => prev + 1);
  };

  const stepBackHandler = () => setStep((prev) => Math.max(prev - 1, 0));

  const resetFormHandler = () => {
    createPositionForm.reset();
    setFeeTiers([]);
    setStep(0);
  };

  const handleSelectedTokenChange = () => {
    const price = parseFloat(initialPrice);

    if (!price || price <= 0 || isNaN(price)) {
      createPositionForm.resetField('initialPrice');
      setIsToken0Selected(!isToken0Selected);
      return;
    }

    const newValue = (1 / price).toFixed(18).replace(/\.?0+$/, '');

    setIsToken0Selected(!isToken0Selected);

    createPositionForm.setValue('initialPrice', newValue, {
      shouldValidate: true,
      shouldDirty: true,
    });

    createPositionForm.trigger('initialPrice');
  };

  const handleInitialPriceInput = (value: string) => {
    createPositionForm.setValue('initialPrice', value, { shouldValidate: true, shouldDirty: true });
    createPositionForm.trigger('initialPrice');
  };

  const handlePriceInput = ({ minOrMax, value }: HandlePriceProps) => {
    const field: CreatePositionFormKeys = minOrMax === 'min' ? 'minPrice' : 'maxPrice';
    const tickField: CreatePositionFormKeys = minOrMax === 'min' ? 'minTick' : 'maxTick';

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
      tick_spacing: createPositionForm.getValues('tickSpacing'),
    });

    console.log('alignedPrice calculated ==========>', alignedPrice);

    if (value.trim() === '' || value === '0') {
      if (field === 'minPrice') {
        createPositionForm.setValue('minPrice', 'min', {
          shouldValidate: false,
          shouldDirty: true,
        });
      } else {
        createPositionForm.setValue('maxPrice', 'max', {
          shouldValidate: false,
          shouldDirty: true,
        });
      }
      createPositionForm.setValue(tickField, alignedPrice.tick.toString());
      return;
    }

    const floatValue = parseFloat(value);
    if (isNaN(floatValue)) return;

    if (!alignedPrice) return;

    createPositionForm.setValue(tickField, alignedPrice.tick.toString());

    const fixedPrice = Number(alignedPrice.price)
      .toFixed(6)
      .replace(/\.?0+$/, '');

    createPositionForm.setValue(field, fixedPrice, {
      shouldValidate: true,
      shouldDirty: true,
    });

    const dirtyFields = createPositionForm.formState.dirtyFields;
    const bothFieldsDirty = dirtyFields.minPrice && dirtyFields.maxPrice;

    if (bothFieldsDirty) {
      createPositionForm.trigger('minPrice');
      createPositionForm.trigger('maxPrice');
    } else {
      createPositionForm.trigger(field);
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
    const field = isAmountZero ? 'token0DepositAmount' : 'token1DepositAmount';

    const validAmount = limitDecimalPlaces(trimmed);
    createPositionForm.setValue(field, validAmount, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (!trimmed) {
      console.log('Empty input, skipping calculation');
      createPositionForm.trigger(field);
      return;
    }

    const parsed = parseFloat(validAmount);
    if (isNaN(parsed) || parsed < 0) {
      console.log('Invalid or negative amount, skipping calculation');
      createPositionForm.setValue(field, '', {
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

    console.log({
      selected_amount: validAmount,
      token0: Token0,
      token1: Token1,
      sqrt_price_x96: sqrtPriceX96,
      min_tick: minTick,
      max_tick: maxTick,
      is_amount_zero: isAmountZero,
    });
    if (!minTick || !maxTick) {
      createPositionForm.trigger('minTick');
      createPositionForm.trigger('maxTick');
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

      console.log('Mint amounts calculated', {
        result,
        token0Amount: result.token0.formatted,
        token1Amount: result.token1.formatted,
        isAmountZero,
      });

      createPositionForm.setValue('token0DepositAmount', result.token0.formatted, {
        shouldValidate: true,
        shouldDirty: true,
      });
      createPositionForm.setValue('token1DepositAmount', result.token1.formatted, {
        shouldValidate: true,
        shouldDirty: true,
      });

      createPositionForm.trigger('token0DepositAmount');
      createPositionForm.trigger('token1DepositAmount');
    } catch (error) {
      console.error('Error calculating mint amounts:', error);
      createPositionForm.setError(field, {
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
    createPositionForm.setValue('token0DepositAmount', '');
    createPositionForm.setValue('token1DepositAmount', '');
    createPositionForm.setValue('minPrice', '');
    createPositionForm.setValue('maxPrice', '');
    createPositionForm.setValue('initialPrice', '');
    createPositionForm.setValue('sqrtPriceX96', '');
    createPositionForm.setValue('tickSpacing', 0);
    createPositionForm.setValue('fee', 3000);
    createPositionForm.setValue(name, value);
    createPositionForm.clearErrors();
  };

  const selectFeeHandler = (value: SelectFeeHandlerProps) => {
    feeManuallySelected.current = true;
    createPositionForm.setValue('fee', value);
    createPositionForm.clearErrors('fee');
    getTickSpacingHandler(value);
  };

  const getTickSpacingHandler = (fee: number) => {
    const tickSpacing = getTickSpacing(fee);
    createPositionForm.setValue('tickSpacing', tickSpacing ?? 0);
  };

  useEffect(() => {
    if (!Token0 || !Token1 || !Token0.canisterId || !Token1.canisterId) return;

    const { token0, token1 } = sortTokens(Token0, Token1);

    if (token0.canisterId !== Token0.canisterId || token1.canisterId !== Token1.canisterId) {
      createPositionForm.setValue('token0', token0);
      createPositionForm.setValue('token1', token1);
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
        createPositionForm.setValue('fee', Number(highestTvlFee));
      }
    }
    getTickSpacingHandler(createPositionForm.getValues('fee'));

    feeManuallySelected.current = false;
  }, [Token0, Token1]);

  return {
    step,
    setStep,
    createPositionForm,
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
    submitHandler: (values: CreatePositionFormDefaultValues) => {},
  };
}
