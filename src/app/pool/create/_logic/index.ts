'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { SelectFeeHandlerProps, SelectTokenHandlerProps } from '../_types';
import { sortTokens } from '@/blockchain_api/functions/icp/dex/utils/token_order';
import { CandidPoolId } from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
import { useSharedStore } from '@/store/store';
import { FEE_TIERS, FEE_TIERS_DESC_MAP } from '@/blockchain_api/functions/icp/dex/constants';
import { Principal } from '@dfinity/principal';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreatePoolFormDefaultValues, CreatePoolSchema } from '../schema';

export default function CreatePoolLogic() {
  // Store
  const { pools } = useSharedStore();

  // States
  const [step, setStep] = useState(0);
  const [feeTiers, setFeeTiers] = useState<(CandidPoolId & { tvl: string; desc: string })[]>([]);

  // Form
  const methods = useForm<CreatePoolFormDefaultValues>({
    defaultValues: {
      searchTokenQuery: '',
      fee: 3000,
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
        return ['token0MinDeposit', 'token1MinDeposit'];
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

  // Select & Sort Token Section
  const selectTokenHandler = ({ name, value }: SelectTokenHandlerProps) => {
    methods.setValue(name, value);
    methods.clearErrors(name);
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
      }
    }
  }, [Token0, Token1]);

  const selectFeeHandler = (value: SelectFeeHandlerProps) => {
    methods.setValue('fee', value);
    methods.clearErrors('fee');
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
