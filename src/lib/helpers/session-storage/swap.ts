import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { TxStatusType } from '@/components/common/ui/toast/types';

export interface PendingSwap {
  id: string;
  tokenIn: EvmToken | IcpToken;
  tokenOut: EvmToken | IcpToken;
  amountIn: string;
  status: TxStatusType;
  timestamp: number;
}

const KEY = 'pending_swaps';

// Set multiple pending swaps (replaces entire array)
function setPendingSwapsToSession(swaps: PendingSwap[]): void {
  sessionStorage.setItem(KEY, JSON.stringify(swaps));
}

// Get all pending swaps
function getPendingSwaps(): PendingSwap[] {
  const data = sessionStorage.getItem(KEY);
  return data ? (JSON.parse(data) as PendingSwap[]) : [];
}

// Add a single swap to existing swaps
function addPendingSwapToSession(swap: PendingSwap): void {
  const existingSwaps = getPendingSwaps();
  // Avoid duplicates
  if (!existingSwaps.some((s) => s.id === swap.id)) {
    const updatedSwaps = [...existingSwaps, swap];
    setPendingSwapsToSession(updatedSwaps);
  }
}

// Remove a specific swap by id
function removePendingSwapFromSession(swapId: string): void {
  const existingSwaps = getPendingSwaps();
  const updatedSwaps = existingSwaps.filter((swap) => swap.id !== swapId);
  setPendingSwapsToSession(updatedSwaps);
}

// Update a specific swap
function updatePendingSwapInSession(swapId: string, updates: Partial<PendingSwap>): void {
  const existingSwaps = getPendingSwaps();
  const updatedSwaps = existingSwaps.map((swap) =>
    swap.id === swapId ? { ...swap, ...updates } : swap,
  );
  setPendingSwapsToSession(updatedSwaps);
}

// Clear all pending swaps
function clearPendingSwapsFromSession(): void {
  sessionStorage.removeItem(KEY);
}

export {
  setPendingSwapsToSession,
  getPendingSwaps,
  addPendingSwapToSession,
  removePendingSwapFromSession,
  updatePendingSwapInSession,
  clearPendingSwapsFromSession,
};
