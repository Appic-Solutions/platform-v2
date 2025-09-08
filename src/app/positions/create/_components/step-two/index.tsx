import React, { useEffect } from 'react';
import StepTwoPoolNotExist from './StepTwoPoolNotExist';
import { useWatch } from 'react-hook-form';
import SolidCard from '@/components/ui/cards/SolidCard';
import PriceRangeInputs from './PriceRangeInputs';
import DepositTokenInputs from './DepositTokenInputs';
import StepTwoPoolExist from './StepTwoPoolExist';
import { useCreatePosition } from '../../_context/CreatePositionContext';
import AvatarGroup from '@/app/positions/_components/AvatarGroup';
import { ArrowLeftIcon } from '@/components/icons';

const CreatePositionStepTwo = () => {
  const {
    feeTiers,
    createPositionForm,
    actionButtonStatus,
    actionButtonHandler,
    existPool,
    setExistPool,
    setStep,
  } = useCreatePosition();
  const [token0, token1, fee] = useWatch({
    control: createPositionForm.control,
    name: ['token0', 'token1', 'fee'],
  });

  useEffect(() => {
    const selectedFee = feeTiers.find((tier) => Number(tier.fee) === fee);
    if (selectedFee && selectedFee.matchedPool) {
      setExistPool(selectedFee.matchedPool);
    } else {
      setExistPool(undefined);
    }
  }, [fee, feeTiers]);

  return (
    <div className="flex w-full animate-fade select-none flex-col gap-8 lg:flex-row lg:gap-12">
      {/* chart & details & chart controls */}
      <div className="flex h-full w-full flex-col gap-6 lg:w-[59%]">
        {/* header */}
        <div className="flex w-full items-center justify-between">
          <div className="flex w-full items-center gap-2 lg:gap-4">
            <ArrowLeftIcon
              onClick={() => setStep(0)}
              className="z-10 inline-block cursor-pointer lg:hidden"
            />
            <AvatarGroup avatar0={token0.logo} avatar1={token1.logo} />
            <div className="flex text-2xl font-bold lg:text-3xl">
              <h3 className="max-w-24 text-ellipsis xs:max-w-40 md:max-w-96">{token0.symbol}</h3>/
              <h3 className="max-w-24 text-ellipsis xs:max-w-40 md:max-w-96">{token1.symbol}</h3>
            </div>
          </div>
          <div className="flex items-center gap-x-1">
            <SolidCard size="sm">
              <span className="text-xs leading-5 text-white/60">{Number(fee) / 10000}%</span>
            </SolidCard>
          </div>
        </div>

        {existPool ? <StepTwoPoolExist /> : <StepTwoPoolNotExist />}
      </div>

      <div className="flex h-full w-full select-none flex-col gap-6 text-white lg:w-[41%]">
        <PriceRangeInputs />
        <DepositTokenInputs />
        <button
          onClick={actionButtonHandler}
          disabled={actionButtonStatus.isButtonDisabled}
          type="button"
          className="h-12 rounded-xl bg-primary-buttons disabled:cursor-not-allowed disabled:opacity-50"
        >
          {actionButtonStatus.buttonText}
        </button>
      </div>
    </div>
  );
};

export default CreatePositionStepTwo;
