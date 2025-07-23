import { create } from 'zustand';
import { PoolStoreAction, PoolStoreState } from '../types';

export const usePoolStore = create<PoolStoreState & PoolStoreAction>()((set) => ({
  pools: [],
  icpTokens: [],
  positions: [],
  actions: {
    setPools: (pools) => set({ pools }),
    setIcpTokens: (icpTokens) => set({ icpTokens }),
    setPositions: (positions) => set({ positions }),
  },
}));

export const usePoolActions = () => usePoolStore((state) => state.actions);
