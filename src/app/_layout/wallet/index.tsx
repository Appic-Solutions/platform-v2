'use client';
import { cn, getChainLogo } from '@/lib/utils';

import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '@/components/ui/popover';
import { CloseIcon } from '@/components/icons';
import WalletCard from './wallet-card';
import { WalletPop } from './wallet-pop';
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from '@/components/ui/drawer';
import { useSharedStore } from '@/store/store';
import { WalletLogic } from './_logic';

const Wallet = () => {
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
  const { walletConnectHandler, walletDisconnectHandler } = WalletLogic();

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
                      connectWallet={() => walletConnectHandler('ICP')}
                      walletLogo="/images/logo/wallet_logos/icp.svg"
                      walletTitle="Connect ICP Wallet"
                    />
                  )}
                  {!isEvmConnected && (
                    <WalletCard
                      connectWallet={() => walletConnectHandler('EVM')}
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
                      connectWallet={() => walletConnectHandler('ICP')}
                      walletLogo="/images/logo/wallet_logos/icp.svg"
                      walletTitle="Connect ICP Wallet"
                    />
                  )}
                  {!isEvmConnected && (
                    <WalletCard
                      connectWallet={() => walletConnectHandler('EVM')}
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
        {icpIdentity ? (
          <WalletPop
            logo="/images/logo/wallet_logos/icp.svg"
            title="Your ICP Wallet"
            balance={icpBalance}
            disconnect={() => walletDisconnectHandler('ICP')}
            isLoading={isIcpBalanceLoading}
            address={icpIdentity?.getPrincipal().toString() || ''}
          />
        ) : null}

        {isEvmConnected ? (
          <WalletPop
            logo={'/images/logo/chains-logos/ethereum.svg'}
            title="Your EVM Wallet"
            balance={evmBalance}
            disconnect={() => walletDisconnectHandler('EVM')}
            isLoading={isEvmBalanceLoading}
            address={evmAddress || ''}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Wallet;
