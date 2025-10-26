'use client';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, getChainLogo, getChainName, getChainSymbol } from '@/lib/utils';
import Spinner from '@/components/ui/spinner';
import SolidCard from '@/components/ui/cards/SolidCard';
import { Avatar } from '@/components/common/ui/avatar';
import { BlockchainIcon, CloseIcon } from '@/components/icons';
import useLogic from '../_logic';

type DexDataType =
  | 'All'
  | 'Swap'
  | 'CreatedPool'
  | 'BurntPosition'
  | 'IncreasedLiquidity'
  | 'CollectedFees'
  | 'DecreasedLiquidity'
  | 'MintedPosition';

const SELECT_OPTIONS: { label: string; value: DexDataType }[] = [
  { label: 'All', value: 'All' },
  { label: 'Swap', value: 'Swap' },
  { label: 'Collected Fees', value: 'CollectedFees' },
  { label: 'Created Pools', value: 'CreatedPool' },
  { label: 'Burnt Positions', value: 'BurntPosition' },
  { label: 'Increased Liquidity', value: 'IncreasedLiquidity' },
  { label: 'Decreased Liquidity', value: 'DecreasedLiquidity' },
  { label: 'Minted Positions', value: 'MintedPosition' },
];

// ---------- Helpers ----------
const isSwapType = (type: string) => ['Swap', 'CrosschainSwap', 'SameChainEvmSwap'].includes(type);

const formatNumber = (value?: string | number) => (value ? Number(value).toFixed(5) : '');

function getReadableAmountIn(item: any): string {
  switch (item.type) {
    case 'Swap':
      return formatNumber(item.human_readable_final_amount_in);
    case 'CrosschainSwap':
    case 'SameChainEvmSwap':
      return formatNumber(item.human_readable_amount_in);
    default:
      return (
        formatNumber(item.human_readable_amount0_paid) ||
        formatNumber(item.human_readable_amount0_received) ||
        formatNumber(item.human_readable_amount0_collected)
      );
  }
}

function getReadableAmountOut(item: any): string {
  switch (item.type) {
    case 'Swap':
      return formatNumber(item.human_readable_final_amount_out);
    case 'CrosschainSwap':
      return formatNumber(item.human_readable_real_amount_out);
    case 'SameChainEvmSwap':
      return formatNumber(item.human_readable_amount_out);
    default:
      return (
        formatNumber(item.human_readable_amount1_paid) ||
        formatNumber(item.human_readable_amount1_received) ||
        formatNumber(item.human_readable_amount1_collected)
      );
  }
}

