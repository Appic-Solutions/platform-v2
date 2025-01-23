import { ModalStepData } from '../_constants';
import { Status } from '../_types';

export const getModalStepText = (step: number, status: Status): { title: string; subTitle: string } => {
  const stepData = ModalStepData.get(step);
  if (!stepData) {
    return {
      title: `${step} not found: title`,
      subTitle: `${step} not found: message`,
    };
  }
  return {
    title: stepData.title,
    subTitle: stepData[status],
  };
};
