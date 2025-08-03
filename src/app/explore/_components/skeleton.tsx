import Skeleton from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function SkeletonSection() {
  return (
    <>
      {/* Chart Section Skeleton */}
      <div className="flex w-full flex-col gap-y-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-x-3 text-[27px] font-bold text-white md:text-[40px]">
            <div className="flex">
              <Skeleton className="h-8 w-8 rounded-full md:h-12 md:w-12" />
              <Skeleton className="-ml-3 h-8 w-8 rounded-full md:-ml-4 md:h-12 md:w-12" />
            </div>
            <Skeleton className="h-6 w-24 md:h-8 md:w-32" />
          </div>
          <Skeleton className="h-5 w-10 rounded-[6px] bg-white/10" />
        </div>

        {/* Chart Placeholder */}
        <div className="h-[300px] w-full rounded-xl bg-[#1f1f1f]">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      </div>

      {/* Stats Section Skeleton */}
      <div className="flex w-full flex-col gap-y-10 md:max-w-[440px] md:gap-y-6">
        <div className="flex flex-col gap-y-2 md:gap-y-2.5">
          <Skeleton className="h-6 w-24" />
          <div
            className={cn(
              'flex flex-col gap-y-4',
              'rounded-2xl md:rounded-[21px]',
              'bg-[#222222] p-6 md:p-8',
              '*:flex *:flex-col *:gap-y-1',
            )}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-40 md:w-60" />
              </div>
            ))}
          </div>
        </div>

        {/* Links Section Skeleton */}
        <div className="flex flex-col gap-y-2 md:gap-y-2.5">
          <Skeleton className="h-6 w-24" />

          <div
            className={cn(
              'flex flex-col gap-y-3 md:gap-y-4',
              'rounded-2xl md:rounded-[21px]',
              'bg-[#222222] p-6 md:p-8',
              '*:flex *:items-center *:justify-between *:gap-3',
            )}
          >
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-y-2">
                <div className="flex items-center gap-x-1.5">
                  <Skeleton className="h-4 w-5 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div
          className={cn(
            'flex items-center justify-center gap-3 md:gap-4',
            '*:flex *:flex-1 *:items-center *:justify-center *:gap-1',
            '*:rounded-[10px] *:bg-primary-buttons *:p-2.5 *:text-white',
          )}
        >
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </>
  );
}
