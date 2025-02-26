'use client';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import ChainBoxPage from './chain-box';
import TokenCard from './token-card';
import BoxHeader from '@/components/ui/box-header';
import TokenSkeleton from './token-skeleton';
import { useBridgeActions, useBridgeStore } from '../../_store';
import { ChainTokenListLogic } from './_logic';

interface TokenListProps {
  isPending: boolean;
  isError: boolean;
}

export default function TokenListPage({ isPending, isError }: TokenListProps) {
  // store
  const { bridgePairs: tokens, selectedTokenType } = useBridgeStore();
  // Logic
  const {
    isTokenSelected,
    selectToken,
    filteredTokens,
    sortTokens,
    selectedChainId,
    setSelectedChainId,
    query,
    setQuery,
  } = ChainTokenListLogic();
  const { setActiveStep } = useBridgeActions();

  return (
    <Box className={cn('justify-normal animate-slide-in opacity-0', 'md:max-w-[612px] md:h-[607px] md:px-9 md:py-8')}>
      <BoxHeader title={selectedTokenType === 'from' ? 'Bridge From' : 'Bridge To'} onBack={() => setActiveStep(1)} />
      <ChainBoxPage selectedChainId={selectedChainId} onChainSelect={setSelectedChainId} />
      <hr className="bg-white dark:bg-[#636363]/25 w-[calc(100%-52px)] max-md:hidden" />
      <input
        type="text"
        placeholder="Search token"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cn(
          'border-[#1C68F8] dark:border-[#000000] rounded-md py-2 px-3 md:mt-7 mb-6',
          'bg-white/50 dark:bg-white/30 text-black dark:text-white',
          'placeholder:text-black/50 dark:placeholder:text-white/50',
          'w-full',
        )}
      />
      <div className="w-full flex flex-col gap-y-5 overflow-y-scroll h-full">
        {isPending ? (
          <>
            <TokenSkeleton />
            <TokenSkeleton />
            <TokenSkeleton />
            <TokenSkeleton />
            <TokenSkeleton />
          </>
        ) : isError ? (
          <div>Error While loading. Please try again</div>
        ) : tokens && filteredTokens && filteredTokens.length > 0 ? (
          sortTokens(filteredTokens)?.map((token, idx) => (
            <TokenCard
              key={idx}
              token={token}
              onClick={() => {
                selectToken(token);
                setActiveStep(1);
              }}
              isSelected={isTokenSelected(token)}
            />
          ))
        ) : (
          <div className="w-full h-full flex justify-center items-center text-primary">No coins were found.</div>
        )}
      </div>
    </Box>
  );
}
