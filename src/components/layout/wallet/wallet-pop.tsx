/* eslint-disable @next/next/no-img-element */
import { EvmToken, IcpToken } from "@/blockchain_api/types/tokens";
import { Dispatch, SetStateAction } from "react"
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "@/components/ui/popover";
import Image from "next/image";
import { CloseIcon, CopyIcon } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { copyToClipboard, getCountedNumber, getFormattedWalletAddress } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type WalletBalance = {
  tokens: IcpToken[];
  totalBalanceUsd: string;
} | {
  tokens: EvmToken[]
  totalBalanceUsd: string
}

interface WalletCardProps {
  open: boolean,
  openOnChange: Dispatch<SetStateAction<boolean>>,
  logo: string,
  title: string,
  balance: WalletBalance,
  disconnect: () => void,
  isLoading: boolean,
  address: string
}

export function WalletPop({
  open,
  openOnChange,
  logo,
  title,
  balance,
  disconnect,
  isLoading,
  address
}: WalletCardProps) {
  return (
    <Popover open={open} onOpenChange={openOnChange}>
      <PopoverTrigger>
        {isLoading ? (
          <Skeleton className="w-6 h-6 rounded-full" />
        ) : (
          <Image
            src={logo}
            alt="ICP Wallet"
            width={24}
            height={24}
            className="min-w-6 min-h-6"
          />
        )}
      </PopoverTrigger>
      <PopoverContent className="w-72 translate-y-4 flex flex-col gap-y-4 px-10" align="end">
        <div className="flex items-center justify-center text-black font-medium dark:text-white">
          <PopoverClose className="absolute top-4 right-4">
            <CloseIcon width={20} height={20} />
          </PopoverClose>
          {title}
        </div>
        <div className="flex items-center justify-center gap-x-2 text-sm text-black dark:text-white">
          <span>
            {getFormattedWalletAddress(address)}
          </span>
          <button onClick={() => copyToClipboard(address)}>
            <CopyIcon width={20} height={20} />
          </button>
        </div>
        <div className="flex flex-col gap-y-5 max-h-56 overflow-y-auto">
          <div className="flex items-center justify-between text-sm text-[#5A5555] dark:text-[#919191]">
            <span>
              Token
            </span>
            Value
          </div>
          {isLoading ? (
            <>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </>
          ) : balance && balance.tokens.length > 0 ? balance.tokens.map((token, idx) => (
            <div key={idx} className="flex items-center justify-between gap-x-4 text-sm text-dark dark:text-white">
              <div className="flex items-center gap-x-5">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={token.logo} alt={token.name} />
                  <AvatarFallback>{token.symbol}</AvatarFallback>
                </Avatar>
                <span>{token.symbol}</span>
              </div>
              <span>{getCountedNumber(Number(token.usdBalance), 2)}</span>
            </div>
          )) : (
            <div className="flex items-center justify-center text-sm font-semibold text-white">
              No tokens found
            </div>
          )}
        </div>
        <hr className="bg-[#494949]" />
        {isLoading ? (
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        ) : balance && (
          <div className="flex items-center justify-between text-sm font-semibold text-dark dark:text-white">
            <span>
              Total :
            </span>
            ${getCountedNumber(Number(balance.totalBalanceUsd), 2)}
          </div>
        )}
        <button
          onClick={disconnect}
          className="text-sm font-semibold text-fail px-4 py-2 rounded-[10px] duration-200 hover:bg-fail hover:text-white">
          Disconnect
        </button>
      </PopoverContent>
    </Popover>
  )
}