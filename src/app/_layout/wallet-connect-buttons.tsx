'use client';

import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from '@/components/ui/drawer';
import React from 'react';
import WalletCard from './wallet/wallet-card';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CloseIcon } from '@/components/icons';
import { useSharedStore } from '@/store/store';
import { getChainLogo } from '@/lib/utils';
import { useAuth } from '@nfid/identitykit/react';
import { useAppKit } from '@reown/appkit/react';

export const WalletConnectButtons = () => {
  const { icpIdentity, isEvmConnected, chainId } = useSharedStore();
  const { connect: connectIcp } = useAuth();
  const { open: openEvmModal } = useAppKit();
  return (
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
  );
};
