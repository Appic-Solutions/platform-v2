import { BridgeOption } from '@/blockchain_api/functions/icp/get_bridge_options';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
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
  bridgeOptions: BridgeOption[] | undefined;
  selectedOption: BridgeOption | undefined;
  bridgePairs: (EvmToken | IcpToken)[] | undefined;
  toWalletAddress: string;
  selectedTokenBalance: string;
  // tx states
  txStep: TxStepType;
  txStatus: Status;
  txErrorMessage: string | undefined;
}

type Action = {
  actions: {
    setActiveStep: (step: number) => void;
    setSelectedTokenType: (type: SelectionType) => void;
    setFromToken: (token: TokenType | undefined) => void;
    setToToken: (token: TokenType | undefined) => void;
    setAmount: (amount: string) => void;
    setSelectedOption: (option: BridgeOption) => void;
    setBridgePairs: (bridgePairs: (EvmToken | IcpToken)[]) => void;
    setBridgeOptions: (bridgeOptions: BridgeOption[]) => void;
    setUsdPrice: (usdPrice: string) => void;
    setToWalletAddress: (walletAddress: string) => void;
    setSelectedTokenBalance: (tokenBalance: string) => void;
    setTxStep: (step: TxStepType) => void;
    setTxStatus: (txStatus: Status) => void;
    setTxErrorMessage: (err: string | undefined) => void;
  };
};

export const useBridgeStore = create<BridgeState & Action>()((set) => ({
  activeStep: 1,
  txStep: {
    count: 1,
    status: 'pending' as Status,
  },
  amount: '',
  bridgeOptions: undefined,
  bridgePairs: undefined,
  fromToken: undefined,
  selectedOption: undefined,
  selectedTokenType: 'from' as SelectionType,
  toToken: undefined,
  usdPrice: '0',
  toWalletAddress: '',
  selectedTokenBalance: '',
  txStatus: undefined,
  txErrorMessage: undefined,
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
    setSelectedTokenBalance: (selectedTokenBalance) => set({ selectedTokenBalance }),
    setTxStep: (txStep) => set({ txStep }),
    setTxStatus: (txStatus) => set({ txStatus }),
    setTxErrorMessage: (txErrorMessage) => set({ txErrorMessage }),
  },
}));

export const useBridgeActions = () => useBridgeStore((state) => state.actions);
