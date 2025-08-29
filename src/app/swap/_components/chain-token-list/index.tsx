'use client';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import ChainBoxPage from './chain-box';
import TokenCard from './token-card';
import BoxHeader from '@/components/ui/box-header';
import TokenSkeleton from './token-skeleton';
import { TokenType, useSwapActions, useSwapStore } from '../../_store';
import { useChainListLogic } from './_logic';
import { useSharedStore } from '@/store/store';
import { useState } from 'react';

export default function TokenListPage() {
  // store
  const { icpTokens } = useSharedStore();
  const { selectedTokenType, tokenIn, tokenOut } = useSwapStore();
  // Logic
  const {
    selectToken,
    // filteredTokens,
    sortTokens,
    selectedChainId,
    setSelectedChainId,
    query,
    updatedIcpTokens,
    setQuery,
  } = useChainListLogic();
  const { setActiveStep } = useSwapActions();
  const [searchQuery, setSearchQuery] = useState('');

  const currentSelected = selectedTokenType === 'in' ? tokenIn : tokenOut;
  const otherSelected = selectedTokenType === 'in' ? tokenOut : tokenIn;

  const lowerQuery = query?.toLowerCase() || '';

  const matchesSearch = (token: TokenType) =>
    token.name.toLowerCase().includes(lowerQuery) ||
    token.symbol.toLowerCase().includes(lowerQuery) ||
    (token.canisterId
      ? token.canisterId.toLowerCase().includes(lowerQuery)
      : token.contractAddress
        ? token.contractAddress.toLowerCase().includes(lowerQuery)
        : null);

  const filteredTokens = updatedIcpTokens?.filter(
    (token) => token.canisterId !== otherSelected?.canisterId && matchesSearch(token),
  );

  const handleTokenClick = (token: TokenType) => {
    selectToken(token);
    setSearchQuery('');
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
              isSelected={token.canisterId === currentSelected?.canisterId}
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
