'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { HttpAgent } from '@dfinity/agent';

import { cn, getChainLogo } from '@/lib/utils';
import { getStorageItem, setStorageItem } from '@/lib/helpers/localstorage';
import { fetchEvmBalances, fetchIcpBalances } from '@/lib/helpers/wallet';
import { useUnAuthenticatedAgent } from '@/lib/hooks/useUnauthenticatedAgent';
import { useAuth } from '@nfid/identitykit/react';
import { useAppKit, useDisconnect } from '@reown/appkit/react';

import {
  check_deposit_status,
  check_withdraw_status,
} from '@/blockchain_api/functions/icp/bridge_transactions';
import { get_all_pools, Pool } from '@/blockchain_api/functions/icp/dex/get_pool';
import { get_dex_data } from '@/blockchain_api/functions/icp/dex/explore/get_pool_history';
import { BridgeOption, TxType } from '@/blockchain_api/functions/icp/get_bridge_options';
import { IcpToken } from '@/blockchain_api/types/tokens';

import {
  getPendingTransaction,
  PendingTransaction,
  removePendingTransaction,
} from '@/lib/helpers/session';

import { useSharedStore, useSharedStoreActions } from '@/store/store';
import { useBridgeActions, useBridgeStore } from '@/app/bridge/_store';

import WalletCard from './wallet/wallet-card';
import { WalletPop } from './wallet/wallet-pop';
import { CloseIcon } from '@/components/icons';
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '@/components/ui/popover';
import { get_icp_tokens } from '@/blockchain_api/functions/icp/get_all_icp_tokens';

