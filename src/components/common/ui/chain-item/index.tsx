import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChainItemProps } from "./types";
import { Avatar } from "../avatar";

export default function ChainItem({ chain, selectedId, disabled, onClick }: ChainItemProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger
                    className={cn(
                        'flex items-center justify-center rounded-full cursor-pointer select-none w-12 h-12 md:w-14 md:h-14',
                        selectedId === chain.chainId && 'ring-4 ring-primary-buttons',
                        disabled && 'opacity-50 cursor-not-allowed',
                    )}
                    onClick={() => {
                        if (disabled) return
                        onClick(chain)
                    }}>
                    <Avatar
                        src={chain.logo}
                        className='w-[54px] h-[54px]'
                    />
                </TooltipTrigger>
                <TooltipContent side="bottom">{chain.name}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}