'use client';

import { cn } from '@/lib/utils';
import { useAuth } from '@nfid/identitykit/react';
import { useDisconnect } from '@reown/appkit/react';

import { useSharedStore, useSharedStoreActions } from '@/store/store';

import { WalletPop } from './wallet/wallet-pop';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HttpAgent } from '@dfinity/agent';
import { getStorageItem } from '@/lib/helpers/localstorage';
import { get_icp_wallet_tokens_balances } from '@/blockchain_api/functions/icp/get_icp_balances';
import { Principal } from '@dfinity/principal';
import { get_evm_wallet_tokens_balances } from '@/blockchain_api/functions/evm/get_evm_balances';
import { WalletConnectButtons } from './wallet-connect-buttons';

const WalletPage = () => {
  const [isFirstIcpFetch, setIsFirstIcpFetch] = useState(true);

  const {
    icpIdentity,
    evmAddress,
    isEvmConnected,
    icpBalance,
    evmBalance,
    isEvmBalanceLoading,
    isIcpBalanceLoading,
    unAuthenticatedAgent,
    bridgePairs,
  } = useSharedStore();

  const {
    setIcpBalance,
    setEvmBalance,
    setIsEvmConnected,
    setChainId,
    setIcpIdentity,
    setEvmAddress,
    setIsEvmBalanceLoading,
    setIsIcpBalanceLoading,
  } = useSharedStoreActions();

  const fetchIcpBalances = async ({
    unAuthenticatedAgent,
    principal,
    top_tokens,
  }: {
    unAuthenticatedAgent: HttpAgent | null;
    principal: Principal | null;
    top_tokens: boolean;
  }) => {
    setIsIcpBalanceLoading(true);
    try {
      if (unAuthenticatedAgent && principal) {
        const allIcpTokens = getStorageItem('icpTokens');
        const icpBalanceRes = await get_icp_wallet_tokens_balances(
          principal.toString(),
          JSON.parse(allIcpTokens || '[]'),
          top_tokens,
          unAuthenticatedAgent,
        );

        if (icpBalanceRes && icpBalanceRes.result) {
          setIcpBalance(icpBalanceRes.result);
        }

        return icpBalanceRes;
      }
    } catch (error) {
      console.log('Get ICP Balance Error => ', error);
    } finally {
      setIsIcpBalanceLoading(false);
      if (isFirstIcpFetch) setIsFirstIcpFetch(false);
    }
  };

  const fetchEvmBalances = async ({ evmAddress }: { evmAddress: string | undefined }) => {
    try {
      setIsEvmBalanceLoading(true);
      if (evmAddress && bridgePairs) {
        const evmBalanceData = await get_evm_wallet_tokens_balances(evmAddress, bridgePairs);
        if (evmBalanceData && evmBalanceData.result) {
          setEvmBalance(evmBalanceData.result);
          return evmBalanceData.result;
        }
        return evmBalanceData;
      }
    } catch (error) {
      console.log('Get EVM Balance Error => ', error);
    } finally {
      setIsEvmBalanceLoading(false);
    }
  };

  useQuery({
    queryKey: ['fetch-icp-balances'],
    queryFn: () =>
      fetchIcpBalances({
        unAuthenticatedAgent: unAuthenticatedAgent!,
        principal: icpIdentity!,
        top_tokens: isFirstIcpFetch,
      }),
    refetchInterval: 1000 * 120,
    staleTime: 0,
    gcTime: 1000 * 60,
    enabled: !!icpIdentity && !!unAuthenticatedAgent,
  });

  useQuery({
    queryKey: ['fetch-evm-balances'],
    queryFn: () => fetchEvmBalances({ evmAddress }),
    refetchInterval: 1000 * 120,
    staleTime: 0,
    gcTime: 1000 * 60,
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: !!evmAddress,
  });

  const { disconnect: disconnectIcp } = useAuth();
  const { disconnect: disconnectEvm } = useDisconnect();

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
      {(!icpIdentity || !isEvmConnected) && <WalletConnectButtons />}

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
            hasMoreToken
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
          />
        )}
      </div>
    </div>
  );
};

export default WalletPage;
