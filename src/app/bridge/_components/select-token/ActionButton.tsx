import { cn } from '@/lib/utils';
import Spinner from '@/components/ui/spinner';
import { forwardRef } from 'react';

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
          'h-14 w-full rounded-[16px] text-white',
          'bg-primary-buttons',
          'transition-all ease-in-out',
          isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:opacity-85',
        )}
        onClick={onClick}
        disabled={isDisabled}
      >
        {children || <Spinner className="text-white dark:text-white" />}
      </button>
    );
  },
);

ActionButton.displayName = 'ActionButton';

export default ActionButton;
