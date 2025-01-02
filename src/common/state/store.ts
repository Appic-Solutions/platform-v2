import { EvmTokensBalances } from '@/blockchain_api/functions/evm/get_evm_balances';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { HttpAgent, Identity, Agent } from '@dfinity/agent';
import { create } from 'zustand';

interface SharedState {
  icpBalance:
    | {
        tokens: IcpToken[];
        totalBalanceUsd: string;
      }
    | undefined;
  evmBalance: EvmTokensBalances | undefined;
  authenticatedAgent: Agent | undefined;
  unAuthenticatedAgent: HttpAgent | undefined;
  icpIdentity: Identity | undefined;
  isEvmConnected: boolean;
  isIcpBalanceLoading: boolean;
  isEvmBalanceLoading: boolean;
  evmAddress: string | undefined;
  chainId: number | string | undefined;
}

type Action = {
  actions: {
    setIcpBalance: (balance: SharedState['icpBalance']) => void;
    setEvmBalance: (balance: SharedState['evmBalance']) => void;
    setAuthenticatedAgent: (agent: SharedState['authenticatedAgent']) => void;
    setUnAuthenticatedAgent: (agent: SharedState['unAuthenticatedAgent']) => void;
    setIcpIdentity: (identity: SharedState['icpIdentity']) => void;
    setIsEvmConnected: (isConnected: SharedState['isEvmConnected']) => void;
    setEvmAddress: (address: SharedState['evmAddress']) => void;
    setChainId: (chainId: SharedState['chainId']) => void;
    setIsIcpBalanceLoading: (isPending: SharedState['isIcpBalanceLoading']) => void;
    setIsEvmBalanceLoading: (isPending: SharedState['isEvmBalanceLoading']) => void;
  };
};

export const useSharedStore = create<SharedState & Action>()((set) => ({
  icpBalance: undefined,
  evmBalance: undefined,
  authenticatedAgent: undefined,
  unAuthenticatedAgent: undefined,
  icpIdentity: undefined,
  isEvmConnected: false,
  evmAddress: undefined,
  chainId: undefined,
  isIcpBalanceLoading: false,
  isEvmBalanceLoading: false,
  actions: {
    setIcpBalance: (balance) => set((state) => ({ ...state, icpBalance: balance })),
    setEvmBalance: (balance) => set((state) => ({ ...state, evmBalance: balance })),
    setAuthenticatedAgent: (agent) => set((state) => ({ ...state, authenticatedAgent: agent })),
    setUnAuthenticatedAgent: (agent) => set((state) => ({ ...state, unAuthenticatedAgent: agent })),
    setIcpIdentity: (identity) => set((state) => ({ ...state, icpIdentity: identity })),
    setIsEvmConnected: (isConnected) => set((state) => ({ ...state, isEvmConnected: isConnected })),
    setEvmAddress: (address) => set((state) => ({ ...state, evmAddress: address })),
    setChainId: (chainId) => set((state) => ({ ...state, chainId })),
    setIsIcpBalanceLoading: (isIcpPending) => set((state) => ({ ...state, isIcpBalanceLoading: isIcpPending })),
    setIsEvmBalanceLoading: (isEvmPending) => set((state) => ({ ...state, isEvmBalanceLoading: isEvmPending })),
  },
}));

export const useSharedStoreActions = () => useSharedStore((state) => state.actions);
