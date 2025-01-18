import Box from '@/common/components/ui/box';
import { cn } from '@/common/helpers/utils';
import BoxHeader from '@/common/components/ui/box-header';
import { TokenListProps } from '../_types';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/common/components/ui/tooltip';
import { Tooltip } from '@radix-ui/react-tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar';
import { Skeleton } from '@/common/components/ui/skeleton';
import { chains } from '@/blockchain_api/lists/chains';
import { useFormContext } from 'react-hook-form';

export default function TokenListPage({ prevStepHandler }: TokenListProps) {
  const { setValue, watch, clearErrors } = useFormContext()

  return (
    <Box className='justify-normal animate-slide-in opacity-0 md:max-w-[612px] md:h-[280px] md:px-9 md:pt-8'>
      <BoxHeader title="Select Chain" onBack={prevStepHandler} />
      <div className="grid grid-cols-5 gap-5 place-items-center w-full select-none md:px-4 mb-7">
        {chains.map((chain, idx) => (
          <TooltipProvider key={idx}>
            <Tooltip>
              <TooltipTrigger
                key={idx}
                type='button'
                className={cn(
                  'flex items-center justify-center rounded-full cursor-pointer w-12 h-12 md:w-14 md:h-14',
                  watch("chain_id") === String(chain.chainId) && 'ring-4 ring-primary-buttons',
                  chain.disabled && 'opacity-50 cursor-not-allowed select-none',
                )}
                onClick={() => {
                  if (!chain.disabled) {
                    setValue("chain_id", String(chain.chainId))
                    clearErrors("chain_id")
                    prevStepHandler()
                  }
                }}>
                <Avatar className="w-[54px] h-[54px]">
                  <AvatarImage src={chain.logo} alt={chain.name} />
                  <AvatarFallback>
                    <Skeleton />
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="bottom">{chain.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </Box >
  );
}
