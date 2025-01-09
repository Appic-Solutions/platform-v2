import { DepositTxStatus, WithdrawalTxStatus } from '@/blockchain_api/functions/icp/bridge_transactions';
import { BridgeOption } from '@/blockchain_api/functions/icp/get_bridge_options';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { create } from 'zustand';

export type TokenType = EvmToken | IcpToken;
type SelectionType = 'from' | 'to';

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
  // tx states
  txStep: number;
  txStatus: WithdrawalTxStatus | DepositTxStatus | undefined;
}

type Action = {
  actions: {
    setActiveStep: (step: number) => void;
    setTxStep: (step: number) => void;
    setSelectedTokenType: (type: SelectionType) => void;
    setFromToken: (token: TokenType | undefined) => void;
    setToToken: (token: TokenType | undefined) => void;
    setAmount: (amount: string) => void;
    setSelectedOption: (option: BridgeOption) => void;
    setBridgePairs: (bridgePairs: (EvmToken | IcpToken)[]) => void;
    setBridgeOptions: (bridgeOptions: BridgeOption[]) => void;
    setUsdPrice: (usdPrice: string) => void;
    setToWalletAddress: (walletAddress: string) => void;
    setTxStatus: (txStatus: WithdrawalTxStatus | DepositTxStatus) => void;
  };
};

export const useBridgeStore = create<BridgeState & Action>()((set) => ({
  activeStep: 1,
  txStep: 1,
  amount: '',
  bridgeOptions: undefined,
  bridgePairs: undefined,
  fromToken: undefined,
  selectedOption: undefined,
  selectedTokenType: 'from' as SelectionType,
  toToken: undefined,
  usdPrice: '0',
  toWalletAddress: '',
  txStatus: undefined,
  actions: {
    setActiveStep: (activeStep) => set((state) => ({ ...state, activeStep })),
    setTxStep: (txStep) => set((state) => ({ ...state, txStep })),
    setSelectedTokenType: (selectedTokenType) => set((state) => ({ ...state, selectedTokenType })),
    setFromToken: (fromToken) => set((state) => ({ ...state, fromToken })),
    setToToken: (toToken) => set((state) => ({ ...state, toToken })),
    setAmount: (amount) => set((state) => ({ ...state, amount })),
    setSelectedOption: (selectedOption) => set((state) => ({ ...state, selectedOption })),
    setBridgePairs: (bridgePairs) => set((state) => ({ ...state, bridgePairs })),
    setBridgeOptions: (bridgeOptions) => set((state) => ({ ...state, bridgeOptions })),
    setUsdPrice: (usdPrice) => set((state) => ({ ...state, usdPrice })),
    setToWalletAddress: (toWalletAddress) => set((state) => ({ ...state, toWalletAddress })),
    setTxStatus: (txStatus) => set((state) => ({ ...state, txStatus })),
  },
}));

export const useBridgeActions = () => useBridgeStore((state) => state.actions);
