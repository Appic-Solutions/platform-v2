import { Card } from '@/components/ui/card';
import Skeleton from '@/components/ui/skeleton';

const SwapQuoteSkeleton = () => {
  return (
    <Card className="w-full flex-col items-start gap-4 !py-4 md:px-6">
      {/* top section */}
      <div className="flex w-full items-center justify-between">
        <div className="flex-1">
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-8 w-8 rounded-[10px]" />
      </div>

      {/* middle section */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-x-3">
          <Skeleton className="h-7 w-7 rounded-full lg:h-10 lg:w-10" />
          <div className="flex flex-col gap-y-2">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-y-3">
          <Skeleton className="h-8 w-20 rounded-2xl" />
        </div>
      </div>

      {/* bottom section */}
      <div className="flex w-full items-end justify-end gap-x-4 border-b border-gray-700 pb-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>

      {/* details section */}
      <div className="mt-4 w-full space-y-3 pt-3">
        <Skeleton className="h-5 w-28" />
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex justify-between text-sm">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex justify-between text-sm">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex justify-between text-sm">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SwapQuoteSkeleton;
