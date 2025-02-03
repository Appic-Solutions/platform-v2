'use client';
import { tokens } from '@/blockchain_api/lists/sampleToken';
import { IcpToken } from '@/blockchain_api/types/tokens';
import Box from '@/common/components/ui/box';
import { cn } from '@/common/helpers/utils';
import { useEffect, useMemo, useState } from 'react';
import TokenCard from './token-card';
import BoxHeader from '@/common/components/ui/box-header';

interface TokenListProps {
  prevStepHandler: () => void;
  setTokenHandler: (token: IcpToken) => void;
  selectedType: 'buy' | 'sell';
  fromToken: IcpToken | null;
  toToken: IcpToken | null;
}

export default function TokenListPage({
  prevStepHandler,
  setTokenHandler,
  selectedType,
  fromToken,
  toToken,
}: TokenListProps) {
  const [query, setQuery] = useState('');
  const [icpTokens, setIcpTokens] = useState<IcpToken[]>([]);

  const getIcpTokens = () => {
    const icpTokens = tokens.filter((token) => token.chain_type === 'ICP') as IcpToken[];
    setIcpTokens(icpTokens);
  };

  useEffect(() => {
    getIcpTokens();
  }, []);

  const filteredTokens = useMemo(() => {
    const searchQuery = query.toLowerCase();
    return icpTokens.filter(
      (token) =>
        token.name.toLowerCase().includes(searchQuery) ||
        token.symbol.toLowerCase().includes(searchQuery) ||
        token.canisterId?.toLowerCase().includes(searchQuery),
    );
  }, [query, icpTokens]);

  const isTokenSelected = (token: IcpToken) => {
    if (selectedType === 'sell') {
      return fromToken?.canisterId === token.canisterId;
    }
    return toToken?.canisterId === token.canisterId;
  };

  return (
    <Box className={cn('justify-normal animate-slide-in opacity-0', 'md:max-w-[612px] md:h-[607px] md:px-9 md:py-8')}>
      <BoxHeader title="Select Token" onBack={prevStepHandler} />
      <input
        type="text"
        placeholder="Search token"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cn(
          'border-[#1C68F8] dark:border-[#000000] rounded-md py-2 px-3 mb-6',
          'bg-white/50 dark:bg-white/30 text-black dark:text-white',
          'placeholder:text-black/50 dark:placeholder:text-white/50',
          'w-full',
        )}
      />
      <div className="w-full flex flex-col gap-y-5 overflow-y-auto">
        {filteredTokens.map((token, idx) => (
          <TokenCard
            key={idx}
            token={token}
            onClick={() => {
              setTokenHandler(token);
              prevStepHandler();
            }}
            isSelected={isTokenSelected(token)}
          />
        ))}
      </div>
    </Box>
  );
}
