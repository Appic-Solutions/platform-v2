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
import { Avatar } from '@/components/common/avatar';

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

export function WalletPop({ logo, title, balance, disconnect, address, isLoading, refetchBalance }: WalletCardProps) {

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
      <div className="md:hidden flex items-center justify-center">
        <Drawer>
          <DrawerTrigger>
            <Image src={logo} alt="ICP Wallet" width={24} height={24} className="min-w-6 min-h-6" />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className='pl-10'>
              {title}
              <ArrowPathIcon
                onClick={refetchBalance}
                className={cn(
                  "absolute top-14 left-4 cursor-pointer",
                  "disabled:pointer-events-none disabled:cursor-not-allowed",
                  isLoading && "animate-spin"
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
                      <div className="absolute py-1 px-2 rounded-lg bg-[#1C1D1F] border border-white/20 -left-5 -top-8 animate-fade">
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
                          className="flex items-center justify-between gap-x-4 text-sm text-dark dark:text-white"
                        >
                          <div className="relative flex items-center gap-x-5">
                            <Avatar
                              src={token.logo}
                              className="w-9 h-9"
                            />
                            <Avatar
                              src={getChainLogo(token.chainId)}
                              className='w-4 h-4 absolute top-5 left-7'
                            />
                            <span>{`${token.symbol} (${getChainName(token.chainId)})`}</span>
                          </div>
                          <span>$ {getCountedNumber(Number(token.usdBalance), 2)}</span>
                        </div>
                      ))}
                    </div>
                    <hr className="bg-[#494949]" />
                    <div className="flex items-center justify-between text-sm font-semibold text-dark dark:text-white">
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
                  className="text-sm font-semibold text-fail px-4 py-2 rounded-[10px] duration-200 hover:bg-fail hover:text-white"
                >
                  Disconnect
                </button>
              </>
            )}
          </DrawerContent>
        </Drawer>
      </div>

      {/* desktop size */}
      <div className="hidden md:flex items-center justify-center">
        <Popover>
          <PopoverTrigger>
            <Image src={logo} alt="ICP Wallet" width={24} height={24} className="min-w-6 min-h-6" />
          </PopoverTrigger>
          <PopoverContent className="w-[360px] translate-y-4 flex flex-col gap-y-4 px-10" align="end">
            <div className="flex items-center justify-center text-black font-medium dark:text-white">
              <PopoverClose className="absolute top-4 right-4">
                <CloseIcon width={20} height={20} />
              </PopoverClose>
              {title}
              <ArrowPathIcon
                onClick={refetchBalance}
                className={cn(
                  "absolute top-4 left-4 cursor-pointer",
                  "disabled:pointer-events-none disabled:cursor-not-allowed",
                  isLoading && "animate-spin"
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
                      <div className="absolute py-1 px-2 rounded-lg bg-[#1C1D1F] border border-white/20 -left-5 -top-8 animate-fade">
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
                    <div className="flex flex-col gap-y-5 max-h-56 overflow-y-auto">
                      {balance.tokens.map((token, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-x-4 text-sm text-dark dark:text-white"
                        >
                          <div className="relative flex items-center gap-x-5">
                            <Avatar
                              src={token.logo}
                              className="w-9 h-9"
                            />
                            <Avatar
                              src={getChainLogo(token.chainId)}
                              className='w-4 h-4 absolute top-5 left-7'
                            />
                            <span>{`${token.symbol} (${getChainName(token.chainId)})`}</span>
                          </div>
                          <span>$ {getCountedNumber(Number(token.usdBalance), 2)}</span>
                        </div>
                      ))}
                    </div>
                    <hr className="bg-[#494949]" />
                    <div className="flex items-center justify-between text-sm font-semibold text-dark dark:text-white">
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
                  className="text-sm font-semibold text-fail px-4 py-2 rounded-[10px] duration-200 hover:bg-fail hover:text-white"
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
