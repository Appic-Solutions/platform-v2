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
import type { FeeTier, SelectFeeHandlerProps, SelectTokenHandlerProps } from '../../types';
import { alignMinOrMaxPrice } from '@/blockchain_api/functions/icp/dex/align_min_max';
import { calculate_mint_amounts } from '@/blockchain_api/functions/icp/dex/calculate_mint_amounts';
import { limitDecimalPlaces } from '@/lib/utils';
import BigNumber from 'bignumber.js';
import { useAuth } from '@nfid/identitykit/react';
import { Pool } from '@/blockchain_api/functions/icp/dex/get_pool';

export default function useCreatePositionLogic() {
  const { pools, icpBalance, icpIdentity, isIcpBalanceLoading } = useSharedStore();
  const [userTokenBalances, setUserTokenBalances] = useState<{
    token0Balance: string;
    token1Balance: string;
  }>();
  const { connect: openIcpModal } = useAuth();
  const [step, setStep] = useState(0);
  const [existPool, setExistPool] = useState<Pool>();
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
    Fee,
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
      'fee',
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
    setIsToken0Selected(!isToken0Selected);

    const price = BigNumber(initialPrice);
    if (!price || price.lte(0) || price.isNaN()) {
      createPositionForm.resetField('initialPrice');
      setIsToken0Selected(!isToken0Selected);
      return;
    }

    const newPrice = BigNumber(1).div(price).decimalPlaces(10).toString();

    createPositionForm.setValue('initialPrice', newPrice, {
      shouldValidate: true,
      shouldDirty: true,
    });

    createPositionForm.setValue('token0DepositAmount', '');
    createPositionForm.setValue('token1DepositAmount', '');
    createPositionForm.setValue('minPrice', 'min');
    createPositionForm.setValue('maxPrice', 'max');
    createPositionForm.trigger('initialPrice');
  };

  const handleInitialPriceInput = (value: string) => {
    createPositionForm.setValue('initialPrice', value, { shouldValidate: true, shouldDirty: true });
    createPositionForm.trigger('initialPrice');
  };

  const maxOrMinPriceHandler = ({ minValue, maxValue }: { minValue: string; maxValue: string }) => {
    const effectiveMinPrice = minValue === '0' ? 'min' : minValue || 'min';
    const effectiveMaxPrice =
      maxValue === '0' || maxValue === 'Infinity' ? 'max' : maxValue || 'max';

    createPositionForm.setValue('minPrice', effectiveMinPrice, { shouldValidate: true });
    createPositionForm.setValue('maxPrice', effectiveMaxPrice, { shouldValidate: true });

    if (
      createPositionForm.formState.errors.maxPrice ||
      createPositionForm.formState.errors.minPrice
    ) {
      console.log('errors:', createPositionForm.formState.errors);
      return;
    }

    const alignedPrice = alignMinOrMaxPrice({
      is_token0_selected: isToken0Selected,
      pool_sqrt_x98_price: sqrtPriceX96,
      min_price: effectiveMinPrice,
      max_price: effectiveMaxPrice,
      tick_spacing: tickSpacing,
      token0: Token0,
      token1: Token1,
    });

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
    createPositionForm.setValue('token0DepositAmount', '0');
    createPositionForm.setValue('token1DepositAmount', '0');

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
      createPositionForm.trigger(field);
      createPositionForm.setValue('token0DepositAmount', '');
      createPositionForm.setValue('token1DepositAmount', '');
      return;
    }

    if (validAmount.endsWith('.')) {
      return;
    }

    const parsed = parseFloat(validAmount);
    if (isNaN(parsed) || parsed < 0) {
      createPositionForm.setValue(field, '', {
        shouldValidate: true,
        shouldDirty: true,
      });
      return;
    }

    if (!Token0 || !Token1 || !sqrtPriceX96 || !minTick || !maxTick) {
      return;
    }

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

  const isTokenAmountsValid = () => {
    if (
      (isToken0DepositAmountActive && (token0DepositAmount === '0' || !token0DepositAmount)) ||
      (isToken1DepositAmountActive && (token1DepositAmount === '0' || !token1DepositAmount))
    ) {
      return false;
    } else {
      return true;
    }
  };

  const actionButtonHandler = () => {
    if (!icpIdentity) {
      return openIcpModal();
    }
    stepNextHandler();
  };

  const getActionButtonStatus = (): {
    isButtonDisabled: boolean;
    buttonText: string;
  } => {
    if (isIcpBalanceLoading) {
      return {
        isButtonDisabled: true,
        buttonText: 'Fetching wallet balance',
      };
    }

    if (
      !isTokenAmountsValid() ||
      !MinPrice ||
      !MaxPrice ||
      !minTick ||
      !maxTick ||
      !initialPrice ||
      isNaN(+initialPrice) ||
      !Fee ||
      createPositionForm.formState.errors.token0DepositAmount !== undefined ||
      createPositionForm.formState.errors.token1DepositAmount !== undefined ||
      createPositionForm.formState.errors.minPrice !== undefined ||
      createPositionForm.formState.errors.maxPrice !== undefined
    ) {
      return {
        buttonText: 'Review',
        isButtonDisabled: true,
      };
    }

    if (!icpIdentity) {
      return {
        buttonText: 'Connect Wallet',
        isButtonDisabled: false,
      };
    }

    if (
      !userTokenBalances ||
      !userTokenBalances.token0Balance ||
      !userTokenBalances.token1Balance ||
      +userTokenBalances.token0Balance < +token0DepositAmount ||
      +userTokenBalances.token1Balance < +token1DepositAmount
    ) {
      return {
        buttonText: 'Not Enough Balance',
        isButtonDisabled: true,
      };
    }

    return {
      buttonText: 'Review',
      isButtonDisabled: false,
    };
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
        const highestTvlFee = Number(feeTiersWithTvl[0].fee);

        const currentFee = createPositionForm.getValues('fee');
        if (currentFee !== highestTvlFee) {
          createPositionForm.setValue('fee', highestTvlFee);
        }
      }
    }
    feeManuallySelected.current = false;

    getTickSpacingHandler(createPositionForm.getValues('fee'));
  }, [Token0, Token1]);

  const actionButtonStatus = getActionButtonStatus();

  useEffect(() => {
    if (!icpBalance || !icpIdentity) return;

    const userToken0 = icpBalance.tokens.find((t) => t.canisterId === Token0?.canisterId);
    const userToken1 = icpBalance.tokens.find((t) => t.canisterId === Token1?.canisterId);

    setUserTokenBalances({
      token0Balance: userToken0?.balance ?? '0',
      token1Balance: userToken1?.balance ?? '0',
    });
  }, [icpBalance, icpIdentity]);

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
    userTokenBalances,
    selectFeeHandler,
    existPool,
    setExistPool,
    // Step Two
    isToken0Selected,
    setIsToken0Selected,
    maxOrMinPriceHandler,
    handleInitialPriceInput,
    handleDepositAmountInput,
    actionButtonStatus,
    actionButtonHandler,
    // Step Three
    submitHandler: (values: CreatePositionFormDefaultValues) => {},
  };
}