// ---------- Main Component ----------
export default function DexContent() {
  const [activeType, setActiveType] = useState<DexDataType>('All');
  const { dexData, isLoading, isError } = useLogic();

  const filteredData = useMemo(() => {
    if (!dexData) return [];
    if (activeType === 'All') return dexData;

    return dexData.filter((item) =>
      activeType === 'Swap' ? isSwapType(item.type) : item.type === activeType,
    );
  }, [dexData, activeType]);

  // ---------- Error / Loading States ----------
  if (isError)
    return (
      <div className="mx-auto flex h-full max-w-[490px] items-center justify-center px-6 text-center text-xl text-white">
        Failed To Get Dex History
      </div>
    );

  if (isLoading)
    return (
      <div className="my-auto flex items-center justify-center md:absolute md:inset-0">
        <Spinner />
      </div>
    );

  // ---------- UI ----------
  return (
    <>
      {/* Type Filter */}
      <Select value={activeType} onValueChange={(v: DexDataType) => setActiveType(v)}>
        <SelectTrigger className="absolute right-0 top-0 z-50 h-9 max-w-28 border-2 border-box-border text-xs text-white md:right-8 md:top-8 md:max-w-[150px]">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent className="border-2 border-box-border bg-input-fields bg-cover bg-center bg-no-repeat text-xs text-white shadow-md backdrop-blur-[30px]">
          {SELECT_OPTIONS.map(({ label, value }) => (
            <SelectItem key={value} value={value} className="cursor-pointer">
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* ---------- Empty ---------- */}
      {!filteredData.length ? (
        <div className="flex flex-col items-center justify-center gap-y-10 text-center text-2xl text-white md:absolute md:inset-0">
          <Image src="/images/empty.png" alt="Empty" width={100} height={100} />
          Empty Dex History
        </div>
      ) : (
        // History List
        filteredData.map((item, idx) => {
          const { date, time, status, type } = item;
          const isSwapped = isSwapType(type);

          return (
            <div
              key={idx}
              className={cn(
                'flex w-full flex-col gap-y-4 overflow-hidden rounded-2xl bg-input-fields bg-cover bg-center p-5 shadow-md backdrop-blur-[30px] duration-200 hover:bg-black/75 md:rounded-[36px] md:p-6',
              )}
            >
              {/* Date & Time */}
              <div className="flex items-center justify-between gap-x-4 text-sm font-bold max-md:text-[#898989] md:text-[#333333] md:dark:text-[#898989]">
                <p>{date}</p>
                <p>{time}</p>
              </div>

              {/* Content */}
              {isSwapped ? <SwapItem item={item} status={status} /> : <PoolItem item={item} />}

              {/* Footer */}
              {type !== 'CreatedPool' && (
                <Footer item={item} isSwapped={isSwapped} status={status} />
              )}
            </div>
          );
        })
      )}
    </>
  );
}

// ---------- Subcomponents ----------
function SwapItem({ item, status }: { item: any; status: string }) {
  return (
    <div className="flex w-full items-center justify-between *:relative">
      <TokenAvatar token={item.token_in} />
      <SwapArrow status={status} />
      <TokenAvatar token={item.token_out} />
    </div>
  );
}

function PoolItem({ item }: { item: any }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-2.5">
        <div className="flex items-center">
          <Avatar src={item.token0.logo} className="h-12 w-12" />
          <Avatar src={item.token1.logo} className="-ml-4 h-12 w-12" />
        </div>
        <p className="text-lg font-medium text-white md:text-xl">
          {item.token0.symbol}/{item.token1.symbol}
        </p>
      </div>

      {'pool_fee' in item && item.pool_fee ? (
        <FeeCard fee={item.pool_fee} />
      ) : 'position' in item && item.position ? (
        <FeeCard fee={item.position.poolId.fee} />
      ) : null}
    </div>
  );
}

function Footer({ item, isSwapped, status }: { item: any; isSwapped: boolean; status: string }) {
  const { type } = item;
  return (
    <div className="flex items-center justify-between gap-x-4 text-xs font-bold *:flex *:flex-1 *:flex-col *:justify-center max-md:text-[#898989] md:text-[#333333] md:dark:text-[#898989]">
      <div>
        <p>
          {isSwapped
            ? `${item.token_in.symbol} on ${getChainName(item.token_in.chainId)}`
            : `${item.token0.symbol} Amount`}
        </p>
        <p className="text-xl leading-7 max-md:text-white">{getReadableAmountIn(item)}</p>
      </div>

      <div className="items-center text-center max-md:hidden">
        {status === 'Successful'
          ? `Successful ${type}`
          : status === 'Pending'
            ? `Pending Swap`
            : `Refunded with ${Number(item.human_readable_refund_amount).toFixed(4)} USDC on ${getChainSymbol(item.refund_chain)}`}
      </div>

      <div className="items-end">
        <p>
          {isSwapped
            ? `${item.token_out.symbol} on ${getChainName(item.token_out.chainId)}`
            : `${item.token1.symbol} Amount`}
        </p>
        <p className="text-xl leading-7 max-md:text-white">{getReadableAmountOut(item)}</p>
      </div>
    </div>
  );
}

function TokenAvatar({ token }: { token: any }) {
  return (
    <div>
      <Avatar src={token.logo} className="h-12 w-12" />
      <Avatar
        src={getChainLogo(token.chainId)}
        className="absolute -bottom-1 -right-1 h-5 w-5 shadow"
      />
    </div>
  );
}

function SwapArrow({ status }: { status: string }) {
  return (
    <div className="flex w-full items-center justify-center">
      <div
        className={cn(
          'flex-1 border-t-[3px]',
          status === 'Refunded' ? 'border-red-500' : 'border-green-500',
        )}
      />
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center',
          'relative z-10 rounded-full p-2.5',
          status === 'Refunded'
            ? 'border-2 border-red-500'
            : status === 'Pending'
              ? 'animate-spin border-2 border-green-500 border-t-transparent'
              : 'before:absolute before:inset-0 before:rounded-full before:border-2 before:border-green-500',
        )}
      >
        <BlockchainIcon className="h-5 w-5 text-white md:h-6 md:w-6" />
      </div>
      <div
        className={cn(
          'flex-1 border-t-[3px]',
          status === 'Refunded'
            ? 'border-red-500'
            : status === 'Pending'
              ? 'border-dashed border-black'
              : 'border-green-500',
        )}
      />
    </div>
  );
}

function FeeCard({ fee }: { fee: string | number }) {
  return (
    <SolidCard size="sm" className="w-max bg-[#FFFFFF1A]">
      <span className="text-xs leading-5 text-white/60">{Number(fee) / 10000}%</span>
    </SolidCard>
  );
}
