'use client';
import { calculatePercent, cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import Box from '@/components/ui/box';
import Details from './Details';
import { PositionDetailsProps, Step, PositionPercentage, FeesPercentage } from '../../types';
import AddLiquidity from './add-liquidity';
import RemoveLiquidity from './remove-liquidity';
import CollectFees from './collect-fees';
import { useSharedStore } from '@/store/store';

const PositionDetails = ({ position, onReset }: PositionDetailsProps) => {
  const { icpIdentity } = useSharedStore();
  const [currentStep, setCurrentStep] = useState<Step>('positionDetail');
  const [positionPercentage, setPositionPercentage] = useState<PositionPercentage>({
    token0Percent: 0,
    token1Percent: 0,
  });
  const [feesPercentage, setFeesPercentage] = useState<FeesPercentage>({
    token0Percent: 0,
    token1Percent: 0,
  });

  useEffect(() => {
    // calculate percentage of position range
    const positionPercentageCalcRes = calculatePercent({
      num1: parseFloat(position.token0_reserves),
      num2: parseFloat(position.token1_reserves),
    });
    const feesPercentageCalcRes = calculatePercent({
      num1: parseFloat(position.fees_token0_owed),
      num2: parseFloat(position.fees_token1_owed),
    });
    setPositionPercentage({
      token0Percent: positionPercentageCalcRes.num1Percentage,
      token1Percent: positionPercentageCalcRes.num2Percentage,
    });
    setFeesPercentage({
      token0Percent: feesPercentageCalcRes.num1Percentage,
      token1Percent: feesPercentageCalcRes.num2Percentage,
    });
  }, []);

  useEffect(() => {
    if (!icpIdentity) {
      onReset();
    }
  }, [icpIdentity]);

  return (
    <Box
      className={cn(
        'text-white transition-all md:overflow-auto md:text-black md:dark:text-white',
        'h-max',
        currentStep === 'positionDetail'
          ? 'md:h-[580px] md:w-[965px]'
          : 'md:max-h-[570px] md:w-[533px]',
      )}
    >
      {currentStep === 'addLiquidity' ? (
        <AddLiquidity position={position} setCurrentStep={setCurrentStep} />
      ) : currentStep === 'removeLiquidity' ? (
        <RemoveLiquidity position={position} setCurrentStep={setCurrentStep} />
      ) : currentStep === 'collectFees' ? (
        <CollectFees position={position} setCurrentStep={setCurrentStep} />
      ) : (
        <Details
          setCurrentStep={setCurrentStep}
          position={position}
          onReset={onReset}
          positionPercentage={positionPercentage}
          feesPercentage={feesPercentage}
        />
      )}
    </Box>
  );
};

export default PositionDetails;
