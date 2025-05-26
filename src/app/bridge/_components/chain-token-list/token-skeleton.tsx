import Skeleton from '@/components/ui/skeleton';

const TokenSkeleton = () => {
  return (
    <div className="group flex cursor-pointer items-center gap-x-5 rounded-md p-2 duration-200">
      {/* top section */}
      <Skeleton className="h-12 w-12 rounded-full" />

      {/* middle section */}
      <div className="flex min-w-0 flex-col gap-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
};

export default TokenSkeleton;
