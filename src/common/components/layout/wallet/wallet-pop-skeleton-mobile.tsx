import React from 'react';
import { Drawer, DrawerContent, DrawerHeader } from '../../ui/drawer';
import { Skeleton } from '../../ui/skeleton';

const WalletPopSkeletonMobile = () => {
  return (
    <div className="flex md:hidden items-center justify-center">
      <Drawer>
        <DrawerContent className="md:hidden">
          <DrawerHeader>
            <Skeleton className="w-16 h-4" />
          </DrawerHeader>
          <div>
            <Skeleton className="w-24 h-24" />
          </div>
          <div className="flex items-center justify-center gap-x-2 text-sm text-black dark:text-white">
            <Skeleton className="w-16 h-4" />
          </div>

          <div className="flex items-center justify-between text-sm text-[#5A5555] dark:text-[#919191]">
            <Skeleton className="w-8 h-2" />
            <Skeleton className="w-8 h-2" />
          </div>

          <div className="flex flex-col gap-y-5">
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
          </div>
          <hr className="bg-[#494949]" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-20" />
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default WalletPopSkeletonMobile;
