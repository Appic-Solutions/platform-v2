import { cn } from "@/common/helpers/utils";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[10px] bg-muted",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
