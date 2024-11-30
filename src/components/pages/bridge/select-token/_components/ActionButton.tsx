import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ActionButtonProps {
  children: React.ReactNode;
  isDisabled: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ isDisabled, onClick, children }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "bg-primary-buttons w-full h-14 rounded-[16px] text-white",
          isDisabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={onClick}
        disabled={isDisabled}
      >
        {children || "Confirm"}
      </button>
    );
  }
);

ActionButton.displayName = "ActionButton";

export default ActionButton;
