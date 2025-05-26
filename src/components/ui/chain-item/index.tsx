import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ChainItemProps } from './types';
import { Avatar } from '@/components/common/avatar';

export default function ChainItem({ chain, selectedId, disabled, onClick }: ChainItemProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className={cn(
            'flex h-12 w-12 cursor-pointer select-none items-center justify-center rounded-full md:h-14 md:w-14',
            selectedId === chain.chainId && 'ring-primary-buttons ring-4',
            disabled && 'cursor-not-allowed opacity-50',
          )}
          onClick={() => {
            if (disabled) return;
            onClick(chain);
          }}
        >
          <Avatar src={chain.logo} className="h-[54px] w-[54px]" />
        </TooltipTrigger>
        <TooltipContent side="bottom">{chain.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
