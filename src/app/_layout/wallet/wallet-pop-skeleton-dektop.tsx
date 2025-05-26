import Skeleton from '@/components/ui/skeleton';
import React from 'react';

const WalletPopSkeletonDesktop = () => {
  return (
    <div className="flex flex-col items-center gap-y-6">
      <Skeleton className="h-4 w-20" />

      <Skeleton className="h-32 w-32 rounded-full" />
      <Skeleton className="h-4 w-16" />

      <div className="flex w-full items-center justify-between text-sm text-[#5A5555] dark:text-[#919191]">
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-8" />
      </div>

      <div className="flex w-full flex-col gap-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-8" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-8" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
      <hr className="w-full bg-[#494949]" />
      <div className="flex w-full items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-8 w-full" />
    </div>
  );
};

export default WalletPopSkeletonDesktop;
