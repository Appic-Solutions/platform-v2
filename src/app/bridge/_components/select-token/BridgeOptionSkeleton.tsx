import { Card } from '@/components/ui/card';
import Skeleton from '@/components/ui/skeleton';

const BridgeOptionSkeleton = () => {
  return (
    <Card className="py-2 px-6 w-full flex-col gap-4 items-start justify-center h-[165px]">
      {/* top section */}
      <div className="flex items-center justify-between w-full">
        <div className="flex-1">
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-8 w-8 rounded-[10px]" />
      </div>

      {/* middle section */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-x-3">
          <Skeleton className="w-16 h-16 rounded-full" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex flex-col gap-y-3 items-end">
          <Skeleton className="h-8 w-20 rounded-2xl" />
        </div>
      </div>

      {/* bottom section */}
      <div className="flex items-end w-full justify-end gap-x-4">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-8" />
      </div>
    </Card>
  );
};

export default BridgeOptionSkeleton;
