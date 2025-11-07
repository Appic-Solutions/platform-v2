"use client"
import Image from 'next/image';
import Wallet from './wallet';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import {
  getPendingTransaction,
  PendingTransaction,
  removePendingTransaction,
} from '@/lib/helpers/session-storage/bridge';
import { BridgeOption, TxType } from '@/blockchain_api/functions/icp/get_bridge_options';
import { useSharedStore } from '@/store/store';
import { useBridgeActions, useBridgeStore } from '../bridge/_store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { HttpAgent } from '@dfinity/agent';
import { get_icp_tokens } from '@/blockchain_api/functions/icp/get_all_icp_tokens';
import { get_all_pools, Pool } from '@/blockchain_api/functions/icp/dex/get_pool';
import { get_dex_data } from '@/blockchain_api/functions/icp/dex/explore/get_pool_history';
import { get_bridge_pairs } from '@/blockchain_api/functions/icp/get_bridge_token_pairs';
import { useToast } from '@/lib/hooks/use-toast';
import { queryKeys } from '@/lib/constants/query-keys';
import {
  check_deposit_status,
  check_withdraw_status,
} from '@/blockchain_api/functions/icp/bridge_transactions';
import { useSwapActions } from '../swap/_store';
import { useTypedQueryData } from '@/lib/hooks/use-typed-query-data';
import { usePendingSwapsStatus } from '@/lib/hooks/use-pending-swap-status';
import Link from 'next/link';

export default function HeaderPage() {
  const { evmAddress, icpIdentity, unAuthenticatedAgent } = useSharedStore();
  const queryClient = useQueryClient();
  const { setPendingTx } = useBridgeActions();
  const { pendingTx } = useBridgeStore();
  const { toast } = useToast();
  const { addPendingSwap } = useSwapActions();

  const icpBalance = useTypedQueryData(queryKeys.icpBalance);
  const evmBalance = useTypedQueryData(queryKeys.evmBalance);

  useEffect(() => {
    const pending = getPendingTransaction() as PendingTransaction;
    if (pending?.bridge_option.bridge_tx_type === TxType.Deposit && evmAddress) {
      setPendingTx(pending);
    } else if (pending?.bridge_option.bridge_tx_type === TxType.Withdrawal && icpIdentity) {
      setPendingTx(pending);
    }
  }, [evmBalance, icpBalance, evmAddress, icpIdentity, setPendingTx, addPendingSwap]);

  const { queries, pendingSwaps, hasPendingSwaps } = usePendingSwapsStatus();
  // Log for debugging
  useEffect(() => {
    if (hasPendingSwaps) {
      console.log(`🔄 Monitoring ${pendingSwaps.length} pending swaps:`, pendingSwaps);
      console.log(`queries:`, queries);
    }
  }, [hasPendingSwaps, pendingSwaps.length]);

  // check pending deposit tx status
  useQuery({
    queryKey: ['check-pending-deposit-status'],
    queryFn: async () => {
      const res = await check_deposit_status(
        pendingTx?.id as `0x${string}`,
        pendingTx?.bridge_option as BridgeOption,
        unAuthenticatedAgent as HttpAgent,
      );
      if (res.success) {
        if (res.result === 'Minted') {
          setPendingTx(undefined);
          removePendingTransaction();
        } else if (res.result === 'Invalid' || res.result === 'Quarantined') {
          setPendingTx(undefined);
          removePendingTransaction();
        } else {
          setPendingTx(pendingTx);
        }
      } else if (!res.success) {
        setPendingTx(undefined);
        removePendingTransaction();
      }
      queryClient.invalidateQueries({ queryKey: [queryKeys.bridgeHistory] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.icpBalance] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.evmBalance] });
      return res;
    },
    refetchInterval: 1000 * 5,
    enabled:
      !!pendingTx &&
      !!unAuthenticatedAgent &&
      pendingTx.bridge_option.bridge_tx_type === TxType.Deposit &&
      !!evmAddress,
  });

  // check pending withdrawal tx status
  useQuery({
    queryKey: ['check-pending-withdrawal-status'],
    queryFn: async () => {
      const res = await check_withdraw_status(
        pendingTx?.id as string,
        pendingTx?.bridge_option as BridgeOption,
        unAuthenticatedAgent as HttpAgent,
      );

      if (res.success) {
        if (res.result === 'Successful') {
          setPendingTx(undefined);
          removePendingTransaction();
        } else if (res.result === 'QuarantinedReimbursement' || res.result === 'Reimbursed') {
          setPendingTx(undefined);
          removePendingTransaction();
        } else {
          setPendingTx(pendingTx);
        }
      } else if (!res.success) {
        setPendingTx(undefined);
        removePendingTransaction();
      }
      queryClient.invalidateQueries({ queryKey: [queryKeys.bridgeHistory] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.icpBalance] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.evmBalance] });
      return res;
    },
    refetchInterval: 1000 * 5,
    enabled:
      !!pendingTx &&
      !!unAuthenticatedAgent &&
      pendingTx.bridge_option.bridge_tx_type === TxType.Withdrawal &&
      !!icpIdentity,
  });

  const { data: icpTokens } = useQuery({
    queryKey: [queryKeys.icpTokens],
    queryFn: async () => {
      if (!unAuthenticatedAgent) return [];

      const res = await get_icp_tokens(unAuthenticatedAgent);

      if (res.result) {
        return res.result;
      }

      return [];
    },
    enabled: !!unAuthenticatedAgent,
    refetchInterval: 1000 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });

  useQuery({
    queryKey: [queryKeys.bridgePairs],
    queryFn: async () => {
      if (!unAuthenticatedAgent) return [];

      const res = await get_bridge_pairs(unAuthenticatedAgent);

      if (res.result) {
        return res.result;
      }

      return [];
    },
    enabled: !!unAuthenticatedAgent,
    refetchInterval: 1000 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });

  const { data: allPools } = useQuery({
    queryKey: [queryKeys.icpPools],
    queryFn: async () => {
      const response = await get_all_pools(unAuthenticatedAgent as HttpAgent, icpTokens || []);
      if (!response.success) throw new Error('Failed to fetch all pools');
      return response.result;
    },
    enabled: !!unAuthenticatedAgent && !!icpTokens?.length,
    retry: false,
  });

  useQuery({
    queryKey: [queryKeys.dexData],
    queryFn: async () => {
      const response = await get_dex_data(
        unAuthenticatedAgent as HttpAgent,
        icpTokens || [],
        allPools as Pool[],
      );
      if (!response.success) throw new Error('Failed to fetch dex data');
      return response.result;
    },
    enabled: !!unAuthenticatedAgent && !!icpTokens?.length && !!allPools?.length,
    retry: false,
  });

  useEffect(() => {
    const handleOffline = () => {
      toast({ title: 'Internet connection lost', variant: 'destructive' });
    };
    const handleOnline = () => {
      toast({ title: 'Internet connection restored', variant: 'success' });
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [toast]);

  return (
    <header className={cn('flex w-full items-center justify-between', 'mb-5 xl:mt-4')}>
      <Link href="/" className="relative h-[34px] w-[42px] md:h-[42px] md:w-[52px]">
        <Image src={'/images/landing/logo/logo.png'} alt="Logo" fill />
      </Link>
      <Wallet />
    </header>
  );
}
