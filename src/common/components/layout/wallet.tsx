'use client';
import { cn, getChainLogo } from '@/common/helpers/utils';
import { useAuth } from '@nfid/identitykit/react';
import { useAppKit, useDisconnect } from '@reown/appkit/react';
import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '../ui/popover';
import { CloseIcon } from '../icons';
import WalletCard from './wallet/wallet-card';
import { WalletPop } from './wallet/wallet-pop';
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from '../ui/drawer';
import { useSharedStore, useSharedStoreActions } from '@/common/state/store';
import { fetchEvmBalances, fetchIcpBalances } from '@/common/helpers/wallet';
import { useUnAuthenticatedAgent } from '@/common/hooks/useUnauthenticatedAgent';
import { Skeleton } from '../ui/skeleton';

const WalletPage = () => {
  const { authenticatedAgent, icpIdentity, evmAddress, isEvmConnected, chainId, icpBalance, evmBalance } =
    useSharedStore((state) => state);
  const {
    setIcpBalance,
    setEvmBalance,
    setUnAuthenticatedAgent,
    setIsEvmConnected,
    setChainId,
    setIcpIdentity,
    setEvmAddress,
  } = useSharedStoreActions();

  const [icpLoading, setIcpLoading] = useState(false);
  const [evmLoading, setEvmLoading] = useState(false);

  // ICP Wallet Hooks
  const { connect: connectIcp, disconnect: disconnectIcp } = useAuth();

  // EVM Wallet Hooks
  const { open: openEvmModal } = useAppKit();
  const { disconnect: disconnectEvm } = useDisconnect();

  const unAuthenticatedAgent = useUnAuthenticatedAgent();

  useEffect(() => {
    if (unAuthenticatedAgent && icpIdentity) {
      setIcpLoading(true);
      fetchIcpBalances({
        unAuthenticatedAgent,
        icpIdentity,
      }).then((res) => {
        setIcpBalance(res);
        setIcpLoading(false);
      });
    }
    if (evmAddress && unAuthenticatedAgent) {
      setEvmLoading(true);
      setUnAuthenticatedAgent(unAuthenticatedAgent);
      fetchEvmBalances({
        evmAddress,
      }).then((res) => {
        setEvmBalance(res);
        setEvmLoading(false);
      });
    }
  }, [
    unAuthenticatedAgent,
    icpIdentity,
    evmAddress,
    authenticatedAgent,
    setUnAuthenticatedAgent,
    setIcpBalance,
    setEvmBalance,
  ]);

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
                      walletLogo={getChainLogo(chainId)}
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

      <div className="flex items-center gap-x-2">
        {icpBalance && !icpLoading ? (
          <WalletPop
            logo="/images/logo/wallet_logos/icp.svg"
            title="Your ICP Wallet"
            balance={icpBalance}
            disconnect={handleDisconnectIcp}
            isLoading={icpLoading}
            address={icpIdentity?.getPrincipal().toString() || ''}
          />
        ) : icpLoading ? (
          <Skeleton className="w-6 h-6" />
        ) : null}

        {evmBalance && !evmLoading ? (
          <WalletPop
            logo={getChainLogo(chainId)}
            title="Your EVM Wallet"
            balance={evmBalance}
            disconnect={handleDisconnectEvm}
            isLoading={evmLoading}
            address={evmAddress || ''}
          />
        ) : evmLoading ? (
          <Skeleton className="w-6 h-6" />
        ) : null}
      </div>
    </div>
  );
};

export default WalletPage;
