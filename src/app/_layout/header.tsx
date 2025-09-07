import Image from 'next/image';
import Wallet from './wallet';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { getPendingTransaction, PendingTransaction } from '@/lib/helpers/session';
import { TxType } from '@/blockchain_api/functions/icp/get_bridge_options';
import { useSharedStore, useSharedStoreActions } from '@/store/store';
import { useBridgeActions } from '../bridge/_store';
import { useQuery } from '@tanstack/react-query';
import { HttpAgent } from '@dfinity/agent';
import { get_icp_tokens } from '@/blockchain_api/functions/icp/get_all_icp_tokens';
import { getStorageItem, setStorageItem } from '@/lib/helpers/localstorage';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { get_all_pools, Pool } from '@/blockchain_api/functions/icp/dex/get_pool';
import { get_dex_data } from '@/blockchain_api/functions/icp/dex/explore/get_pool_history';
import { get_bridge_pairs } from '@/blockchain_api/functions/icp/get_bridge_token_pairs';
import { useToast } from '@/lib/hooks/use-toast';

export default function HeaderPage() {
  const { evmAddress, icpIdentity, unAuthenticatedAgent } = useSharedStore();
  const { setPools, setIcpTokens, setDexData, setBridgePairs } = useSharedStoreActions();
  const { setPendingTx } = useBridgeActions();
  const { toast } = useToast();

  useEffect(() => {
    const stored = getStorageItem('icpTokens');
    if (stored) {
      const parsedTokens = JSON.parse(stored) as IcpToken[];
      setIcpTokens(parsedTokens);
    }
  }, [setIcpTokens]);

  useEffect(() => {
    const stored = getStorageItem('bridgePairs');
    if (stored) {
      const parsedBridgePairs = JSON.parse(stored) as (EvmToken | IcpToken)[];
      setBridgePairs(parsedBridgePairs);
    }
  }, [setBridgePairs]);

  useEffect(() => {
    const pending = getPendingTransaction() as PendingTransaction;
    if (pending?.bridge_option.bridge_tx_type === TxType.Deposit && evmAddress) {
      setPendingTx(pending);
    } else if (pending?.bridge_option.bridge_tx_type === TxType.Withdrawal && icpIdentity) {
      setPendingTx(pending);
    }
  }, [evmAddress, icpIdentity, setPendingTx]);

  const { data: icpTokens } = useQuery({
    queryKey: ['IcpTokens'],
    queryFn: async () => {
      if (!unAuthenticatedAgent) return [];

      const res = await get_icp_tokens(unAuthenticatedAgent);

      if (res.result) {
        setStorageItem('icpTokens', JSON.stringify(res.result));
        setIcpTokens(res.result);
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
    queryKey: ['bridgePairs'],
    queryFn: async () => {
      if (!unAuthenticatedAgent) return [];

      const res = await get_bridge_pairs(unAuthenticatedAgent);

      if (res.result) {
        setStorageItem('bridgePairs', JSON.stringify(res.result));
        setBridgePairs(res.result);
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
    queryKey: ['icp-pools'],
    queryFn: async () => {
      const response = await get_all_pools(unAuthenticatedAgent as HttpAgent, icpTokens || []);
      if (!response.success) throw new Error('Failed to fetch all pools');
      return response.result;
    },
    enabled: !!unAuthenticatedAgent && !!icpTokens?.length,
    retry: false,
  });

  const { data: dexData } = useQuery({
    queryKey: ['dex-data'],
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
    if (allPools) setPools(allPools);
  }, [allPools, setPools]);

  useEffect(() => {
    if (dexData) setDexData(dexData);
  }, [dexData, setDexData]);

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
      <Image src={'/images/logo/white-logo.png'} alt="logo" width={52} height={43} />
      <Wallet />
    </header>
  );
}
