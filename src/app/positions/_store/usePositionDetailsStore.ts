import { create } from 'zustand';
import { AddLiquidityStep, FormattedPosition, RemoveLiquidityStep, Step } from '../types';

interface State {
  currentStep: Step;
  selectedPosition: FormattedPosition | undefined;
  userPositionsList: FormattedPosition[] | undefined;
  token0DepositAmount: string;
  token1DepositAmount: string;
  removeLiquidityStep: RemoveLiquidityStep;
  removeLiquidityPrevStep: RemoveLiquidityStep;
  addLiquidityStep: AddLiquidityStep;
  addLiquidityPrevStep: AddLiquidityStep;
}

interface Action {
  actions: {
    // common
    setCurrentStep: (step: Step) => void;
    setSelectedPosition: (position: FormattedPosition | undefined) => void;
    setUserPositionsList: (positions: FormattedPosition[]) => void;
    // add liquidity
    setToken0DepositAmount: (token0DepositAmount: string) => void;
    setToken1DepositAmount: (token1DepositAmount: string) => void;
    setAddLiquidityStep: (step: AddLiquidityStep) => void;
    setAddLiquidityPrevStep: (step: AddLiquidityStep) => void;
    // remove liquidity
    setRemoveLiquidityStep: (step: RemoveLiquidityStep) => void;
    setRemoveLiquidityPrevStep: (step: RemoveLiquidityStep) => void;
  };
}

export const usePositionDetailsStore = create<State & Action>()((set) => ({
  // common
  currentStep: 'positionDetail',
  selectedPosition: undefined,
  userPositionsList: [],
  // add liquidity
  token0DepositAmount: '0',
  token1DepositAmount: '0',
  addLiquidityStep: {
    status: 'pending',
    step: 1,
    errorMessage: null,
  },
  addLiquidityPrevStep: {
    status: 'successful',
    step: 0,
    errorMessage: null,
  },
  // remove liquidity
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
    // common
    setCurrentStep: (currentStep) => set({ currentStep }),
    setSelectedPosition: (selectedPosition) => set({ selectedPosition }),
    setUserPositionsList: (userPositionsList) => set({ userPositionsList }),
    // add liquidity
    setToken0DepositAmount: (token0DepositAmount) => set({ token0DepositAmount }),
    setToken1DepositAmount: (token1DepositAmount) => set({ token1DepositAmount }),
    setAddLiquidityPrevStep: (addLiquidityPrevStep) => set({ addLiquidityPrevStep }),
    setAddLiquidityStep: (addLiquidityStep) => set({ addLiquidityStep }),
    // remove liquidity
    setRemoveLiquidityPrevStep: (removeLiquidityPrevStep) => set({ removeLiquidityPrevStep }),
    setRemoveLiquidityStep: (removeLiquidityStep) => set({ removeLiquidityStep }),
  },
}));

export const usePoolActions = () => usePositionDetailsStore((state) => state.actions);
