'use client';

import { cn } from '@/lib/utils';
import { useAuth } from '@nfid/identitykit/react';
import { useDisconnect } from '@reown/appkit/react';

import { useSharedStore, useSharedStoreActions } from '@/store/store';

import { WalletPop } from './wallet/wallet-pop';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { HttpAgent } from '@dfinity/agent';
import { get_icp_wallet_tokens_balances } from '@/blockchain_api/functions/icp/get_icp_balances';
import { Principal } from '@dfinity/principal';
import { get_evm_wallet_tokens_balances } from '@/blockchain_api/functions/evm/get_evm_balances';
import { WalletConnectButtons } from './wallet-connect-buttons';
import { queryKeys } from '@/lib/constants/query-keys';
import { useTypedQueryData } from '@/lib/hooks/use-typed-query-data';

const WalletPage = () => {
  const [isFirstIcpFetch, setIsFirstIcpFetch] = useState(true);
  const queryClient = useQueryClient();
  const icpTokens = useTypedQueryData(queryKeys.icpTokens);
  const bridgePairs = useTypedQueryData(queryKeys.bridgePairs);

  const { icpIdentity, evmAddress, isEvmConnected, unAuthenticatedAgent } = useSharedStore();

  const { setIsEvmConnected, setChainId, setIcpIdentity, setEvmAddress } = useSharedStoreActions();

  const fetchIcpBalances = async ({
    unAuthenticatedAgent,
    principal,
    top_tokens,
  }: {
    unAuthenticatedAgent: HttpAgent | null;
    principal: Principal | null;
    top_tokens: boolean;
  }) => {
    try {
      if (unAuthenticatedAgent && principal && icpTokens) {
        const icpBalanceRes = await get_icp_wallet_tokens_balances(
          principal.toString(),
          icpTokens,
          top_tokens,
          unAuthenticatedAgent,
        );

        return icpBalanceRes.result;
      }
    } catch (error) {
      console.log('Get ICP Balance Error => ', error);
    } finally {
      if (isFirstIcpFetch) setIsFirstIcpFetch(false);
    }
  };

  const fetchEvmBalances = async ({ evmAddress }: { evmAddress: string | undefined }) => {
    try {
      if (evmAddress && bridgePairs) {
        const evmBalanceData = await get_evm_wallet_tokens_balances(evmAddress, bridgePairs);
        if (evmBalanceData && evmBalanceData.result) {
          return evmBalanceData.result;
        }
      }
    } catch (error) {
      console.log('Get EVM Balance Error => ', error);
    }
  };

  const { isFetching: isIcpFetching, data: icpBalance } = useQuery({
    queryKey: [queryKeys.icpBalance],
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

  const { isFetching: isEvmFetching, data: evmBalance } = useQuery({
    queryKey: [queryKeys.evmBalance],
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
    queryClient.removeQueries({ queryKey: [queryKeys.icpBalance], exact: true });
    setIcpIdentity(undefined);
  };

  const handleDisconnectEvm = () => {
    disconnectEvm();
    queryClient.removeQueries({ queryKey: [queryKeys.evmBalance], exact: true });
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
            isLoading={isIcpFetching}
            address={icpIdentity.toString()}
            hasMoreToken
            queryKey={queryKeys.icpBalance}
          />
        )}
        {isEvmConnected && (
          <WalletPop
            logo="/images/logo/chains-logos/ethereum.svg"
            title="Your EVM Wallet"
            balance={evmBalance}
            disconnect={handleDisconnectEvm}
            isLoading={isEvmFetching}
            address={evmAddress || ''}
            queryKey={queryKeys.evmBalance}
          />
        )}
      </div>
    </div>
  );
};

export default WalletPage;
