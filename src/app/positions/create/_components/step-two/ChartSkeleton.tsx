import Skeleton from '@/components/common/ui/skeleton';
import React from 'react';

const ChartSkeleton = () => {
  return (
    <div className="flex h-[250px] w-full items-end justify-center gap-4 px-4 opacity-50">
      <Skeleton className="h-20 w-1 rounded-t-md" />
      <Skeleton className="h-40 w-1 rounded-t-md" />
      <Skeleton className="h-60 w-1 rounded-t-md" />
      <Skeleton className="h-16 w-1 rounded-t-md" />
      <Skeleton className="h-72 w-1 rounded-t-md" />
      <Skeleton className="h-36 w-1 rounded-t-md" />
      <Skeleton className="h-44 w-1 rounded-t-md" />
      <Skeleton className="h-12 w-1 rounded-t-md" />
      <Skeleton className="h-20 w-1 rounded-t-md" />
      <Skeleton className="h-40 w-1 rounded-t-md" />
      <Skeleton className="h-60 w-1 rounded-t-md" />
      <Skeleton className="h-16 w-1 rounded-t-md" />
      <Skeleton className="h-72 w-1 rounded-t-md" />
      <Skeleton className="h-36 w-1 rounded-t-md" />
      <Skeleton className="h-44 w-1 rounded-t-md" />
      <Skeleton className="h-12 w-1 rounded-t-md" />
    </div>
  );
};

export default ChartSkeleton;
