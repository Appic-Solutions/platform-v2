'use client';

/** What are we doing currently in wallet?
 * LOGIC =====>
 *	1- icp and evm wallet connection logic
 * UI =======>
 * mobile wallet connection (navbar buttons) +
 * desktop wallet connection (navbar buttons) +
 * evm tokens wallet popup +
 * icp tokens wallet popup +
 *
 *  **/

import { cn, getChainLogo } from '@/lib/utils';
import { useAuth } from '@nfid/identitykit/react';
import { useAppKit, useDisconnect } from '@reown/appkit/react';

import { useSharedStore, useSharedStoreActions } from '@/store/store';

import WalletCard from './wallet/wallet-card';
import { WalletPop } from './wallet/wallet-pop';
import { CloseIcon } from '@/components/icons';
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '@/components/ui/popover';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HttpAgent } from '@dfinity/agent';
import { getStorageItem } from '@/lib/helpers/localstorage';
import { get_icp_wallet_tokens_balances } from '@/blockchain_api/functions/icp/get_icp_balances';
import { Principal } from '@dfinity/principal';
import { get_evm_wallet_tokens_balances } from '@/blockchain_api/functions/evm/get_evm_balances';

const WalletPage = () => {
  const [isFirstIcpFetch, setIsFirstIcpFetch] = useState(true);

  const {
    icpIdentity,
    evmAddress,
    isEvmConnected,
    chainId,
    icpBalance,
    evmBalance,
    isEvmBalanceLoading,
    isIcpBalanceLoading,
    unAuthenticatedAgent,
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
      if (evmAddress) {
        const bridge_pairs = getStorageItem('bridge-pairs');
        const evmBalanceData = await get_evm_wallet_tokens_balances(
          evmAddress,
          JSON.parse(bridge_pairs || '[]'),
        );
        if (evmBalanceData && evmBalanceData.result) {
          setEvmBalance(evmBalanceData.result);
        }
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
    refetchOnMount: true,
    refetchOnReconnect: true,
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

  const { connect: connectIcp, disconnect: disconnectIcp } = useAuth();
  const { open: openEvmModal } = useAppKit();
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
