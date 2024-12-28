import { chains } from '@/blockchain_api/lists/chains';
import { Chain } from '@/blockchain_api/types/chains';
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/common/components/ui/tooltip';
import { cn } from '@/common/helpers/utils';

const ChainBoxPage = ({
  selectedChainId,
  onChainSelect,
}: {
  selectedChainId: Chain['chainId'];
  onChainSelect: (chainId: Chain['chainId']) => void;
}) => {
  return (
    <div className="grid grid-cols-5 gap-5 place-items-center w-full select-none md:px-4 mb-7">
      {chains.map((chain, idx) => (
        <TooltipProvider key={idx}>
          <Tooltip>
            <TooltipTrigger
              key={idx}
              className={cn(
                'flex items-center justify-center rounded-full cursor-pointer w-12 h-12 md:w-14 md:h-14',
                selectedChainId === chain.chainId && 'ring-4 ring-primary-buttons',
                chain.disabled && 'opacity-50 cursor-not-allowed select-none',
              )}
              onClick={() => {
                if (!chain.disabled) {
                  onChainSelect(chain.chainId);
                }
              }}
            >
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
  );
};

export default ChainBoxPage;
