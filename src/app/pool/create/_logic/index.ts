'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { FeeTier, SelectFeeHandlerProps, SelectTokenHandlerProps } from '../_types';
import { sortTokens } from '@/blockchain_api/functions/icp/dex/utils/token_order';
import { CandidPoolId } from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
import { useSharedStore } from '@/store/store';
import {
  FEE_TIERS,
  FEE_TIERS_DESC_MAP,
  getTickSpacing,
} from '@/blockchain_api/functions/icp/dex/constants';
import { Principal } from '@dfinity/principal';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreatePoolFormDefaultValues, CreatePoolFormKeys, CreatePoolSchema } from '../schema';
import { get_market_price } from '@/blockchain_api/functions/icp/dex/utils/price';
import { get_active_liquidity } from '@/blockchain_api/functions/icp/dex/get_active_ticks';

export default function CreatePoolLogic() {
  // Store
  const { pools, icpTokens } = useSharedStore();

  // States
  const [step, setStep] = useState(0);
  const [feeTiers, setFeeTiers] = useState<FeeTier[]>([]);
  const [isToken0Selected, setIsToken0Selected] = useState(true);

  // Form
  const methods = useForm<CreatePoolFormDefaultValues>({
    defaultValues: {
      searchTokenQuery: '',
      fee: 3000,
      tickSpacing: undefined,
      sqrtPriceX96: '',
      // Token 0
      token0: undefined,
      token0InitialPrice: '',
      token0MinPrice: '',
      token0MaxPrice: '',
      token0DepositAmount: '',
      // Token 1
      token1: undefined,
      token1InitialPrice: '',
      token1MinPrice: '',
      token1MaxPrice: '',
      token1DepositAmount: '',
    },
    resolver: zodResolver(CreatePoolSchema),
  });

  const [Token0, Token1] = useWatch({
    control: methods.control,
    name: ['token0', 'token1'],
  });

  const getStepValidationFields = (step: number): (keyof CreatePoolFormDefaultValues)[] => {
    switch (step) {
      case 0:
        return ['fee', 'token0', 'token1'];
      case 1:
        return ['token0InitialPrice', 'token1InitialPrice'];
      case 2:
        return ['token0DepositAmount', 'token1DepositAmount'];
      default:
        return [];
    }
  };

  // Handlers
  const stepNextHandler = async () => {
    const fieldsToValidate = getStepValidationFields(step);
    const isValid = await methods.trigger(fieldsToValidate);
    if (!isValid) return;
    setStep((prev) => prev + 1);
  };

  const stepBackHandler = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const resetFormHandler = () => {
    methods.reset();
    setFeeTiers([]);
  };

  const handleMinPriceInput = (value: string) => {
    const field: CreatePoolFormKeys = isToken0Selected ? 'token0MinPrice' : 'token1MinPrice';
    const parsedValue = value === '' ? '' : parseFloat(value) >= 0 ? value : '0';
    methods.setValue(field, parsedValue, { shouldValidate: true, shouldDirty: true });
    methods.trigger(field);
  };

  const handleMaxPriceInput = (value: string) => {
    const field: CreatePoolFormKeys = isToken0Selected ? 'token0MaxPrice' : 'token1MaxPrice';
    const parsedValue = value === '' ? '' : parseFloat(value) >= 0 ? value : '0';
    methods.setValue(field, parsedValue, { shouldValidate: true, shouldDirty: true });
    methods.trigger(field);
  };

  const handleInitialPriceInput = (value: string) => {
    const field = isToken0Selected ? 'token0InitialPrice' : 'token1InitialPrice';
    methods.setValue(field, value, { shouldValidate: true, shouldDirty: true });
    methods.trigger(field);
  };

  const handleSetMarketPrice = () => {
    if (!Token0 || !Token1 || !icpTokens) return;
    const { price } = get_market_price(
      { is_token0_selected: isToken0Selected, token0: Token0, token1: Token1, price: '0' },
      icpTokens,
    );
    handleInitialPriceInput(price);
  };

  // const getActiveLiquidityHandler = () => {
  //   get_active_liquidity({
  //     is_token0_selected: isToken0Selected,
  //     pool_id
  //   })
  // }

  // Select & Sort Token Section
  const selectTokenHandler = ({ name, value }: SelectTokenHandlerProps) => {
    resetFieldsOnSelectToken(name);
    methods.setValue(name, value);
    methods.clearErrors(name);
  };

  const resetFieldsOnSelectToken = (fieldName: string) => {
    methods.setValue('token0InitialPrice', '');
    methods.setValue('token1InitialPrice', '');
    methods.setValue('token0MinPrice', '');
    methods.setValue('token1MinPrice', '');
    methods.setValue('token0MaxPrice', '');
    methods.setValue('token1MaxPrice', '');
    methods.setValue('token0DepositAmount', '');
    methods.setValue('token1DepositAmount', '');
    setFeeTiers([]);
    methods.trigger();
  };

  useEffect(() => {
    if (!Token0 || !Token1 || !Token0.canisterId || !Token1.canisterId) return;
    getTickSpacingHandler(methods.getValues('fee'));
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

      if (matchingPool) {
        feeTier.isExist = true;
      } else {
        feeTier.isExist = false;
      }
      return {
        ...feeTier,
        tvl: matchingPool?.tvl_usd || '0',
      };
    });

    setFeeTiers(updatedFeeTiers);
    if (updatedFeeTiers.length > 0) {
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
        getTickSpacingHandler(Number(highestTvlFee));
      }
    }
  }, [Token0, Token1]);

  const selectFeeHandler = (value: SelectFeeHandlerProps) => {
    methods.setValue('fee', value);
    methods.clearErrors('fee');
    getTickSpacingHandler(value);
  };

  const getTickSpacingHandler = (fee: number) => {
    const tickSpacing = getTickSpacing(fee);
    methods.setValue('tickSpacing', tickSpacing ?? 0);
  };

  const submitHandler = (values: CreatePoolFormDefaultValues) => {};

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
    handleMinPriceInput,
    handleMaxPriceInput,
    handleSetMarketPrice,
    handleInitialPriceInput,
    // Step Three
    submitHandler,
  };
}
