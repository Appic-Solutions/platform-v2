'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import {
  CreatePoolFormDefaultValues,
  SelectFeeHandlerProps,
  SelectTokenHandlerProps,
} from '../_types';
import { sortTokens } from '@/blockchain_api/functions/icp/dex/utils/token_order';
import { CandidPoolId } from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
import { useSharedStore } from '@/store/store';
import { FEE_TIERS } from '@/blockchain_api/functions/icp/dex/constants';
import { Principal } from '@dfinity/principal';

export default function CreatePoolLogic() {
  // Store
  const { pools } = useSharedStore();

  // States
  const [step, setStep] = useState(0);
  const [feeTiers, setFeeTiers] = useState<(CandidPoolId & { tvl: string })[]>([]);

  // Form
  const methods = useForm<CreatePoolFormDefaultValues>({
    defaultValues: {
      searchTokenQuery: '',
      fee: 10000,
      // Token 0
      token0: undefined,
      token0InitialPrice: '',
      token0MinPrice: '',
      token0MaxPrice: '',
      token0MinDeposit: '',
      token0MaxDeposit: '',
      // Token 1
      token1: undefined,
      token1InitialPrice: '',
      token1MinPrice: '',
      token1MaxPrice: '',
      token1MinDeposit: '',
      token1MaxDeposit: '',
    },
  });

  const [Token0, Token1] = useWatch({
    control: methods.control,
    name: ['token0', 'token1'],
  });

  // Handlers
  const stepNextHandler = () => {
    setStep((prev) => prev - 1);
  };

  const stepBackHandler = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const resetFormHandler = () => {
    methods.reset();
    setFeeTiers([]);
  };

  // Select & Sort Token Section
  const selectTokenHandler = ({ name, value }: SelectTokenHandlerProps) => {
    methods.setValue(name, value);
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
        tvl: matchingPool?.tvl_usd || '0',
      };
    });

    setFeeTiers(updatedFeeTiers);
  }, [Token0, Token1]);

  const selectFeeHandler = (value: SelectFeeHandlerProps) => {
    methods.setValue('fee', value);
  };

  const submitHandler = (values: CreatePoolFormDefaultValues) => {};

  return {
    // Shared
    step,
    methods,
    stepNextHandler,
    stepBackHandler,
    // Step One
    resetFormHandler,
    selectTokenHandler,
    feeTiers,
    selectFeeHandler,
    // Step Two
    // Step Three
    submitHandler,
  };
}
