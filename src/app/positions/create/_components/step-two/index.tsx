import React, { useEffect, useState } from 'react';
import AvatarGroup from './AvatarGroup';
import StepTwoPoolNotExist from './StepTwoPoolNotExist';
import { useWatch } from 'react-hook-form';
import SolidCard from '@/components/ui/cards/SolidCard';
import PriceRangeInputs from './PriceRangeInputs';
import DepositTokenInputs from './DepositTokenInputs';
import StepTwoPoolExist from './StepTwoPoolExist';
import { Pool } from '@/blockchain_api/functions/icp/dex/get_pool';
import { useCreatePosition } from '../../_context/CreatePositionContext';

const CreatePositionStepTwo = () => {
  const { feeTiers, stepNextHandler, createPositionForm } = useCreatePosition();
  const [
    token0,
    token1,
    fee,
    minPrice,
    maxPrice,
    minTick,
    maxTick,
    initialPrice,
    token0DepositAmount,
    token1DepositAmount,
    isToken0DepositAmountActive,
    isToken1DepositAmountActive,
  ] = useWatch({
    control: createPositionForm.control,
    name: [
      'token0',
      'token1',
      'fee',
      'minPrice',
      'maxPrice',
      'minTick',
      'maxTick',
      'initialPrice',
      'token0DepositAmount',
      'token1DepositAmount',
      'isToken0DepositAmountActive',
      'isToken1DepositAmountActive',
    ],
  });

  const [existPool, setExistPool] = useState<Pool>();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    const selectedFee = feeTiers.find((tier) => Number(tier.fee) === fee);
    if (selectedFee && selectedFee.matchedPool) {
      setExistPool(selectedFee.matchedPool);
    } else {
      setExistPool(undefined);
    }
  }, [fee, feeTiers]);

  const checkTokenAmounts = () => {
    if (
      (isToken0DepositAmountActive && (token0DepositAmount === '0' || !token0DepositAmount)) ||
      (isToken1DepositAmountActive && (token1DepositAmount === '0' || !token1DepositAmount))
    ) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (
      token0 &&
      token1 &&
      minPrice &&
      maxPrice &&
      minTick &&
      maxTick &&
      initialPrice &&
      fee &&
      !checkTokenAmounts() &&
      createPositionForm.formState.errors.token0DepositAmount === undefined &&
      createPositionForm.formState.errors.token1DepositAmount === undefined &&
      createPositionForm.formState.errors.minPrice === undefined &&
      createPositionForm.formState.errors.maxPrice === undefined
    ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [
    token0,
    token1,
    minPrice,
    maxPrice,
    minTick,
    maxTick,
    initialPrice,
    fee,
    isToken0DepositAmountActive,
    token0DepositAmount,
    isToken1DepositAmountActive,
    token1DepositAmount,
  ]);

  return (
    <div className="flex w-full animate-fade select-none flex-col gap-8 lg:flex-row lg:gap-12">
      {/* chart & details & chart controls */}
      <div className="flex h-full w-full flex-col gap-6 lg:w-[59%]">
        {/* header */}
        <div className="flex w-full items-center justify-between">
          <div className="flex w-full items-center gap-2 lg:gap-4">
            <AvatarGroup token0={token0} token1={token1} />
            <h3 className="text-2xl font-bold lg:text-3xl">
              {token0.symbol}/{token1.symbol}
            </h3>
          </div>
          <div className="flex items-center gap-x-1">
            <SolidCard size="sm">
              <span className="text-xs leading-5 text-white/60">{Number(fee) / 10000}%</span>
            </SolidCard>
          </div>
        </div>

        {existPool ? <StepTwoPoolExist matchedPool={existPool} /> : <StepTwoPoolNotExist />}
      </div>

      {/* boxes */}
      <div className="flex h-full w-full select-none flex-col gap-6 text-white lg:w-[41%]">
        <PriceRangeInputs />
        {/* deposit tokens boxes */}
        <DepositTokenInputs />
        <button
          onClick={stepNextHandler}
          disabled={isButtonDisabled}
          type="button"
          className="h-12 rounded-xl bg-primary-buttons disabled:cursor-not-allowed disabled:opacity-50"
        >
          Review
        </button>
      </div>
    </div>
  );
};

export default CreatePositionStepTwo;
