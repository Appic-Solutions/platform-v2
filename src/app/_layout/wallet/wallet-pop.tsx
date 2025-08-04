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
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from '@/components/ui/drawer';
import { useState } from 'react';
import WalletChart from './wallet-chart';
import WalletPopSkeletonMobile from './wallet-pop-skeleton-mobile';
import WalletPopSkeletonDesktop from './wallet-pop-skeleton-dektop';
import { Avatar } from '@/components/common/ui/avatar';

export type WalletBalance =
  | {
      tokens: IcpToken[];
      totalBalanceUsd: string;
    }
  | {
      tokens: EvmToken[];
      totalBalanceUsd: string;
    };

interface WalletCardProps {
  logo: string;
  title: string;
  balance: WalletBalance | undefined;
  disconnect: () => void;
  isLoading: boolean;
  address: string;
  refetchBalance: () => void;
}

export function WalletPop({
  logo,
  title,
  balance,
  disconnect,
  address,
  isLoading,
  refetchBalance,
}: WalletCardProps) {
  const [showCopyPopover, setShowCopyPopover] = useState(false);

  const copyToClipboardHandler = (address: string) => {
    copyToClipboard(address).then((res) => {
      if (res) {
        setShowCopyPopover(true);
        setTimeout(() => {
          setShowCopyPopover(false);
        }, 2000);
      }
    });
  };

  return (
    <>
      {/* mobile size */}
      <div className="flex items-center justify-center md:hidden">
        <Drawer>
          <DrawerTrigger>
            <Image src={logo} alt="ICP Wallet" width={24} height={24} className="min-h-6 min-w-6" />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="pl-10">
              {title}
              <ArrowPathIcon
                onClick={refetchBalance}
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
                {balance.tokens.length > 0 && <WalletChart balance={balance} />}
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
                {balance.tokens.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between text-sm text-[#5A5555] dark:text-[#919191]">
                      <span>Token</span>
                      Value
                    </div>
                    <div className="flex flex-col gap-y-5">
                      {balance.tokens.map((token, idx) => (
                        <div
                          key={idx}
                          className="text-dark flex items-center justify-between gap-x-4 text-sm dark:text-white"
                        >
                          <div className="relative flex items-center gap-x-5">
                            <Avatar src={token.logo} className="h-8 w-8" />
                            <Avatar
                              src={getChainLogo(token.chainId)}
                              className="absolute left-8 top-5 h-3.5 w-3.5"
                            />
                            <span>{`${token.symbol} (${getChainName(token.chainId)})`}</span>
                          </div>
                          <span>$ {getCountedNumber(Number(token.usdBalance), 2)}</span>
                        </div>
                      ))}
                    </div>
                    <hr className="bg-[#494949]" />
                    <div className="text-dark flex items-center justify-between text-sm font-semibold dark:text-white">
                      <span>Total :</span>$ {getCountedNumber(Number(balance.totalBalanceUsd), 2)}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center text-sm font-semibold text-white">
                    No tokens found
                  </div>
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

      {/* desktop size */}
      <div className="hidden items-center justify-center md:flex">
        <Popover>
          <PopoverTrigger>
            <Image src={logo} alt="ICP Wallet" width={24} height={24} className="min-h-6 min-w-6" />
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
                onClick={refetchBalance}
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
            ) : balance ? (
              <>
                {balance && balance.tokens.length > 0 && <WalletChart balance={balance} />}
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
                {balance.tokens.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between text-sm text-[#5A5555] dark:text-[#919191]">
                      <span>Token</span>
                      Value
                    </div>
                    <div className="flex max-h-56 flex-col gap-y-5 overflow-y-auto">
                      {balance.tokens.map((token, idx) => (
                        <div
                          key={idx}
                          className="text-dark flex items-center justify-between gap-x-4 text-sm dark:text-white"
                        >
                          <div className="relative flex items-center gap-x-5">
                            <Avatar src={token.logo} className="h-9 w-9" />
                            <Avatar
                              src={getChainLogo(token.chainId)}
                              className="absolute left-7 top-5 h-4 w-4"
                            />
                            <span>{`${token.symbol} (${getChainName(token.chainId)})`}</span>
                          </div>
                          <span>$ {getCountedNumber(Number(token.usdBalance), 2)}</span>
                        </div>
                      ))}
                    </div>
                    <hr className="bg-[#494949]" />
                    <div className="text-dark flex items-center justify-between text-sm font-semibold dark:text-white">
                      <span>Total :</span>$ {getCountedNumber(Number(balance.totalBalanceUsd), 2)}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center text-sm font-semibold text-white">
                    No tokens found
                  </div>
                )}
                <button
                  onClick={disconnect}
                  className="rounded-[10px] px-4 py-2 text-sm font-semibold text-fail duration-200 hover:bg-fail hover:text-white"
                >
                  Disconnect
                </button>
              </>
            ) : null}
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
