import Skeleton from '@/components/ui/skeleton';
import React from 'react';

export default function WalletPopSkeletonMobile() {
  return (
    <div className="flex flex-col items-center gap-y-6">
      <Skeleton className="h-4 w-20" />

      <Skeleton className="h-20 w-20 rounded-full" />
      <Skeleton className="h-4 w-16" />

      <div className="flex w-full flex-col gap-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-8" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-8" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
      <hr className="w-full bg-[#494949]" />
      <div className="flex w-full items-center justify-between">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-14" />
      </div>
      <p className="text-center text-sm text-primary">Connecting Your Wallet...</p>
    </div>
  );
}
