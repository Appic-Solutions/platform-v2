import { EvmTokensBalances } from '@/blockchain_api/functions/evm/get_evm_balances';
import { IcpTokensBalances } from '@/blockchain_api/functions/icp/get_icp_balances';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { HttpAgent, Agent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { create } from 'zustand';

interface SharedState {
  icpTokens: undefined | IcpToken[];
  authenticatedAgent: Agent | undefined;
  unAuthenticatedAgent: HttpAgent | undefined;
  icpIdentity: Principal | undefined;
  isEvmConnected: boolean;
  isIcpBalanceLoading: boolean;
  isEvmBalanceLoading: boolean;
  evmAddress: string | undefined;
  chainId: number | string | undefined;
  bridgePairs: undefined | (EvmToken | IcpToken)[];
}

type Action = {
  actions: {
    setIcpTokens: (tokens: SharedState['icpTokens']) => void;
    setAuthenticatedAgent: (agent: SharedState['authenticatedAgent']) => void;
    setUnAuthenticatedAgent: (agent: SharedState['unAuthenticatedAgent']) => void;
    setIcpIdentity: (identity: SharedState['icpIdentity']) => void;
    setIsEvmConnected: (isConnected: SharedState['isEvmConnected']) => void;
    setEvmAddress: (address: SharedState['evmAddress']) => void;
    setChainId: (chainId: SharedState['chainId']) => void;
    setIsIcpBalanceLoading: (isPending: SharedState['isIcpBalanceLoading']) => void;
    setIsEvmBalanceLoading: (isPending: SharedState['isEvmBalanceLoading']) => void;
    setBridgePairs: (bridgePairs: SharedState['bridgePairs']) => void;
  };
};

export const useSharedStore = create<SharedState & Action>()((set) => ({
  icpTokens: undefined,
  authenticatedAgent: undefined,
  unAuthenticatedAgent: undefined,
  icpIdentity: undefined,
  isEvmConnected: false,
  evmAddress: undefined,
  chainId: undefined,
  isIcpBalanceLoading: false,
  isEvmBalanceLoading: false,
  pools: undefined,
  bridgePairs: undefined,
  actions: {
    setIcpTokens: (tokens) => set({ icpTokens: tokens }),
    setAuthenticatedAgent: (agent) => set({ authenticatedAgent: agent }),
    setUnAuthenticatedAgent: (agent) => set({ unAuthenticatedAgent: agent }),
    setIcpIdentity: (identity) => set({ icpIdentity: identity }),
    setIsEvmConnected: (isConnected) => set({ isEvmConnected: isConnected }),
    setEvmAddress: (address) => set({ evmAddress: address }),
    setChainId: (chainId) => set({ chainId }),
    setIsIcpBalanceLoading: (isIcpPending) => set({ isIcpBalanceLoading: isIcpPending }),
    setIsEvmBalanceLoading: (isEvmPending) => set({ isEvmBalanceLoading: isEvmPending }),
    setBridgePairs: (bridgePairs) => set({ bridgePairs }),
  },
}));

export const useSharedStoreActions = () => useSharedStore((state) => state.actions);
