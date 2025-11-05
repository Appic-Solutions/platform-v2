import { CrossChainQuote } from '@/blockchain_api/quoter/cross-chain';
import { IcpQuote } from '@/blockchain_api/quoter/icp';
import { SameChainQuote } from '@/blockchain_api/quoter/same-chain';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { PendingSwap } from '@/lib/helpers/session-storage/swap';
import { create } from 'zustand';

export type TokenType = EvmToken | IcpToken;
type SelectionType = 'in' | 'out';
export type Status = 'failed' | 'successful' | 'pending' | undefined;

export interface SwapStepType {
  count: number;
  status: 'pending' | 'successful' | 'failed' | undefined;
}

export type SwapQuote = IcpQuote | CrossChainQuote | SameChainQuote;

interface swapState {
  activeStep: number;
  selectedTokenType: SelectionType;
  usdPrice: string;
  tokenIn: TokenType | undefined;
  tokenOut: TokenType | undefined;
  amount: string;
  swapQuote: SwapQuote | undefined;
  selectedTokenBalance: string;
  toWalletAddress: string;
  toWalletValidationError: string;
  // swap states
  swapStep: SwapStepType;
  swapErrorMessage: string | undefined;
  prevSwapStep: SwapStepType;
  pendingSwaps: PendingSwap[];
}

type Action = {
  actions: {
    setActiveStep: (step: number) => void;
    setSelectedTokenType: (type: SelectionType) => void;
    setAmount: (amount: string) => void;
    setSwapQuote: (quote: IcpQuote | CrossChainQuote | SameChainQuote | undefined) => void;
    setUsdPrice: (usdPrice: string) => void;
    setToWalletAddress: (walletAddress: string) => void;
    setToWalletValidationError: (toWalletValidationError: string) => void;
    setSelectedTokenBalance: (tokenBalance: string) => void;
    // select token actions
    setTokenIn: (token: TokenType | undefined) => void;
    setTokenOut: (token: TokenType | undefined) => void;
    // tx actions
    setSwapStep: (step: SwapStepType) => void;
    setSwapErrorMessage: (err: string | undefined) => void;
    setPrevSwapStep: (prevStep: SwapStepType) => void;
    addPendingSwap: (pendingSwap: PendingSwap) => void;
    removePendingSwap: (id: string) => void;
    updateSwapStatus: (id: string, status: PendingSwap['status']) => void;
    clearPendingSwaps: () => void;
  };
};

export const useSwapStore = create<swapState & Action>()((set) => ({
  activeStep: 1,
  swapStep: {
    count: 1,
    status: 'pending' as Status,
  },
  prevSwapStep: {
    count: 0,
    status: 'successful' as Status,
  },
  amount: '',
  swapQuote: undefined,
  tokenIn: undefined,
  selectedQuote: undefined,
  selectedTokenType: 'in',
  tokenOut: undefined,
  usdPrice: '0',
  toWalletAddress: '',
  toWalletValidationError: '',
  selectedTokenBalance: '',
  swapErrorMessage: undefined,
  txId: undefined,
  pendingSwaps: [],
  actions: {
    setActiveStep: (activeStep) => set({ activeStep }),
    setSelectedTokenType: (selectedTokenType) => set({ selectedTokenType }),
    setTokenIn: (tokenIn) => set({ tokenIn }),
    setTokenOut: (tokenOut) => set({ tokenOut }),
    setAmount: (amount) => set({ amount }),
    setSwapQuote: (swapQuote) => set({ swapQuote }),
    setUsdPrice: (usdPrice) => set({ usdPrice }),
    setToWalletAddress: (toWalletAddress) => set({ toWalletAddress }),
    setToWalletValidationError: (toWalletValidationError) => set({ toWalletValidationError }),
    setSelectedTokenBalance: (selectedTokenBalance) => set({ selectedTokenBalance }),
    // swap actions
    setSwapStep: (swapStep) => set({ swapStep }),
    setSwapErrorMessage: (swapErrorMessage) => set({ swapErrorMessage }),
    setPrevSwapStep: (prevSwapStep) => set({ prevSwapStep }),
    // pending swap
    addPendingSwap: (pendingSwap) =>
      set((state) => ({
        pendingSwaps: [...(state.pendingSwaps || []), pendingSwap],
      })),
    removePendingSwap: (id) =>
      set((state) => ({
        pendingSwaps: state.pendingSwaps.filter((swap) => swap.id !== id),
      })),

    updateSwapStatus: (id, status) =>
      set((state) => ({
        pendingSwaps: state.pendingSwaps.map((swap) =>
          swap.id === id ? { ...swap, status } : swap,
        ),
      })),

    clearPendingSwaps: () => set({ pendingSwaps: [] }),
  },
}));

export const useSwapActions = () => useSwapStore((state) => state.actions);
