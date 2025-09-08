'use client';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import ChainBoxPage from './chain-box';
import TokenCard from './token-card';
import BoxHeader from '@/components/ui/box-header';
import { TokenType, useSwapActions, useSwapStore } from '../../_store';
import { useChainListLogic } from './_logic';
import { useSharedStore } from '@/store/store';

export default function TokenListPage() {
  const { icpTokens } = useSharedStore();
  const { selectedTokenType } = useSwapStore();
  const { setActiveStep } = useSwapActions();
  const {
    selectToken,
    sortTokens,
    selectedChainId,
    setSelectedChainId,
    query,
    filteredTokens,
    isTokenSelected,
    setQuery,
  } = useChainListLogic();

  const handleTokenClick = (token: TokenType) => {
    selectToken(token);
    setActiveStep(1);
  };

  return (
    <Box className="animate-slide-in justify-normal gap-y-6 opacity-0 md:h-[607px] md:max-w-[537px]">
      <BoxHeader
        title={selectedTokenType === 'in' ? 'Sell' : 'Buy'}
        onBack={() => setActiveStep(1)}
      />
      <ChainBoxPage selectedChainId={selectedChainId} onChainSelect={setSelectedChainId} />
      <hr className="w-full bg-white dark:bg-[#636363]/25 max-md:hidden" />
      <input
        type="text"
        placeholder="Search token"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cn(
          'rounded-md border-[#1C68F8] px-3 py-2 dark:border-[#000000]',
          'bg-white/50 text-black dark:bg-white/30 dark:text-white',
          'placeholder:text-black/50 dark:placeholder:text-white/50',
          'w-full',
        )}
      />
      <div className="flex h-full w-full flex-col gap-y-6 overflow-y-scroll">
        {icpTokens && filteredTokens && filteredTokens.length > 0 ? (
          sortTokens(filteredTokens)?.map((token, idx) => (
            <TokenCard
              key={idx}
              token={token}
              onClick={() => handleTokenClick(token)}
              isSelected={isTokenSelected(token)}
            />
          ))
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary">
            No coins were found.
          </div>
        )}
      </div>
    </Box>
  );
}
