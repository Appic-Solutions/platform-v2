'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Principal } from '@dfinity/principal';

import { useSharedStore } from '@/store/store';
import {
  FEE_TIERS,
  FEE_TIERS_DESC_MAP,
  getTickSpacing,
} from '@/blockchain_api/functions/icp/dex/constants';

import { sortTokens } from '@/blockchain_api/functions/icp/dex/utils/token_order';
import { CreatePositionFormDefaultValues, CreatePositionFormSchema } from '../schema';
import type { FeeTier, SelectFeeHandlerProps, SelectTokenHandlerProps } from '../_types';
import { alignMinOrMaxPrice } from '@/blockchain_api/functions/icp/dex/align_min_max';
import { calculate_mint_amounts } from '@/blockchain_api/functions/icp/dex/calculate_mint_amounts';
import { limitDecimalPlaces } from '@/lib/utils';
import BigNumber from 'bignumber.js';

export default function useCreatePositionLogic() {
  const { pools } = useSharedStore();

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
      isToken0DepositAmountActive: true,
      isToken1DepositAmountActive: true,
    },
    resolver: zodResolver(CreatePositionFormSchema),
    mode: 'onChange',
  });

  const [
    Token0,
    Token1,
    sqrtPriceX96,
    minTick,
    maxTick,
    initialPrice,
    tickSpacing,
    MinPrice,
    MaxPrice,
    token0DepositAmount,
    token1DepositAmount,
    isToken0DepositAmountActive,
    isToken1DepositAmountActive,
  ] = useWatch({
    control: createPositionForm.control,
    name: [
      'token0',
      'token1',
      'sqrtPriceX96',
      'minTick',
      'maxTick',
      'initialPrice',
      'tickSpacing',
      'minPrice',
      'maxPrice',
      'token0DepositAmount',
      'token1DepositAmount',
      'isToken0DepositAmountActive',
      'isToken1DepositAmountActive',
    ],
  });

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
    createPositionForm.setValue('token0DepositAmount', '');
    createPositionForm.setValue('token1DepositAmount', '');
    createPositionForm.setValue('minPrice', 'min');
    createPositionForm.setValue('maxPrice', 'max');

    const price = BigNumber(initialPrice);

    if (!price || price.lte(0) || price.isNaN()) {
      createPositionForm.resetField('initialPrice');
      setIsToken0Selected(!isToken0Selected);
      return;
    }

    const newPrice = BigNumber(1).div(price).decimalPlaces(10).toString();

    setIsToken0Selected(!isToken0Selected);

    createPositionForm.setValue('initialPrice', newPrice, {
      shouldValidate: true,
      shouldDirty: true,
    });

    createPositionForm.trigger('initialPrice');
  };

  const handleInitialPriceInput = (value: string) => {
    createPositionForm.setValue('initialPrice', value, { shouldValidate: true, shouldDirty: true });
    createPositionForm.trigger('initialPrice');
  };

  const maxOrMinPriceHandler = ({ isMinPrice, value }: { value: string; isMinPrice: boolean }) => {
    console.log('price handler =======>');

    const effectiveMinPrice =
      isMinPrice && value === '0' ? 'min' : isMinPrice ? value || 'min' : MinPrice || 'min';
    const effectiveMaxPrice =
      !isMinPrice && value === '0' ? 'max' : !isMinPrice ? value || 'max' : MaxPrice || 'max';

    console.log({
      is_min_price: isMinPrice,
      is_token0_selected: isToken0Selected,
      pool_sqrt_x98_price: sqrtPriceX96,
      min_price: effectiveMinPrice,
      max_price: effectiveMaxPrice,
      tick_spacing: tickSpacing,
      token0: Token0,
      token1: Token1,
    });

    const alignedPrice = alignMinOrMaxPrice({
      is_min_price: isMinPrice,
      is_token0_selected: isToken0Selected,
      pool_sqrt_x98_price: sqrtPriceX96,
      min_price: effectiveMinPrice,
      max_price: effectiveMaxPrice,
      tick_spacing: tickSpacing,
      token0: Token0,
      token1: Token1,
    });

    console.log('aligned price', alignedPrice);

    if (!alignedPrice) return;

    createPositionForm.setValue(
      'minPrice',
      effectiveMinPrice === 'min' ? 'min' : alignedPrice.min_price.toString(),
    );
    createPositionForm.setValue(
      'maxPrice',
      effectiveMaxPrice === 'max' ? 'max' : alignedPrice.max_price.toString(),
    );
    createPositionForm.setValue('minTick', alignedPrice.min_tick.toString());
    createPositionForm.setValue('maxTick', alignedPrice.max_tick.toString());
    createPositionForm.setValue('isToken0DepositAmountActive', alignedPrice.is_token0_active);
    createPositionForm.setValue('isToken1DepositAmountActive', alignedPrice.is_token1_active);

    if (!alignedPrice.is_token0_active && createPositionForm.getValues('token0DepositAmount')) {
      createPositionForm.setValue('token0DepositAmount', '');
    }
    if (!alignedPrice.is_token1_active && createPositionForm.getValues('token1DepositAmount')) {
      createPositionForm.setValue('token1DepositAmount', '');
    }

    createPositionForm.trigger('maxPrice');
    createPositionForm.trigger('minPrice');
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
      createPositionForm.setValue('token0DepositAmount', '');
      createPositionForm.setValue('token1DepositAmount', '');
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

      if (isToken0DepositAmountActive) {
        createPositionForm.setValue('token0DepositAmount', result.token0.formatted, {
          shouldValidate: true,
          shouldDirty: true,
        });
        createPositionForm.trigger('token0DepositAmount');
      }
      if (isToken1DepositAmountActive) {
        createPositionForm.setValue('token1DepositAmount', result.token1.formatted, {
          shouldValidate: true,
          shouldDirty: true,
        });
        createPositionForm.trigger('token1DepositAmount');
      }

      console.log('token0DepositAmount', token0DepositAmount);
      console.log('token1DepositAmount', token1DepositAmount);
    } catch (error) {
      console.error('Error calculating mint amounts:', error);
      createPositionForm.setError(field, {
        type: 'manual',
        message: 'Failed to calculate deposit amounts',
      });
    }
  };

  const selectTokenHandler = ({ name, value }: SelectTokenHandlerProps) => {
    createPositionForm.setValue('token0DepositAmount', '');
    createPositionForm.setValue('token1DepositAmount', '');
    createPositionForm.setValue('minPrice', 'min');
    createPositionForm.setValue('maxPrice', 'max');
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
    const tickSpacing = getTickSpacing(fee) ?? 0;
    const current = createPositionForm.getValues('tickSpacing');

    if (current !== tickSpacing) {
      createPositionForm.setValue('tickSpacing', tickSpacing);
    }
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
    feeManuallySelected.current = false;

    getTickSpacingHandler(createPositionForm.getValues('fee'));
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
    maxOrMinPriceHandler,
    handleInitialPriceInput,
    handleDepositAmountInput,
    // Step Three
    submitHandler: (values: CreatePositionFormDefaultValues) => {},
  };
}
