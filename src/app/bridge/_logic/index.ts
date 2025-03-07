export const dynamic = 'force-static';

import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { getStorageItem, setStorageItem } from '@/lib/helpers/localstorage';
import { useBridgeActions, useBridgeStore } from '../_store';
import { useSharedStore, useSharedStoreActions } from '@/store/store';
import { check_deposit_status, check_withdraw_status } from '@/blockchain_api/functions/icp/bridge_transactions';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchEvmBalances, fetchIcpBalances } from '@/lib/helpers/wallet';
import { BridgeOption } from '@/blockchain_api/functions/icp/get_bridge_options';
import { HttpAgent } from '@dfinity/agent';

export const BridgeLogic = () => {
  const queryClient = useQueryClient();
  // Bridge Store
  const { selectedOption, txHash, withdrawalId } = useBridgeStore();
  // Bridge Actions
  const { setTxStep } = useBridgeActions();
  // Shared Store
  const { icpIdentity, unAuthenticatedAgent, evmAddress } = useSharedStore();

  const { setIcpBalance, setEvmBalance } = useSharedStoreActions();

  // check deposit tx status
  useQuery({
    queryKey: ['check-deposit-status'],
    queryFn: async () => {
      const res = await check_deposit_status(
        txHash as `0x${string}`,
        selectedOption as BridgeOption,
        unAuthenticatedAgent as HttpAgent,
      );

      if (res.success) {
        if (res.result === 'Minted') {
          setTxStep({
            count: 5,
            status: 'successful',
          });
        } else if (res.result === 'Invalid' || res.result === 'Quarantined') {
          setTxStep({
            count: 5,
            status: 'failed',
          });
        } else {
          setTxStep({
            count: 5,
            status: 'pending',
          });
        }
      } else if (!res.success) {
        setTxStep({
          count: 5,
          status: 'failed',
        });
      }
      queryClient.invalidateQueries({ queryKey: ['bridge-history'] });
      fetchWalletBalances();
      return res;
    },
    refetchInterval: 1000 * 10,
    enabled: !!txHash && !!unAuthenticatedAgent && !!selectedOption,
  });

  // check withdrawal tx status
  useQuery({
    queryKey: ['check-withdrawal-status'],
    queryFn: async () => {
      const res = await check_withdraw_status(
        withdrawalId as string,
        selectedOption as BridgeOption,
        unAuthenticatedAgent as HttpAgent,
      );
      if (res.success) {
        if (res.result === 'Successful') {
          setTxStep({
            count: 4,
            status: 'successful',
          });
        } else if (res.result === 'QuarantinedReimbursement' || res.result === 'Reimbursed') {
          setTxStep({
            count: 4,
            status: 'failed',
          });
        } else {
          setTxStep({
            count: 4,
            status: 'pending',
          });
        }
      } else if (!res.success) {
        setTxStep({
          count: 4,
          status: 'failed',
        });
      }
      queryClient.invalidateQueries({ queryKey: ['bridge-history'] });
      fetchWalletBalances();
      return res;
    },
    refetchInterval: 1000 * 10,
    enabled: !!withdrawalId && !!selectedOption && !!unAuthenticatedAgent,
  });

  function fetchWalletBalances() {
    if (evmAddress && unAuthenticatedAgent) {
      fetchEvmBalances({
        evmAddress,
      }).then((res) => {
        setEvmBalance(res);
      });
    }
    if (unAuthenticatedAgent && icpIdentity) {
      fetchIcpBalances({
        unAuthenticatedAgent,
        icpIdentity,
      }).then((res) => {
        setIcpBalance(res);
      });
    }
  }

  // set data and last fetch time in localstorage
  function setBridgePairsWithTime(data: (EvmToken | IcpToken)[]) {
    const currentTime = new Date().getTime();
    setStorageItem('bridge-pairs', JSON.stringify(data));
    setStorageItem('bridge-pairs-last-fetch-time', currentTime.toString());
  }

  // get data and last fetch time from localstorage
  function getBridgePairsFromLocalStorage() {
    const rawData = getStorageItem('bridge-pairs');
    const lastFetchTime = getStorageItem('bridge-pairs-last-fetch-time');
    let parsedData: (EvmToken | IcpToken)[] | null = null;
    try {
      if (rawData?.length && rawData?.length > 0) {
        const data = JSON.parse(rawData);
        if (Array.isArray(data)) {
          parsedData = data as (EvmToken | IcpToken)[];
        }
      }
    } catch (error) {
      console.error('Invalid data format in localStorage:', error);
    }

    return {
      data: parsedData,
      lastFetchTime: lastFetchTime ? parseInt(lastFetchTime) : null,
    };
  }

  return {
    setBridgePairsWithTime,
    getBridgePairsFromLocalStorage,
  };
};
