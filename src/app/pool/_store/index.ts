import { create } from 'zustand';
import { PoolStoreAction, PoolStoreState } from '../types';

export const usePoolStore = create<PoolStoreState & PoolStoreAction>()((set) => ({
  pools: [],
  icpTokens: [],
  actions: {
    setPools: (pools) => set({ pools }),
    setIcpTokens: (icpTokens) => set({ icpTokens }),
  },
}));

export const usePoolActions = () => usePoolStore((state) => state.actions);
