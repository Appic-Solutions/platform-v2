import React from 'react';
import { Skeleton } from '../../ui/skeleton';

const WalletPopSkeletonMobile = () => {
  return (
    <div className="flex flex-col items-center gap-y-6">
      <Skeleton className="w-20 h-4" />

      <Skeleton className="w-20 h-20 rounded-full" />
      <Skeleton className="w-16 h-4" />

      <div className="flex w-full flex-col gap-y-5">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-8" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-8" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
      <hr className="bg-[#494949] w-full" />
      <div className="flex w-full items-center justify-between">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-14" />
      </div>
      <p className="text-center text-primary text-sm">Connecting Your Wallet...</p>
    </div>
  );
};

export default WalletPopSkeletonMobile;
