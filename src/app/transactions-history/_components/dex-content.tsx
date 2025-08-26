'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import useLogic from '../_logic';
import Spinner from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SwapCard from './swap-card';
import CreatedPoolCard from './created-pool-card';
import CollectFeesCard from './collect-fees.card';

type dexDataTypes =
  | 'All'
  | 'Swap'
  | 'CreatedPool'
  | 'BurntPosition'
  | 'IncreasedLiquidity'
  | 'CollectedFees'
  | 'DecreasedLiquidity'
  | 'MintedPosition';

const types: dexDataTypes[] = [
  'All',
  'Swap',
  'CreatedPool',
  'BurntPosition',
  'IncreasedLiquidity',
  'CollectedFees',
  'DecreasedLiquidity',
  'MintedPosition',
];

const CardComponents: Record<Exclude<dexDataTypes, 'All'>, React.FC<any>> = {
  Swap: SwapCard,
  CreatedPool: SwapCard,
  BurntPosition: CreatedPoolCard,
  IncreasedLiquidity: CreatedPoolCard,
  CollectedFees: CollectFeesCard,
  DecreasedLiquidity: CreatedPoolCard,
  MintedPosition: CreatedPoolCard,
};

export default function DexContent() {
  const [activeType, setActiveType] = useState<dexDataTypes>('All');
  const { dexData, isLoading, isError } = useLogic();

  const filteredData = dexData?.filter((item) =>
    activeType === 'All' ? true : item.type === activeType,
  );

  if (isError) {
    return (
      <div
        className={cn(
          'flex h-full items-center justify-center text-xl',
          'mx-auto max-w-[490px] px-6 text-center text-white',
        )}
      >
        Failed To Get Dex History
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="my-auto flex items-center justify-center md:absolute md:inset-0">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {/* Dropdown */}
      <Select value={activeType} onValueChange={(value: dexDataTypes) => setActiveType(value)}>
        <SelectTrigger className="absolute right-0 top-0 z-50 h-9 max-w-28 text-xs text-white md:right-8 md:top-8 md:max-w-[150px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {types.map((type) => (
            <SelectItem key={type} value={type} className="cursor-pointer">
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Cards */}
      {filteredData && filteredData.length > 0 ? (
        filteredData.map((item, idx) => {
          const Component = CardComponents[item.type as Exclude<dexDataTypes, 'All'>];
          return Component ? (
            <Component key={idx} {...item} />
          ) : (
            <div key={idx} className="text-white">
              Unknown Type: {item.type}
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center gap-y-10 text-center text-2xl text-white md:absolute md:inset-0">
          <Image src="/images/empty.png" alt="" width={100} height={100} />
          Empty Dex History
        </div>
      )}
    </div>
  );
}
