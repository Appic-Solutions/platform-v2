import { useQueries, useQueryClient } from '@tanstack/react-query';
import { check_swap_status } from '@/blockchain_api/functions/swap/crosschain';
import { useSharedStore } from '@/store/store';
import { queryKeys } from '@/lib/constants/query-keys';
import { transactionNotification } from '@/components/common/ui/toast/notification';
import { useEffect, useCallback } from 'react';
import {
  addPendingSwapToSession,
  getPendingSwaps,
  removePendingSwapFromSession,
  setPendingSwapsToSession,
  PendingSwap,
  updatePendingSwapInSession,
} from '../helpers/session-storage/swap';
import { TxStatusType } from '@/components/common/ui/toast/types';
import { HttpAgent } from '@dfinity/agent';
import { useSwapActions, useSwapStore } from '@/app/(panel)/swap/_store';

export const usePendingSwapsStatus = () => {
  const { addPendingSwap, removePendingSwap, updateSwapStatus } = useSwapActions();
  const { pendingSwaps } = useSwapStore();
  const { unAuthenticatedAgent, evmAddress, icpIdentity } = useSharedStore();
  const queryClient = useQueryClient();

  // Restore all pending swaps from session storage on mount
  useEffect(() => {
    const cachedSwaps = getPendingSwaps();

    if (cachedSwaps.length > 0) {
      const pendingSwapsFromSession = cachedSwaps.filter((swap) => swap.status === 'pending');

      if (pendingSwapsFromSession.length > 0) {
        pendingSwapsFromSession.forEach((swap) => {
          const alreadyExists = pendingSwaps.some((s) => s.id === swap.id);
          if (!alreadyExists) {
            addPendingSwap(swap);
          }
        });
      }
    }
  }, [addPendingSwap, pendingSwaps]);

  // Enhanced add function that also saves to session
  const addPendingSwapWithSession = useCallback(
    (swap: PendingSwap) => {
      addPendingSwap(swap);
      addPendingSwapToSession(swap);
    },
    [addPendingSwap],
  );

  // Enhanced remove function that also clears from session
  const removePendingSwapWithSession = useCallback(
    (swapId: string) => {
      removePendingSwap(swapId);
      removePendingSwapFromSession(swapId);
      console.log('🗑️ Removed swap from session storage:', swapId);
    },
    [removePendingSwap],
  );

  // Enhanced update function
  const updatePendingSwapWithSession = useCallback(
    (swapId: string, status: TxStatusType) => {
      updateSwapStatus(swapId, status);
      updatePendingSwapInSession(swapId, { status });
    },
    [updateSwapStatus],
  );

  // Sync entire store to session (useful for bulk operations)
  const syncStoreToSession = useCallback(() => {
    setPendingSwapsToSession(pendingSwaps);
  }, [pendingSwaps]);

  // Create queries for all pending swaps
  const queries = useQueries({
    queries: pendingSwaps.map((pendingSwap) => ({
      queryKey: [queryKeys.checkSwapStatus, pendingSwap.id, evmAddress, icpIdentity],
      queryFn: async () => {
        const res = await check_swap_status(
          pendingSwap.tokenIn,
          pendingSwap.tokenOut,
          pendingSwap.amountIn,
          pendingSwap.id,
          unAuthenticatedAgent as HttpAgent,
        );

        if (res.result) {
          transactionNotification({
            title: res.result.title,
            caption: res.result.caption,
            status: res.result.status,
            isSameChain: false,
            tokenIn: pendingSwap.tokenIn,
            tokenOut: pendingSwap.tokenOut,
            toastId: pendingSwap.id,
          });

          if (res.result.status === 'successful' || res.result.status === 'failed') {
            removePendingSwapWithSession(pendingSwap.id);
            queryClient.removeQueries({ queryKey: [queryKeys.swapStatus, pendingSwap.id] });
          } else {
            updatePendingSwapWithSession(pendingSwap.id, res.result.status);
          }
        } else {
          console.log(`❌ No result for swap ${pendingSwap.id}, removing...`);
          removePendingSwapWithSession(pendingSwap.id);
          queryClient.removeQueries({ queryKey: [queryKeys.swapStatus, pendingSwap.id] });

          // Update toast to show error state
          transactionNotification({
            title: 'Transaction Failed',
            caption: 'Unable to check transaction status',
            status: 'failed',
            isSameChain: false,
            tokenIn: pendingSwap.tokenIn,
            tokenOut: pendingSwap.tokenOut,
            toastId: pendingSwap.id,
          });
        }

        queryClient.invalidateQueries({ queryKey: [queryKeys.icpBalance] });
        queryClient.invalidateQueries({ queryKey: [queryKeys.evmBalance] });
        return res;
      },
      refetchInterval: 1000 * 3,
      enabled: !!unAuthenticatedAgent && !!pendingSwap.id,
    })),
  });

  return {
    queries,
    pendingSwaps,
    addPendingSwap: addPendingSwapWithSession,
    removePendingSwap: removePendingSwapWithSession,
    updateSwapStatus: updatePendingSwapWithSession,
    syncStoreToSession,
    hasPendingSwaps: pendingSwaps.length > 0,
  };
};
