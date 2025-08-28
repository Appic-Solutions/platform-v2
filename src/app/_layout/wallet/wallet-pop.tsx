/* eslint-disable @next/next/no-img-element */
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '@/components/ui/popover';
import Image from 'next/image';
import { ArrowPathIcon, CloseIcon, CopyIcon } from '@/components/icons';
import {
  cn,
  copyToClipboard,
  getChainLogo,
  getChainName,
  getCountedNumber,
  getFormattedWalletAddress,
} from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import WalletChart from './wallet-chart';

import WalletPopSkeletonDesktop from './wallet-pop-skeleton-dektop';
import BigNumber from 'bignumber.js';
import { WalletBalanceItems } from './wallet-balance-items';
import { DexBalanceItems } from './dex-balance-items';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from '@/components/ui/drawer';
import WalletPopSkeletonMobile from './wallet-pop-skeleton-mobile';
import { useQueryClient } from '@tanstack/react-query';
import { BalanceType, FormattedToken, WalletCardProps } from './_types';
import { tabs } from '@/lib/constants/swap';

export function WalletPop({
  logo,
  title,
  balance,
  disconnect,
  address,
  isLoading,
  hasMoreToken,
}: WalletCardProps) {
  const [showCopyPopover, setShowCopyPopover] = useState(false);
  const [activeTab, setActiveTab] = useState<BalanceType>('wallet');
  const [isIcpWallet, setIsIcpWallet] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (balance && 'dex_tokens' in balance) {
      setIsIcpWallet(true);
    } else {
      setIsIcpWallet(false);
    }
  }, [balance]);

  const refetchBalanceHandler = () => {
    if (isIcpWallet) {
      queryClient.invalidateQueries({ queryKey: ['fetch-icp-balances'] });
    } else {
      queryClient.invalidateQueries({ queryKey: ['fetch-evm-balances'] });
    }
  };

  const copyToClipboardHandler = (address: string) => {
    copyToClipboard(address).then((res) => {
      if (res) {
        setShowCopyPopover(true);
        setTimeout(() => setShowCopyPopover(false), 2000);
      }
    });
  };

  const formattedTokens: FormattedToken[] = useMemo(() => {
    if (!balance) return [];

    let mainTokens: IcpToken[] | EvmToken[];

    if (isIcpWallet && activeTab === 'wallet') {
      mainTokens = balance.tokens;
    } else if ('dex_tokens' in balance && activeTab === 'dex') {
      mainTokens = balance.dex_tokens;
    } else {
      mainTokens = balance.tokens;
    }

    return [...mainTokens]
      .sort((a, b) => new BigNumber(b.usdBalance || '0').minus(a.usdBalance || '0').toNumber())
      .map((token) => ({
        ...token,
        displayUsd: getCountedNumber(Number(token.usdBalance), 2),
        chainName: getChainName(token.chainId),
        chainLogo: getChainLogo(token.chainId),
      }));
  }, [balance, activeTab]);

  return (
    <>
      {/* mobile */}
      <div className="flex items-center justify-center md:hidden">
        <Drawer>
          <DrawerTrigger>
            <Image src={logo} alt={title} width={24} height={24} className="min-h-6 min-w-6" />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="pl-10">
              {title}
              <ArrowPathIcon
                onClick={refetchBalanceHandler}
                className={cn(
                  'absolute left-4 top-14',
                  isLoading
                    ? 'pointer-events-none animate-spin cursor-not-allowed opacity-75'
                    : 'cursor-pointer',
                )}
              />
            </DrawerHeader>

            {!balance ? (
              <WalletPopSkeletonMobile />
            ) : (
              <>
                {formattedTokens.length > 0 && <WalletChart balance={balance} />}

                {/* address + copy */}
                <div className="flex items-center justify-center gap-x-2 text-sm text-black dark:text-white">
                  <span>{getFormattedWalletAddress(address)}</span>
                  <button className="relative" onClick={() => copyToClipboardHandler(address)}>
                    <CopyIcon width={20} height={20} />
                    {showCopyPopover && (
                      <div className="absolute -left-5 -top-8 animate-fade rounded-lg border border-white/20 bg-[#1C1D1F] px-2 py-1">
                        Copied!
                      </div>
                    )}
                  </button>
                </div>

                {isIcpWallet && (
                  <div className="flex w-full justify-between text-primary">
                    {tabs.map((tab) => (
                      <Button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        variant={'ghost'}
                        className={cn(
                          'w-full rounded-none border-b',
                          activeTab === tab.value ? 'border-b-primary' : 'border-b-transparent',
                        )}
                      >
                        {tab.label}
                      </Button>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm text-[#5A5555] dark:text-[#919191]">
                    <span>Token</span>
                    Value
                  </div>
                  {formattedTokens.length > 0 && isIcpWallet && activeTab === 'dex' ? (
                    <DexBalanceItems tokens={formattedTokens} />
                  ) : formattedTokens.length > 0 ? (
                    <WalletBalanceItems tokens={formattedTokens} />
                  ) : (
                    <div className="flex items-center justify-center text-sm font-semibold text-white">
                      No tokens found
                    </div>
                  )}
                </div>

                {hasMoreToken && (
                  <button
                    onClick={refetchBalanceHandler}
                    className="rounded-[10px] bg-primary-buttons px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Load More
                  </button>
                )}

                <button
                  onClick={disconnect}
                  className="rounded-[10px] px-4 py-2 text-sm font-semibold text-fail duration-200 hover:bg-fail hover:text-white"
                >
                  Disconnect
                </button>
              </>
            )}
          </DrawerContent>
        </Drawer>
      </div>

      {/* desktop */}
      <div className="hidden items-center justify-center text-primary md:flex">
        <Popover>
          <PopoverTrigger>
            <Image src={logo} alt={title} width={24} height={24} className="min-h-6 min-w-6" />
          </PopoverTrigger>
          <PopoverContent
            className="flex w-[360px] translate-y-4 flex-col gap-y-4 px-10"
            align="end"
          >
            <div className="flex items-center justify-center font-medium text-black dark:text-white">
              <PopoverClose className="absolute right-4 top-4">
                <CloseIcon width={20} height={20} />
              </PopoverClose>
              {title}
              <ArrowPathIcon
                onClick={refetchBalanceHandler}
                className={cn(
                  'absolute left-4 top-4',
                  isLoading
                    ? 'pointer-events-none animate-spin cursor-not-allowed opacity-75'
                    : 'cursor-pointer',
                )}
              />
            </div>

            {!balance ? (
              <WalletPopSkeletonDesktop />
            ) : (
              <>
                {formattedTokens.length > 0 && <WalletChart balance={balance} />}

                {/* address + copy */}
                <div className="flex items-center justify-center gap-x-2 text-sm text-black dark:text-white">
                  <span>{getFormattedWalletAddress(address)}</span>
                  <button className="relative" onClick={() => copyToClipboardHandler(address)}>
                    <CopyIcon width={20} height={20} />
                    {showCopyPopover && (
                      <div className="absolute -left-5 -top-8 animate-fade rounded-lg border border-white/20 bg-[#1C1D1F] px-2 py-1">
                        Copied!
                      </div>
                    )}
                  </button>
                </div>

                {isIcpWallet && 'dex_tokens' in balance && balance.dex_tokens.length && (
                  <div className="flex w-full justify-between text-primary">
                    {tabs.map((tab) => (
                      <Button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        variant={'ghost'}
                        className={cn(
                          'w-full rounded-none border-b',
                          activeTab === tab.value ? 'border-b-primary' : 'border-b-transparent',
                        )}
                      >
                        {tab.label}
                      </Button>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm text-[#5A5555] dark:text-[#919191]">
                    <span>Token</span>
                    Value
                  </div>
                  {formattedTokens.length > 0 && isIcpWallet && activeTab === 'dex' ? (
                    <DexBalanceItems tokens={formattedTokens} />
                  ) : formattedTokens.length > 0 ? (
                    <WalletBalanceItems tokens={formattedTokens} />
                  ) : (
                    <div className="flex items-center justify-center text-sm font-semibold text-white">
                      No tokens found
                    </div>
                  )}
                </div>

                <hr className="bg-[#494949]" />
                <div className="text-dark flex items-center justify-between text-sm font-semibold dark:text-white">
                  {activeTab === 'dex' && 'dex_tokens' in balance ? (
                    <>
                      <span>Dex Total :</span>
                      <span>$ {getCountedNumber(Number(balance.totalDexBalances), 2)}</span>
                    </>
                  ) : (
                    <>
                      <span>Total :</span>
                      <span>$ {getCountedNumber(Number(balance.totalBalanceUsd), 2)}</span>
                    </>
                  )}
                </div>

                {hasMoreToken && (
                  <button
                    onClick={refetchBalanceHandler}
                    className="rounded-[10px] bg-primary-buttons px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Load More
                  </button>
                )}

                <button
                  onClick={disconnect}
                  className="rounded-[10px] px-4 py-2 text-sm font-semibold text-fail duration-200 hover:bg-fail hover:text-white"
                >
                  Disconnect
                </button>
              </>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
