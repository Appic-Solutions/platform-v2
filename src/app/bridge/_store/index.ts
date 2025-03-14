import { TxHash } from '@/blockchain_api/functions/icp/bridge_transactions';
import { BridgeOption } from '@/blockchain_api/functions/icp/get_bridge_options';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { PendingTransaction } from '@/lib/helpers/session';
import { create } from 'zustand';

export type TokenType = EvmToken | IcpToken;
type SelectionType = 'from' | 'to';
export type Status = 'failed' | 'successful' | 'pending' | undefined;

export interface TxStepType {
  count: number;
  status: 'pending' | 'successful' | 'failed' | undefined;
}

interface BridgeState {
  activeStep: number;
  selectedTokenType: SelectionType;
  usdPrice: string;
  fromToken: TokenType | undefined;
  toToken: TokenType | undefined;
  amount: string;
  bridgeOptions: {
    options: BridgeOption[] | undefined;
    message: string;
  };
  selectedOption: BridgeOption | undefined;
  bridgePairs: (EvmToken | IcpToken)[] | undefined;
  selectedTokenBalance: string;
  toWalletAddress: string;
  toWalletValidationError: string;
  // tx states
  txStep: TxStepType;
  txErrorMessage: string | undefined;
  pendingTx: PendingTransaction | undefined;
  prevTxStep: TxStepType;
  txHash: TxHash | undefined;
  withdrawalId: string | undefined;
}

type Action = {
  actions: {
    setActiveStep: (step: number) => void;
    setSelectedTokenType: (type: SelectionType) => void;
    setAmount: (amount: string) => void;
    setSelectedOption: (option: BridgeOption) => void;
    setBridgePairs: (bridgePairs: (EvmToken | IcpToken)[]) => void;
    setBridgeOptions: (params: { options: BridgeOption[] | undefined; message: string }) => void;
    setUsdPrice: (usdPrice: string) => void;
    setToWalletAddress: (walletAddress: string) => void;
    setToWalletValidationError: (toWalletValidationError: string) => void;
    setSelectedTokenBalance: (tokenBalance: string) => void;
    // select token actions
    setFromToken: (token: TokenType | undefined) => void;
    setToToken: (token: TokenType | undefined) => void;
    // tx actions
    setTxStep: (step: TxStepType) => void;
    setTxErrorMessage: (err: string | undefined) => void;
    setPendingTx: (pendingTxs: PendingTransaction | undefined) => void;
    setPrevTxStep: (prevStep: TxStepType) => void;
    setTxHash: (txHash: TxHash | undefined) => void;
    setWithdrawalId: (withdrawalId: string | undefined) => void;
  };
};

export const useBridgeStore = create<BridgeState & Action>()((set) => ({
  activeStep: 1,
  txStep: {
    count: 2,
    status: 'pending' as Status,
  },
  prevTxStep: {
    count: 0,
    status: 'successful' as Status,
  },
  amount: '',
  bridgeOptions: {
    options: undefined,
    message: '',
  },
  bridgePairs: undefined,
  fromToken: undefined,
  selectedOption: undefined,
  selectedTokenType: 'from' as SelectionType,
  toToken: undefined,
  usdPrice: '0',
  toWalletAddress: '',
  toWalletValidationError: '',
  selectedTokenBalance: '',
  txErrorMessage: undefined,
  pendingTx: undefined,
  txHash: undefined,
  withdrawalId: undefined,
  actions: {
    setActiveStep: (activeStep) => set({ activeStep }),
    setSelectedTokenType: (selectedTokenType) => set({ selectedTokenType }),
    setFromToken: (fromToken) => set({ fromToken }),
    setToToken: (toToken) => set({ toToken }),
    setAmount: (amount) => set({ amount }),
    setSelectedOption: (selectedOption) => set({ selectedOption }),
    setBridgePairs: (bridgePairs) => set({ bridgePairs }),
    setBridgeOptions: (bridgeOptions) => set({ bridgeOptions }),
    setUsdPrice: (usdPrice) => set({ usdPrice }),
    setToWalletAddress: (toWalletAddress) => set({ toWalletAddress }),
    setToWalletValidationError: (toWalletValidationError) => set({ toWalletValidationError }),
    setSelectedTokenBalance: (selectedTokenBalance) => set({ selectedTokenBalance }),
    // tx actions
    setTxStep: (txStep) => set({ txStep }),
    setTxErrorMessage: (txErrorMessage) => set({ txErrorMessage }),
    setTxHash: (txHash) => set({ txHash }),
    setPrevTxStep: (prevTxStep) => set({ prevTxStep }),
    setWithdrawalId: (withdrawalId) => set({ withdrawalId }),
    setPendingTx: (pendingTx) => set({ pendingTx }),
  },
}));

export const useBridgeActions = () => useBridgeStore((state) => state.actions);
