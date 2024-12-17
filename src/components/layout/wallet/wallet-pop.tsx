/* eslint-disable @next/next/no-img-element */
import { EvmToken, IcpToken } from "@/blockchain_api/types/tokens";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "@/components/ui/popover";
import Image from "next/image";
import { CloseIcon, CopyIcon } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { copyToClipboard, getChainLogo, getChainName, getCountedNumber, getFormattedWalletAddress } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer";

type WalletBalance =
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
  balance: WalletBalance;
  disconnect: () => void;
  isLoading: boolean;
  address: string;
}

export function WalletPop({ logo, title, balance, disconnect, isLoading, address }: WalletCardProps) {
  const chartData =
    balance?.tokens.map((token) => ({
      name: token.symbol,
      value: Number(token.usdBalance),
      fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
    })) || [];

  const chartConfig =
    (balance?.tokens.reduce(
      (acc, token) => ({
        ...acc,
        [token.symbol || ""]: {
          label: token.name,
          color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        },
      }),
      {
        value: {
          label: "Value",
        },
      }
    ) as ChartConfig) || {};

  return (
    <>
      <div className="md:hidden flex items-center justify-center">
        <Drawer>
          <DrawerTrigger>{isLoading ? <Skeleton className="w-6 h-6 rounded-full" /> : <Image src={logo} alt="ICP Wallet" width={24} height={24} className="min-w-6 min-h-6" />}</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>{title}</DrawerHeader>

            {balance && balance.tokens.length > 0 ? (
              <div>
                <ChartContainer config={chartConfig} className="relative mx-auto aspect-square max-h-56">
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel className="bg-white" />} />
                    <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} />
                  </PieChart>
                </ChartContainer>
              </div>
            ) : null}

            <div className="flex items-center justify-center gap-x-2 text-sm text-black dark:text-white">
              <span>{getFormattedWalletAddress(address)}</span>
              <button onClick={() => copyToClipboard(address)}>
                <CopyIcon width={20} height={20} />
              </button>
            </div>
            {balance && balance.tokens.length > 0 ? (
              <div className="flex items-center justify-between text-sm text-[#5A5555] dark:text-[#919191]">
                <span>Token</span>
                Value
              </div>
            ) : null}
            <div className="flex flex-col gap-y-5">
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
              ) : balance && balance.tokens.length > 0 ? (
                balance.tokens.map((token, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-x-4 text-sm text-dark dark:text-white">
                    <div className="relative flex items-center gap-x-5">
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={token.logo} alt={token.name} />
                        <AvatarFallback>{token.symbol}</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-4 h-4 absolute top-5 left-7">
                        <AvatarImage src={getChainLogo(token.chainId)} alt={token.name} />
                        <AvatarFallback>{getChainName(token.chainId)}</AvatarFallback>
                      </Avatar>
                      <span>{`${token.symbol} (${getChainName(token.chainId)})`}</span>
                    </div>
                    <span>{getCountedNumber(Number(token.usdBalance), 2)}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center text-sm font-semibold text-white">No tokens found</div>
              )}
            </div>
            {balance && balance.tokens.length > 0 ? <hr className="bg-[#494949]" /> : null}
            {isLoading ? (
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            ) : balance && balance.tokens.length > 0 ? (
              <div className="flex items-center justify-between text-sm font-semibold text-dark dark:text-white">
                <span>Total :</span>${getCountedNumber(Number(balance.totalBalanceUsd), 2)}
              </div>
            ) : null}
            <button onClick={disconnect} className="text-sm font-semibold text-fail px-4 py-2 rounded-[10px] duration-200 hover:bg-fail hover:text-white">
              Disconnect
            </button>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="hidden md:flex items-center justify-center">
        <Popover>
          <PopoverTrigger>{isLoading ? <Skeleton className="w-6 h-6 rounded-full" /> : <Image src={logo} alt="ICP Wallet" width={24} height={24} className="min-w-6 min-h-6" />}</PopoverTrigger>
          <PopoverContent className="w-[360px] translate-y-4 flex flex-col gap-y-4 px-10" align="end">
            <div className="flex items-center justify-center text-black font-medium dark:text-white">
              <PopoverClose className="absolute top-4 right-4">
                <CloseIcon width={20} height={20} />
              </PopoverClose>
              {title}
            </div>

            {balance && balance.tokens.length > 0 ? (
              <div>
                <ChartContainer config={chartConfig} className="relative mx-auto aspect-square max-h-56">
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel className="bg-white" />} />
                    <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} />
                  </PieChart>
                </ChartContainer>
              </div>
            ) : null}

            <div className="flex items-center justify-center gap-x-2 text-sm text-black dark:text-white">
              <span>{getFormattedWalletAddress(address)}</span>
              <button onClick={() => copyToClipboard(address)}>
                <CopyIcon width={20} height={20} />
              </button>
            </div>
            {balance && balance.tokens.length > 0 ? (
              <div className="flex items-center justify-between text-sm text-[#5A5555] dark:text-[#919191]">
                <span>Token</span>
                Value
              </div>
            ) : null}
            <div className="flex flex-col gap-y-5 max-h-56 overflow-y-auto">
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
              ) : balance && balance.tokens.length > 0 ? (
                balance.tokens.map((token, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-x-4 text-sm text-dark dark:text-white">
                    <div className="relative flex items-center gap-x-5">
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={token.logo} alt={token.name} />
                        <AvatarFallback>{token.symbol}</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-4 h-4 absolute top-5 left-7">
                        <AvatarImage src={getChainLogo(token.chainId)} alt={token.name} />
                        <AvatarFallback>{getChainName(token.chainId)}</AvatarFallback>
                      </Avatar>
                      <span>{`${token.symbol} (${getChainName(token.chainId)})`}</span>
                    </div>
                    <span>{getCountedNumber(Number(token.usdBalance), 2)}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center text-sm font-semibold text-white">No tokens found</div>
              )}
            </div>
            {balance && balance.tokens.length > 0 ? <hr className="bg-[#494949]" /> : null}
            {isLoading ? (
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            ) : balance && balance.tokens.length > 0 ? (
              <div className="flex items-center justify-between text-sm font-semibold text-dark dark:text-white">
                <span>Total :</span>${getCountedNumber(Number(balance.totalBalanceUsd), 2)}
              </div>
            ) : null}
            <button onClick={disconnect} className="text-sm font-semibold text-fail px-4 py-2 rounded-[10px] duration-200 hover:bg-fail hover:text-white">
              Disconnect
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
