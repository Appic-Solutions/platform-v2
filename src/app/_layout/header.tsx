import Image from 'next/image';
import Wallet from './wallet';
import { cn } from '@/lib/utils';
import { useEffect, useMemo } from 'react';
import {
  getPendingTransaction,
  PendingTransaction,
  removePendingTransaction,
} from '@/lib/helpers/session';
import { BridgeOption, TxType } from '@/blockchain_api/functions/icp/get_bridge_options';
import { useSharedStore, useSharedStoreActions } from '@/store/store';
import { useBridgeActions, useBridgeStore } from '../bridge/_store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  check_deposit_status,
  check_withdraw_status,
} from '@/blockchain_api/functions/icp/bridge_transactions';
import { HttpAgent } from '@dfinity/agent';
import { get_icp_tokens } from '@/blockchain_api/functions/icp/get_all_icp_tokens';
import { getStorageItem, setStorageItem } from '@/lib/helpers/localstorage';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { get_all_pools, Pool } from '@/blockchain_api/functions/icp/dex/get_pool';
import { get_dex_data } from '@/blockchain_api/functions/icp/dex/explore/get_pool_history';

export default function HeaderPage() {
  const { evmAddress, icpIdentity, unAuthenticatedAgent } = useSharedStore();
  const { setPools, setIcpTokens, setDexData } = useSharedStoreActions();
  const { pendingTx } = useBridgeStore();
  const { setPendingTx } = useBridgeActions();

  const queryClient = useQueryClient();

  useEffect(() => {
    const pending = getPendingTransaction() as PendingTransaction;
    if (pending?.bridge_option.bridge_tx_type === TxType.Deposit && evmAddress) {
      setPendingTx(pending);
    } else if (pending?.bridge_option.bridge_tx_type === TxType.Withdrawal && icpIdentity) {
      setPendingTx(pending);
    }
  }, [evmAddress, icpIdentity, setPendingTx]);

  useQuery({
    queryKey: ['check-pending-deposit-status'],
    queryFn: async () => {
      const res = await check_deposit_status(
        pendingTx?.id as `0x${string}`,
        pendingTx?.bridge_option as BridgeOption,
        unAuthenticatedAgent as HttpAgent,
      );

      if (!res.success || ['Minted', 'Invalid', 'Quarantined'].includes(res.result)) {
        setPendingTx(undefined);
        removePendingTransaction();
      }

      queryClient.invalidateQueries({ queryKey: ['bridge-history', 'fetch-wallet-balances'] });
      return res;
    },
    refetchInterval: 5000,
    enabled:
      !!pendingTx &&
      !!unAuthenticatedAgent &&
      pendingTx.bridge_option.bridge_tx_type === TxType.Deposit &&
      !!evmAddress,
  });

  useQuery({
    queryKey: ['check-pending-withdrawal-status'],
    queryFn: async () => {
      const res = await check_withdraw_status(
        pendingTx?.id as string,
        pendingTx?.bridge_option as BridgeOption,
        unAuthenticatedAgent as HttpAgent,
      );

      if (
        !res.success ||
        ['Successful', 'QuarantinedReimbursement', 'Reimbursed'].includes(res.result)
      ) {
        setPendingTx(undefined);
        removePendingTransaction();
      }

      queryClient.invalidateQueries({ queryKey: ['bridge-history', 'fetch-wallet-balances'] });
      return res;
    },
    refetchInterval: 5000,
    enabled:
      !!pendingTx &&
      !!unAuthenticatedAgent &&
      pendingTx.bridge_option.bridge_tx_type === TxType.Withdrawal &&
      !!icpIdentity,
  });

  useQuery({
    queryKey: ['IcpTokens'],
    queryFn: async () => {
      if (!unAuthenticatedAgent) return [];

      const res = await get_icp_tokens(unAuthenticatedAgent);

      if (res.result) {
        setStorageItem('icpTokens', JSON.stringify(res.result));
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

  const rawIcpTokens = useMemo(() => {
    const stored = getStorageItem('icpTokens');
    return stored ? (JSON.parse(stored) as IcpToken[]) : [];
  }, []);

  const { data: allPools } = useQuery({
    queryKey: ['icp-pools'],
    queryFn: async () => {
      const response = await get_all_pools(unAuthenticatedAgent as HttpAgent, rawIcpTokens);
      if (!response.success) throw new Error('Failed to fetch all pools');
      return response.result;
    },
    enabled: !!unAuthenticatedAgent && rawIcpTokens.length > 0,
    retry: false,
  });

  const { data: dexData } = useQuery({
    queryKey: ['dex-data'],
    queryFn: async () => {
      const response = await get_dex_data(
        unAuthenticatedAgent as HttpAgent,
        rawIcpTokens,
        allPools as Pool[],
      );
      if (!response.success) throw new Error('Failed to fetch dex data');
      return response.result;
    },
    enabled: !!unAuthenticatedAgent && rawIcpTokens.length > 0 && !!allPools?.length,
    retry: false,
  });

  useEffect(() => {
    if (allPools) setPools(allPools);
  }, [allPools, setPools]);

  useEffect(() => {
    if (dexData) setDexData(dexData);
  }, [dexData, setDexData]);

  useEffect(() => {
    if (rawIcpTokens.length > 0) {
      setIcpTokens(rawIcpTokens);
    }
  }, [rawIcpTokens, setIcpTokens]);

  return (
    <header className={cn('flex w-full items-center justify-between', 'mb-5 xl:mt-4')}>
      <Image src={'/images/logo/white-logo.png'} alt="logo" width={52} height={43} />
      <Wallet />
    </header>
  );
}
