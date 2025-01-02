import React, { useState } from 'react';
import { chains } from '@/blockchain_api/lists/chains';
import { Chain } from '@/blockchain_api/types/chains';
import { Avatar, AvatarImage } from '@/common/components/ui/avatar';
import { Skeleton } from '@/common/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/common/components/ui/tooltip';
import { cn } from '@/common/helpers/utils';

const ChainBoxPage = ({
  selectedChainId,
  onChainSelect,
}: {
  selectedChainId: Chain['chainId'];
  onChainSelect: (chainId: Chain['chainId']) => void;
}) => {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

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
                {!loadedImages[idx] && <Skeleton className="w-[54px] h-[54px] rounded-full" />}
                {chain.logo && (
                  <AvatarImage
                    src={chain.logo}
                    alt={chain.name}
                    className={cn(!loadedImages[idx] && 'hidden')}
                    onLoad={() => handleImageLoad(idx)}
                    onError={() => handleImageLoad(idx)}
                  />
                )}
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
