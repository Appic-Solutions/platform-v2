import { create } from 'zustand';
import { FormattedPosition, RemoveLiquidityStep, Step } from '../types';

interface State {
  currentStep: Step;
  selectedPosition: FormattedPosition | undefined;
  userPositionsList: FormattedPosition[] | undefined;
  removeLiquidityStep: RemoveLiquidityStep;
  removeLiquidityPrevStep: RemoveLiquidityStep;
}

interface Action {
  actions: {
    setCurrentStep: (step: Step) => void;
    setSelectedPosition: (position: FormattedPosition | undefined) => void;
    setUserPositionsList: (positions: FormattedPosition[]) => void;
    setRemoveLiquidityStep: (step: RemoveLiquidityStep) => void;
    setRemoveLiquidityPrevStep: (step: RemoveLiquidityStep) => void;
  };
}

export const usePositionDetailsStore = create<State & Action>()((set) => ({
  currentStep: 'positionDetail',
  selectedPosition: undefined,
  userPositionsList: [],
  removeLiquidityStep: {
    status: 'pending',
    step: 1,
    errorMessage: null,
  },
  removeLiquidityPrevStep: {
    status: 'successful',
    step: 0,
    errorMessage: null,
  },
  actions: {
    setCurrentStep: (currentStep) => set({ currentStep }),
    setSelectedPosition: (selectedPosition) => set({ selectedPosition }),
    setUserPositionsList: (userPositionsList) => set({ userPositionsList }),
    setRemoveLiquidityPrevStep: (removeLiquidityPrevStep) => set({ removeLiquidityPrevStep }),
    setRemoveLiquidityStep: (removeLiquidityStep) => set({ removeLiquidityStep }),
  },
}));

export const usePoolActions = () => usePositionDetailsStore((state) => state.actions);
