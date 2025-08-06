'use client';
import { calculatePercent, cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import Box from '@/components/ui/box';
import Details from './Details';
import { PositionDetailsProps, Step, PositionPercentage, FeesPercentage } from '../../types';
import AddLiquidity from './add-liquidity';
import RemoveLiquidity from './remove-liquidity';
import CollectFees from './collect-fees';

const PositionDetails = ({ position, onBackClick }: PositionDetailsProps) => {
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

  return (
    <Box
      className={cn(
        'text-white transition-all md:p-8 lg:overflow-auto lg:text-black lg:dark:text-white',
        'h-max',
        currentStep === 'positionDetail'
          ? 'lg:h-[580px] lg:w-[965px]'
          : 'lg:max-h-[570px] lg:w-[490px]',
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
          onBackClick={onBackClick}
          positionPercentage={positionPercentage}
          feesPercentage={feesPercentage}
        />
      )}
    </Box>
  );
};

export default PositionDetails;
