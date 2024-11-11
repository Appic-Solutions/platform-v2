import { cn } from "@/lib/utils";

interface ActionButtonProps {
  children: React.ReactNode;
  isDisabled: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isMobile?: boolean;
}

const ActionButton = ({ isDisabled, onClick, isMobile }: ActionButtonProps) => {
  return (
    <button
      className={cn(
        "bg-primary-buttons w-full h-14 rounded-ml text-primary",
        isMobile ? "lg:hidden" : "max-lg:hidden",
        isDisabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={onClick}
      disabled={isDisabled}
    >
      Select Return
    </button>
  );
};

export default ActionButton;
