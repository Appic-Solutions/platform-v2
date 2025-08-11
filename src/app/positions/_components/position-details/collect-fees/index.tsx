import React, { useState } from 'react';
import { FormattedPosition, Step } from '@/app/positions/types';
import CollectFeesStepOne from './step-one';
import CollectFeesStepTwo from './step-two';

interface CollectFeesProps {
  position: FormattedPosition;
  setCurrentStep: (step: Step) => void;
}

const CollectFees = ({ position, setCurrentStep }: CollectFeesProps) => {
  const [step, setStep] = useState(1);
  return step === 1 ? (
    <CollectFeesStepOne onBack={() => setCurrentStep('positionDetail')} position={position} />
  ) : (
    <CollectFeesStepTwo />
  );
};

export default CollectFees;
