import { cn } from "@/lib/utils";
import { ExpandLeftIcon } from "@/components/icons";

interface BoxHeaderProps {
  title: string;
  onBack?: () => void;
  className?: string;
}

export default function BoxHeader({ title, onBack, className }: BoxHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center mb-8",
        "text-black dark:text-white",
        className
      )}
    >
      {onBack && (
        <button
          className={cn(
            "flex items-center justify-center gap-x-1",
            "absolute left-4 font-semibold md:left-8"
          )}
          onClick={onBack}
        >
          <ExpandLeftIcon width={18} height={18} />
          Back
        </button>
      )}
      <p className="text-[26px] md:text-3xl font-bold">{title}</p>
    </div>
  );
};
