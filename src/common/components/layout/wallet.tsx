'use client';
import { cn, getChainLogo } from '@/common/helpers/utils';
import { useAuth } from '@nfid/identitykit/react';
import { useAppKit, useDisconnect } from '@reown/appkit/react';
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '../ui/popover';
import { CloseIcon } from '../icons';
import WalletCard from './wallet/wallet-card';
import { WalletPop } from './wallet/wallet-pop';
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from '../ui/drawer';
import { useSharedStore, useSharedStoreActions } from '@/common/state/store';
import { fetchEvmBalances, fetchIcpBalances } from '@/common/helpers/wallet';
import { useUnAuthenticatedAgent } from '@/common/hooks/useUnauthenticatedAgent';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

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
    setEvmBalance,
    setUnAuthenticatedAgent,
    setIsEvmConnected,
    setChainId,
    setIcpIdentity,
    setEvmAddress,
    setIsEvmBalanceLoading,
    setIsIcpBalanceLoading,
  } = useSharedStoreActions();

  // ICP Wallet Hooks
  const { connect: connectIcp, disconnect: disconnectIcp } = useAuth();

  // EVM Wallet Hooks
  const { open: openEvmModal } = useAppKit();
  const { disconnect: disconnectEvm } = useDisconnect();

  const unAuthenticatedAgent = useUnAuthenticatedAgent();

  const [isFetching, setIsFetching] = useState(false);
  const fetchBalances = async () => {
    if (isFetching) return null;
    setIsFetching(true);

    // Fetch EVM balance
    if (evmAddress) {
      setIsEvmBalanceLoading(true);
      try {
        const evmRes = await fetchEvmBalances({ evmAddress });
        setEvmBalance(evmRes);
      } finally {
        setIsEvmBalanceLoading(false);
      }
    }

    // Fetch ICP balance
    if (icpIdentity && unAuthenticatedAgent) {
      setUnAuthenticatedAgent(unAuthenticatedAgent);
      setIsIcpBalanceLoading(true);
      try {
        const icpRes = await fetchIcpBalances({ unAuthenticatedAgent, icpIdentity });
        setIcpBalance(icpRes);
      } finally {
        setIsIcpBalanceLoading(false);
      }
    }

    setIsFetching(false);
    return null;
  };

  // Fetch balances on dependency change
  useEffect(() => {
    if (evmAddress || icpIdentity) {
      fetchBalances();
    }
  }, [evmAddress, icpIdentity]);

  // Fetch balances every 1.5 minutes
  useQuery({
    queryKey: ['fetch-wallet-balances'],
    queryFn: fetchBalances,
    refetchInterval: 1000 * 90,
    gcTime: 1000 * 60,
    staleTime: 1000 * 60,
    enabled: !!(evmAddress || icpIdentity), // Enable only if wallets are connected
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

  return (
    <div
      className={cn(
        'flex items-center justify-evenly gap-2 relative min-w-fit lg:h-[42px]',
        'rounded-full bg-[#faf7fd]/50 border border-[#ECE6F5]',
        'md:col-span-2 md:justify-self-end',
        (icpIdentity || isEvmConnected) && 'px-3',
        '*:rounded-full',
      )}
    >
      {(!icpIdentity || !isEvmConnected) && (
        <>
          {/* mobile wallet connection buttons */}
          <div className="md:hidden">
            <Drawer>
              <DrawerTrigger className="w-full font-medium text-sm text-white py-2 px-3">
                {icpIdentity || isEvmConnected ? 'Add Wallet' : 'Connect Wallet'}
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>Select Wallet</DrawerHeader>
                <div className="flex flex-col gap-4">
                  {!icpIdentity && (
                    <WalletCard
                      connectWallet={() => connectIcp()}
                      walletLogo="/images/logo/wallet_logos/icp.svg"
                      walletTitle="Connect ICP Wallet"
                    />
                  )}
                  {!isEvmConnected && (
                    <WalletCard
                      connectWallet={() => openEvmModal()}
                      walletLogo={getChainLogo(chainId)}
                      walletTitle="Connect EVM Wallet"
                    />
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          {/* desktop wallet connection buttons */}
          <div className="hidden md:block">
            <Popover>
              <PopoverTrigger className="w-full font-medium text-sm text-white py-2 px-3">
                {icpIdentity || isEvmConnected ? 'Add Wallet' : 'Connect Wallet'}
              </PopoverTrigger>
              <PopoverContent className="w-72 translate-y-4 flex flex-col gap-y-4" align="end">
                <div className="flex items-center justify-center font-medium text-white">
                  <PopoverClose className="absolute top-4 right-4">
                    <CloseIcon width={20} height={20} />
                  </PopoverClose>
                  Select Wallet
                </div>
                <div className="flex flex-col gap-4">
                  {!icpIdentity && (
                    <WalletCard
                      connectWallet={() => connectIcp()}
                      walletLogo="/images/logo/wallet_logos/icp.svg"
                      walletTitle="Connect ICP Wallet"
                    />
                  )}
                  {!isEvmConnected && (
                    <WalletCard
                      connectWallet={() => openEvmModal()}
                      walletLogo={'/images/logo/chains-logos/ethereum.svg'}
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
        <span className="w-full font-medium text-sm text-white py-2 px-3">Connected Wallets</span>
      )}

      {/* wallet content */}
      <div className="flex items-center gap-x-2">
        {isIcpBalanceLoading || icpBalance ? (
          <WalletPop
            logo="/images/logo/wallet_logos/icp.svg"
            title="Your ICP Wallet"
            balance={icpBalance}
            disconnect={handleDisconnectIcp}
            isLoading={isIcpBalanceLoading}
            address={icpIdentity?.getPrincipal().toString() || ''}
          />
        ) : null}

        {isEvmBalanceLoading || evmBalance ? (
          <WalletPop
            logo={'/images/logo/chains-logos/ethereum.svg'}
            title="Your EVM Wallet"
            balance={evmBalance}
            disconnect={handleDisconnectEvm}
            isLoading={isEvmBalanceLoading}
            address={evmAddress || ''}
          />
        ) : null}
      </div>
    </div>
  );
};

export default WalletPage;
