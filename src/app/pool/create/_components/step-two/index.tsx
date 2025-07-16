import React, { useEffect, useState } from 'react';
import AvatarGroup from './AvatarGroup';
import StepTwoPoolNotExist from './StepTwoPoolNotExist';
import { useFormContext, useWatch } from 'react-hook-form';
import { CreatePoolFormDefaultValues } from '../../schema';
import SolidCard from '@/components/ui/cards/SolidCard';
import PriceRangeInputs from './PriceRangeInputs';
import DepositTokenInputs from './DepositTokenInputs';
import StepTwoPoolExist from './StepTwoPoolExist';
import { useCreatePoolStore } from '../../useCreatePoolStore';

const CreatePositionStepTwo = () => {
  const {
    isToken0Selected,
    setIsToken0Selected,
    handlePriceInput,
    handleInitialPriceInput,
    handleDepositAmountInput,
    handleSetMarketPrice,
    feeTiers,
    methods,
    stepNextHandler,
  } = useCreatePoolStore();
  const {
    control,
    formState: { isValid },
  } = useFormContext<CreatePoolFormDefaultValues>();
  const [token0, token1, fee] = useWatch({
    control,
    name: ['token0', 'token1', 'fee'],
  });
  const [isPoolExist, setIsPoolExist] = useState(false);

  useEffect(() => {
    const selectedFee = feeTiers.find((tier) => Number(tier.fee) === fee);
    if (selectedFee && selectedFee.isExist) {
      setIsPoolExist(true);
    } else {
      setIsPoolExist(false);
    }
  });

  return (
    <div className="flex w-full animate-fade select-none flex-col gap-8 lg:flex-row lg:gap-12">
      {/* chart & details & chart controls */}
      <div className="flex h-full w-full flex-col gap-6 lg:w-[59%]">
        {/* header */}
        <div className="flex w-full items-center justify-between">
          <div className="flex w-full items-center gap-2 lg:gap-4">
            <AvatarGroup token0={token0} token1={token1} />
            <h3 className="text-[27px] font-bold lg:text-[40px]">
              {token0.symbol}/{token1.symbol}
            </h3>
          </div>
          <div className="flex items-center gap-x-1">
            <SolidCard size="sm">
              <span className="text-xs leading-5 text-white/60">{Number(fee) / 10000}%</span>
            </SolidCard>
          </div>
        </div>

        {isPoolExist ? (
          <StepTwoPoolExist handlePriceInput={handlePriceInput} />
        ) : (
          <StepTwoPoolNotExist
            methods={methods}
            isToken0Selected={isToken0Selected}
            setIsToken0Selected={setIsToken0Selected}
            handleInitialPriceInput={handleInitialPriceInput}
            handleSetMarketPrice={handleSetMarketPrice}
          />
        )}
      </div>

      {/* boxes */}
      <div className="flex h-full w-full select-none flex-col gap-9 text-white lg:w-[41%]">
        <PriceRangeInputs
          methods={methods}
          isToken0Selected={isToken0Selected}
          handlePriceInput={handlePriceInput}
        />
        {/* deposit tokens boxes */}
        <DepositTokenInputs handleDepositAmountInput={handleDepositAmountInput} />
        <button
          onClick={stepNextHandler}
          disabled={!isValid}
          type="button"
          className="h-[50px] rounded-[15px] bg-primary-buttons disabled:cursor-not-allowed disabled:opacity-50 lg:h-[66px]"
        >
          Review
        </button>
      </div>
    </div>
  );
};

export default CreatePositionStepTwo;
