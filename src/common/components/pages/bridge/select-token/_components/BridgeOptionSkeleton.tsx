import { Skeleton } from "@/common/components/ui/skeleton";
import { Card } from "@/common/components/ui/card";

const BridgeOptionSkeleton = () => {
  return (
    <Card className="py-2 px-6 flex-col gap-3 items-start justify-center h-[165px] min-w-[300px]">
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