const WalletPage = () => {
  const {
    icpIdentity,
    evmAddress,
    isEvmConnected,
    chainId,
    icpBalance,
    evmBalance,
    isEvmBalanceLoading,
    isIcpBalanceLoading,
  } = useSharedStore();

  const {
    setIcpBalance,
    setIcpTokens,
    setEvmBalance,
    setUnAuthenticatedAgent,
    setIsEvmConnected,
    setChainId,
    setIcpIdentity,
    setEvmAddress,
    setIsEvmBalanceLoading,
    setIsIcpBalanceLoading,
    setPools,
    setDexData,
  } = useSharedStoreActions();

  const { pendingTx } = useBridgeStore();
  const { setPendingTx } = useBridgeActions();

  const queryClient = useQueryClient();
  const { connect: connectIcp, disconnect: disconnectIcp } = useAuth();
  const { open: openEvmModal } = useAppKit();
  const { disconnect: disconnectEvm } = useDisconnect();
  const unAuthenticatedAgent = useUnAuthenticatedAgent();

  const [isFetching, setIsFetching] = useState(false);
  const [isFirstIcpFetch, setIsFirstIcpFetch] = useState(true);

  const fetchBalances = async (getIcpTopToken: boolean = false) => {
    if (isFetching) return null;
    setIsFetching(true);

    if (evmAddress) {
      setIsEvmBalanceLoading(true);
      try {
        const evmRes = await fetchEvmBalances({ evmAddress });
        setEvmBalance(evmRes);
      } finally {
        setIsEvmBalanceLoading(false);
      }
    }

    if (icpIdentity && unAuthenticatedAgent) {
      setUnAuthenticatedAgent(unAuthenticatedAgent);
      setIsIcpBalanceLoading(true);
      try {
        const icpRes = await fetchIcpBalances({
          unAuthenticatedAgent,
          principal: icpIdentity,
          top_tokens: getIcpTopToken,
        });
        setIcpBalance(icpRes);
      } finally {
        setIsIcpBalanceLoading(false);
      }
    }

    setIsFetching(false);
    if (isFirstIcpFetch) setIsFirstIcpFetch(false);
    return null;
  };

  useQuery({
    queryKey: ['fetch-wallet-balances'],
    queryFn: () => fetchBalances(isFirstIcpFetch),
    refetchInterval: 1000 * 120,
    staleTime: 0,
    gcTime: 1000 * 60,
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: !!(evmAddress || icpIdentity),
  });

  const handleDisconnectIcp = () => {
    disconnectIcp();
    setIcpBalance(undefined);
    setIcpIdentity(undefined);
  };

  const handleDisconnectEvm = () => {
    disconnectEvm();
    setEvmBalance(undefined);
    setIsEvmConnected(false);
    setChainId(undefined);
    setEvmAddress(undefined);
  };

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

      queryClient.invalidateQueries({ queryKey: ['bridge-history'] });
      fetchBalances();
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

      queryClient.invalidateQueries({ queryKey: ['bridge-history'] });
      fetchBalances();
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
    <div
      className={cn(
        'relative flex min-w-fit items-center justify-evenly gap-2 lg:h-[42px]',
        'rounded-full border border-[#ECE6F5] bg-[#faf7fd]/50',
        'md:col-span-2 md:justify-self-end',
        (icpIdentity || isEvmConnected) && 'px-3',
        '*:rounded-full',
      )}
    >
      {(!icpIdentity || !isEvmConnected) && (
        <>
          {/* Mobile wallet connection */}
          <div className="md:hidden">
            <Drawer>
              <DrawerTrigger className="w-full px-3 py-2 text-sm font-medium text-white">
                {icpIdentity || isEvmConnected ? 'Add Wallet' : 'Connect Wallet'}
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>Select Wallet</DrawerHeader>
                <div className="flex flex-col gap-4">
                  {!icpIdentity && (
                    <WalletCard
                      connectWallet={connectIcp}
                      walletLogo="/images/logo/wallet_logos/icp.svg"
                      walletTitle="Connect ICP Wallet"
                    />
                  )}
                  {!isEvmConnected && (
                    <WalletCard
                      connectWallet={openEvmModal}
                      walletLogo={getChainLogo(chainId)}
                      walletTitle="Connect EVM Wallet"
                    />
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Desktop wallet connection */}
          <div className="hidden md:block">
            <Popover>
              <PopoverTrigger className="w-full px-3 py-2 text-sm font-medium text-white">
                {icpIdentity || isEvmConnected ? 'Add Wallet' : 'Connect Wallet'}
              </PopoverTrigger>
              <PopoverContent className="flex w-72 translate-y-4 flex-col gap-y-4" align="end">
                <div className="flex items-center justify-center font-medium text-white">
                  <PopoverClose className="absolute right-4 top-4">
                    <CloseIcon width={20} height={20} />
                  </PopoverClose>
                  Select Wallet
                </div>
                <div className="flex flex-col gap-4">
                  {!icpIdentity && (
                    <WalletCard
                      connectWallet={connectIcp}
                      walletLogo="/images/logo/wallet_logos/icp.svg"
                      walletTitle="Connect ICP Wallet"
                    />
                  )}
                  {!isEvmConnected && (
                    <WalletCard
                      connectWallet={openEvmModal}
                      walletLogo="/images/logo/chains-logos/ethereum.svg"
                      walletTitle="Connect EVM Wallet"
                    />
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </>
      )}

      {icpIdentity && isEvmConnected && (
        <span className="w-full px-3 py-2 text-sm font-medium text-white">Connected Wallets</span>
      )}

      <div className="flex items-center gap-x-2">
        {icpIdentity && (
          <WalletPop
            logo="/images/logo/wallet_logos/icp.svg"
            title="Your ICP Wallet"
            balance={icpBalance}
            disconnect={handleDisconnectIcp}
            isLoading={isIcpBalanceLoading}
            address={icpIdentity.toString()}
            refetchBalance={fetchBalances}
            hasMoreToken
            loadMoreHandler={fetchBalances}
          />
        )}
        {isEvmConnected && (
          <WalletPop
            logo="/images/logo/chains-logos/ethereum.svg"
            title="Your EVM Wallet"
            balance={evmBalance}
            disconnect={handleDisconnectEvm}
            isLoading={isEvmBalanceLoading}
            address={evmAddress || ''}
            refetchBalance={fetchBalances}
          />
        )}
      </div>
    </div>
  );
};

export default WalletPage;
