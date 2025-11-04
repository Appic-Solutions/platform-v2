import { SwapStatus } from '@/blockchain_api/functions/swap/crosschain';
import { CrossChainQuote } from '@/blockchain_api/quoter/cross-chain';
import { IcpQuote } from '@/blockchain_api/quoter/icp';
import { SameChainQuote } from '@/blockchain_api/quoter/same-chain';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { TxStatusType } from '@/components/common/ui/toast/types';
import { create } from 'zustand';
import { SwapStatusCachedQuery } from '../_types';

export type TokenType = EvmToken | IcpToken;
type SelectionType = 'in' | 'out';
export type Status = 'failed' | 'successful' | 'pending' | undefined;

export interface TxStepType {
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
  // tx states
  txStep: TxStepType;
  txErrorMessage: string | undefined;
  prevTxStep: TxStepType;
  pendingSwapTx: SwapStatusCachedQuery | undefined;
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
    setTxStep: (step: TxStepType) => void;
    setTxErrorMessage: (err: string | undefined) => void;
    setPrevTxStep: (prevStep: TxStepType) => void;
    setPendingSwapTx: (pendingSwapTx: SwapStatusCachedQuery | undefined) => void;
  };
};

export const useSwapStore = create<swapState & Action>()((set) => ({
  activeStep: 1,
  txStep: {
    count: 1,
    status: 'pending' as Status,
  },
  prevTxStep: {
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
  txErrorMessage: undefined,
  txId: undefined,
  pendingSwapTx: undefined,
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
    // tx actions
    setTxStep: (txStep) => set({ txStep }),
    setTxErrorMessage: (txErrorMessage) => set({ txErrorMessage }),
    setPrevTxStep: (prevTxStep) => set({ prevTxStep }),
    setPendingSwapTx: (pendingSwapTx) => set({ pendingSwapTx }),
  },
}));

export const useSwapActions = () => useSwapStore((state) => state.actions);
