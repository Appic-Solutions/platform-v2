'use client';
import { chains } from '@/blockchain_api/lists/chains';
import { Chain } from '@/blockchain_api/types/chains';
import Box from '@/common/components/ui/box';
import { cn } from '@/common/helpers/utils';
import { useMemo, useState, useEffect } from 'react';
import ChainBoxPage from './chain-box';
import TokenCard from './token-card';
import BoxHeader from '@/common/components/ui/box-header';
import { get_bridge_pairs_for_token } from '@/blockchain_api/functions/icp/get_bridge_token_pairs';
import TokenSkeleton from './token-skeleton';
import { useBridgeActions, useBridgeStore } from '../../_store';
import { useIsTokenSelected, useTokenSelector } from '../../_logic/hooks';

interface TokenListProps {
  isPending: boolean;
  isError: boolean;
}

export default function TokenListPage({ isPending, isError }: TokenListProps) {
  const [query, setQuery] = useState('');
  const [selectedChainId, setSelectedChainId] = useState<Chain['chainId']>(0);
  // store
  const { fromToken, toToken, bridgePairs: tokens, selectedTokenType } = useBridgeStore((state) => state);
  const { setActiveStep } = useBridgeActions();
  const setTokenHandler = useTokenSelector();
  // check if token is selected
  const isTokenSelected = useIsTokenSelected();
  // set selected chain id
  useEffect(() => {
    const tokenToCheck = selectedTokenType === 'from' ? fromToken : toToken;
    if (tokenToCheck) {
      setSelectedChainId(tokenToCheck.chainId);
    } else {
      setSelectedChainId(chains[0].chainId);
    }
  }, [selectedTokenType, fromToken, toToken]);

  // filter tokens
  const filteredTokens = useMemo(() => {
    const searchQuery = query.toLowerCase();
    if (!fromToken && toToken && tokens && selectedTokenType === 'from') {
      return get_bridge_pairs_for_token(
        tokens,
        toToken.canisterId || toToken.contractAddress || '',
        selectedChainId || 0,
      );
    }
    if (fromToken && !toToken && tokens && selectedTokenType === 'to') {
      return get_bridge_pairs_for_token(
        tokens,
        fromToken.canisterId || fromToken.contractAddress || '',
        selectedChainId || 0,
      );
    } else {
      return tokens
        ?.filter((token) => token.chainId === selectedChainId)
        .filter(
          (token) =>
            token.name.toLowerCase().includes(searchQuery) ||
            token.symbol.toLowerCase().includes(searchQuery) ||
            token.contractAddress?.toLowerCase().includes(searchQuery) ||
            token.canisterId?.toLowerCase().includes(searchQuery),
        );
    }
  }, [query, selectedChainId, tokens, fromToken, selectedTokenType, toToken]);

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
          filteredTokens?.map((token, idx) => (
            <TokenCard
              key={idx}
              token={token}
              onClick={() => {
                setTokenHandler(token);
                setActiveStep(1);
              }}
              isSelected={isTokenSelected(token)}
            />
          ))
        ) : (
          <div className="w-full h-full flex justify-center items-center text-primary">There is no any coin.</div>
        )}
      </div>
    </Box>
  );
}
