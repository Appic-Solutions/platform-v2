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
import BigNumber from 'bignumber.js';
import { IcpToken } from '@/blockchain_api/types/tokens';

export default function useCreatePositionLogic() {
  const { pools, icpTokens } = useSharedStore();

  const [step, setStep] = useState(0);
  const [feeTiers, setFeeTiers] = useState<FeeTier[]>([]);
  const [isToken0Selected, setIsToken0Selected] = useState(true);
  const [depositAmountInputsActiveStatus, setDepositAmountInputsActiveStatus] = useState<{
    isToken0Active: boolean;
    isToken1Active: boolean;
  }>();
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
    ],
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
    createPositionForm.resetField('token0DepositAmount');
    createPositionForm.resetField('token1DepositAmount');
    createPositionForm.resetField('minPrice');
    createPositionForm.resetField('maxPrice');
    createPositionForm.trigger('initialPrice');
  };

  const isDefaultValue = (val: string, label: string) => val === '' || val === '0' || val === label;

  const setFormValue = (name: CreatePositionFormKeys, value: string) => {
    createPositionForm.setValue(name, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const minPriceHandler = (value: string) => {
    console.log('min price handler =======>');
    console.log({
      is_min_price: true,
      is_token0_selected: isToken0Selected,
      pool_sqrt_x98_price: sqrtPriceX96,
      min_price: value || 'min',
      max_price: MaxPrice || 'max',
      tick_spacing: tickSpacing,
      token0: Token0,
      token1: Token1,
    });
    const alignedPrice = alignMinOrMaxPrice({
      is_min_price: true,
      is_token0_selected: isToken0Selected,
      pool_sqrt_x98_price: sqrtPriceX96,
      min_price: value || 'min',
      max_price: MaxPrice || 'max',
      tick_spacing: tickSpacing,
      token0: Token0,
      token1: Token1,
    });

    if (!alignedPrice) return;

    // Set min price and tick
    setFormValue(
      'minPrice',
      isDefaultValue(value, 'min') ? 'min' : alignedPrice.min_price.toString(),
    );
    setFormValue('minTick', alignedPrice.min_tick.toString());

    // Set max price and tick
    setFormValue(
      'maxPrice',
      isDefaultValue(MaxPrice, 'max') ? 'max' : alignedPrice.max_price.toString(),
    );
    setDepositAmountInputsActiveStatus({
      isToken0Active: alignedPrice.is_token0_active,
      isToken1Active: alignedPrice.is_token1_active,
    });
    setFormValue('maxTick', alignedPrice.max_tick.toString());
  };

  const maxPriceHandler = (value: string) => {
    console.log('max price handler =======>');
    console.log({
      is_min_price: false,
      is_token0_selected: isToken0Selected,
      pool_sqrt_x98_price: sqrtPriceX96,
      min_price: MinPrice || 'min',
      max_price: value || 'max',
      tick_spacing: tickSpacing,
      token0: Token0,
      token1: Token1,
    });
    const alignedPrice = alignMinOrMaxPrice({
      is_min_price: false,
      is_token0_selected: isToken0Selected,
      pool_sqrt_x98_price: sqrtPriceX96,
      min_price: MinPrice || 'min',
      max_price: value || 'max',
      tick_spacing: tickSpacing,
      token0: Token0,
      token1: Token1,
    });

    if (!alignedPrice) return;

    // Set min price and tick
    setFormValue(
      'minPrice',
      isDefaultValue(MinPrice, 'min') ? 'min' : alignedPrice.min_price.toString(),
    );
    setFormValue('minTick', alignedPrice.min_tick.toString());

    // Set max price and tick
    setFormValue(
      'maxPrice',
      isDefaultValue(value, 'max') ? 'max' : alignedPrice.max_price.toString(),
    );
    setFormValue('maxTick', alignedPrice.max_tick.toString());
    setDepositAmountInputsActiveStatus({
      isToken0Active: alignedPrice.is_token0_active,
      isToken1Active: alignedPrice.is_token1_active,
    });
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

      if (depositAmountInputsActiveStatus?.isToken0Active) {
        createPositionForm.setValue('token0DepositAmount', result.token0.formatted, {
          shouldValidate: true,
          shouldDirty: true,
        });
        createPositionForm.trigger('token0DepositAmount');
      }
      if (depositAmountInputsActiveStatus?.isToken1Active) {
        createPositionForm.setValue('token1DepositAmount', result.token1.formatted, {
          shouldValidate: true,
          shouldDirty: true,
        });
        createPositionForm.trigger('token1DepositAmount');
      }
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
    // handlePriceInput,
    minPriceHandler,
    maxPriceHandler,
    handleInitialPriceInput,
    handleDepositAmountInput,
    depositAmountInputsActiveStatus,
    setDepositAmountInputsActiveStatus,
    // Step Three
    submitHandler: (values: CreatePositionFormDefaultValues) => {},
  };
}
