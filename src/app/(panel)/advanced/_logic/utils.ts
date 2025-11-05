import { ModalStepData } from '../_constants';
import { Status } from '../_types';

export const getModalStepText = (
  step: number,
  status: Status,
  errorMessage?: string,
): { title: string; subTitle: string } => {
  const stepData = ModalStepData.get(step);
  if (!stepData) {
    return {
      title: `${step} not found: title`,
      subTitle: `${step} not found: message`,
    };
  }
  if (status === 'failed') {
    return {
      title: stepData.title,
      subTitle: `${stepData[status]} + ${errorMessage}`,
    };
  } else {
    return {
      title: stepData.title,
      subTitle: stepData[status],
    };
  }
};
