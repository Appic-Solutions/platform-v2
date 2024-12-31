import React from 'react';
import { Skeleton } from '../../ui/skeleton';
import { cn } from '@/common/helpers/utils';

const WalletPopSkeleton = () => {
  return (
    <>
      {/* DESKTOP SKELETON */}
      <div
        className={cn(
          'absolute top-14 w-80 right-3 z-[99] !rounded-[25px] animate-fade',
          'flex flex-col gap-y-6 py-6 px-8 backdrop-blur-md items-center',
          'border-[5px] border-box-border *:z-10',
          'bg-box-background bg-center bg-cover bg-no-repeat',
          'h-fit max-h-[80vh] overflow-y-auto after:hidden',
          'hidden md:flex',
        )}
      >
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
        <Skeleton className="h-4 w-20" />
      </div>

      {/* MOBILE SKELETON */}
      <div className="fixed inset-0 z-[99] backdrop-blur-sm block md:hidden">
        <div
          className={cn(
            'fixed inset-x-0 bottom-0 z-[100] rounded-t-[22px] mt-24 py-6 px-4 *:z-10 h-fit max-h-[80vh] overflow-y-auto after:hidden',
            'flex items-center flex-col gap-y-6',
            'backdrop-blur-md border-[5px] border-box-border',
            'bg-box-background bg-center bg-cover bg-no-repeat',
          )}
        >
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
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </>
  );
};

export default WalletPopSkeleton;
