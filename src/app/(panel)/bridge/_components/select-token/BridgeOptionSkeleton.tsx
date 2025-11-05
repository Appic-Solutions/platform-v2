import { Card } from '@/components/ui/card';
import Skeleton from '@/components/ui/skeleton';

const BridgeOptionSkeleton = () => {
  return (
    <Card className="h-[165px] w-full flex-col items-start justify-center gap-4 px-6 py-2">
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
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex flex-col items-end gap-y-3">
          <Skeleton className="h-8 w-20 rounded-2xl" />
        </div>
      </div>

      {/* bottom section */}
      <div className="flex w-full items-end justify-end gap-x-4">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-8" />
      </div>
    </Card>
  );
};

export default BridgeOptionSkeleton;
