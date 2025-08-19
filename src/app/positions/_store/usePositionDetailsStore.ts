import { create } from 'zustand';
import {
  AddLiquidityStep,
  CreatePositionStep,
  FormattedPosition,
  RemoveLiquidityStep,
  Step,
} from '../types';

interface State {
  // common
  currentStep: Step;
  selectedPosition: FormattedPosition | undefined;
  userPositionsList: FormattedPosition[] | undefined;
  mintStep: CreatePositionStep;
  mintPrevStep: CreatePositionStep;
  // add liquidity
  token0DepositAmount: string;
  token1DepositAmount: string;
}

interface Action {
  actions: {
    // common
    setCurrentStep: (step: Step) => void;
    setSelectedPosition: (position: FormattedPosition | undefined) => void;
    setUserPositionsList: (positions: FormattedPosition[]) => void;
    setMintStep: (mintStep: CreatePositionStep) => void;
    setMintPrevStep: (mintPrevStep: CreatePositionStep) => void;
    resetTxState: () => void;
    // add liquidity
    setToken0DepositAmount: (token0DepositAmount: string) => void;
    setToken1DepositAmount: (token1DepositAmount: string) => void;
  };
}

export const usePositionDetailsStore = create<State & Action>()((set) => ({
  // common
  currentStep: 'positionDetail',
  selectedPosition: undefined,
  userPositionsList: [],
  mintStep: {
    status: 'pending',
    step: 1,
    errorMessage: null,
  },
  mintPrevStep: {
    status: 'successful',
    step: 0,
    errorMessage: null,
  },
  token0DepositAmount: '0',
  token1DepositAmount: '0',
  actions: {
    // common
    setCurrentStep: (currentStep) => set({ currentStep }),
    setSelectedPosition: (selectedPosition) => set({ selectedPosition }),
    setUserPositionsList: (userPositionsList) => set({ userPositionsList }),
    setMintPrevStep: (mintPrevStep) => set({ mintPrevStep }),
    setMintStep: (mintStep) => set({ mintStep }),
    resetTxState: () =>
      set({
        mintStep: {
          status: 'pending',
          step: 1,
          errorMessage: null,
        },
      }),
    // add liquidity
    setToken0DepositAmount: (token0DepositAmount) => set({ token0DepositAmount }),
    setToken1DepositAmount: (token1DepositAmount) => set({ token1DepositAmount }),
  },
}));

export const usePoolActions = () => usePositionDetailsStore((state) => state.actions);
