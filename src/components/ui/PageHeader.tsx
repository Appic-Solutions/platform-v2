import { cn } from "@/lib/utils";
import { ExpandLeftIcon } from "@/components/icons";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  className?: string;
}

const PageHeader = ({ title, onBack, className }: PageHeaderProps) => {
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

export default PageHeader;
