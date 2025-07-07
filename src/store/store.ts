import { EvmTokensBalances } from '@/blockchain_api/functions/evm/get_evm_balances';
import { Pool } from '@/blockchain_api/functions/icp/dex/get_pool';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { HttpAgent, Agent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { create } from 'zustand';

interface SharedState {
  icpBalance:
    | {
        tokens: IcpToken[];
        totalBalanceUsd: string;
      }
    | undefined;
  icpTokens: undefined | IcpToken[];
  evmBalance: EvmTokensBalances | undefined;
  authenticatedAgent: Agent | undefined;
  unAuthenticatedAgent: HttpAgent | undefined;
  icpIdentity: Principal | undefined;
  isEvmConnected: boolean;
  isIcpBalanceLoading: boolean;
  isEvmBalanceLoading: boolean;
  evmAddress: string | undefined;
  chainId: number | string | undefined;
  pools: undefined | Pool[];
}

type Action = {
  actions: {
    setIcpBalance: (balance: SharedState['icpBalance']) => void;
    setIcpTokens: (tokens: SharedState['icpTokens']) => void;
    setEvmBalance: (balance: SharedState['evmBalance']) => void;
    setAuthenticatedAgent: (agent: SharedState['authenticatedAgent']) => void;
    setUnAuthenticatedAgent: (agent: SharedState['unAuthenticatedAgent']) => void;
    setIcpIdentity: (identity: SharedState['icpIdentity']) => void;
    setIsEvmConnected: (isConnected: SharedState['isEvmConnected']) => void;
    setEvmAddress: (address: SharedState['evmAddress']) => void;
    setChainId: (chainId: SharedState['chainId']) => void;
    setIsIcpBalanceLoading: (isPending: SharedState['isIcpBalanceLoading']) => void;
    setIsEvmBalanceLoading: (isPending: SharedState['isEvmBalanceLoading']) => void;
    setPools: (pools: SharedState['pools']) => void;
  };
};

export const useSharedStore = create<SharedState & Action>()((set) => ({
  icpBalance: undefined,
  icpTokens: undefined,
  evmBalance: undefined,
  authenticatedAgent: undefined,
  unAuthenticatedAgent: undefined,
  icpIdentity: undefined,
  isEvmConnected: false,
  evmAddress: undefined,
  chainId: undefined,
  isIcpBalanceLoading: false,
  isEvmBalanceLoading: false,
  pools: undefined,
  actions: {
    setIcpBalance: (balance) => set({ icpBalance: balance }),
    setIcpTokens: (tokens) => set({ icpTokens: tokens }),
    setEvmBalance: (balance) => set({ evmBalance: balance }),
    setAuthenticatedAgent: (agent) => set({ authenticatedAgent: agent }),
    setUnAuthenticatedAgent: (agent) => set({ unAuthenticatedAgent: agent }),
    setIcpIdentity: (identity) => set({ icpIdentity: identity }),
    setIsEvmConnected: (isConnected) => set({ isEvmConnected: isConnected }),
    setEvmAddress: (address) => set({ evmAddress: address }),
    setChainId: (chainId) => set({ chainId }),
    setIsIcpBalanceLoading: (isIcpPending) => set({ isIcpBalanceLoading: isIcpPending }),
    setIsEvmBalanceLoading: (isEvmPending) => set({ isEvmBalanceLoading: isEvmPending }),
    setPools: (pools) => set({ pools }),
  },
}));

export const useSharedStoreActions = () => useSharedStore((state) => state.actions);
