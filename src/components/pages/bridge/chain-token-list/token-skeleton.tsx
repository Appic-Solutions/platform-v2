import { Skeleton } from '@/components/ui/skeleton';

const TokenSkeleton = () => {
  return (
    <div className="flex items-center gap-x-5 cursor-pointer group duration-200 rounded-md p-2">
      {/* top section */}
      <Skeleton className="h-12 w-12 rounded-full" />

      {/* middle section */}
      <div className="flex flex-col gap-y-2 min-w-0">
        <Skeleton className="w-28 h-4" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
};

export default TokenSkeleton;
