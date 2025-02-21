import Skeleton from '@/components/common/ui/skeleton';
import React from 'react';

const WalletPopSkeletonDesktop = () => {
  return (
    <div className="flex flex-col items-center gap-y-6">
      <Skeleton className="w-20 h-4" />

      <Skeleton className="w-32 h-32 rounded-full" />
      <Skeleton className="w-16 h-4" />

      <div className="flex w-full items-center justify-between text-sm text-[#5A5555] dark:text-[#919191]">
        <Skeleton className="w-8 h-3" />
        <Skeleton className="w-8 h-3" />
      </div>

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
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-8 w-full" />
    </div>
  );
};

export default WalletPopSkeletonDesktop;
