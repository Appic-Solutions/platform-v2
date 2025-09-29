import { HttpAgent, Agent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { create } from 'zustand';

interface SharedState {
  authenticatedAgent: Agent | undefined;
  unAuthenticatedAgent: HttpAgent | undefined;
  icpIdentity: Principal | undefined;
  isEvmConnected: boolean;
  evmAddress: string | undefined;
  chainId: number | string | undefined;
}

type Action = {
  actions: {
    setAuthenticatedAgent: (agent: SharedState['authenticatedAgent']) => void;
    setUnAuthenticatedAgent: (agent: SharedState['unAuthenticatedAgent']) => void;
    setIcpIdentity: (identity: SharedState['icpIdentity']) => void;
    setIsEvmConnected: (isConnected: SharedState['isEvmConnected']) => void;
    setEvmAddress: (address: SharedState['evmAddress']) => void;
    setChainId: (chainId: SharedState['chainId']) => void;
  };
};

export const useSharedStore = create<SharedState & Action>()((set) => ({
  authenticatedAgent: undefined,
  unAuthenticatedAgent: undefined,
  icpIdentity: undefined,
  isEvmConnected: false,
  evmAddress: undefined,
  chainId: undefined,
  pools: undefined,
  actions: {
    setAuthenticatedAgent: (agent) => set({ authenticatedAgent: agent }),
    setUnAuthenticatedAgent: (agent) => set({ unAuthenticatedAgent: agent }),
    setIcpIdentity: (identity) => set({ icpIdentity: identity }),
    setIsEvmConnected: (isConnected) => set({ isEvmConnected: isConnected }),
    setEvmAddress: (address) => set({ evmAddress: address }),
    setChainId: (chainId) => set({ chainId }),
  },
}));

export const useSharedStoreActions = () => useSharedStore((state) => state.actions);
