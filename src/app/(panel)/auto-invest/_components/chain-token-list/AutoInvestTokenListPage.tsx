'use client';
import { tokens } from '@/blockchain_api/lists/sampleToken';
import { IcpToken } from '@/blockchain_api/types/tokens';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import TokenCard from './token-card';
import BoxHeader from '@/components/ui/box-header';

interface TokenListProps {
  prevStepHandler: () => void;
  setTokenHandler: (token: IcpToken) => void;
  selectedType: 'buy' | 'sell';
  fromToken: IcpToken | null;
  toToken: IcpToken | null;
}

export default function AutoInvestTokenListPage({
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
    <Box
      className={cn(
        'animate-slide-in justify-normal opacity-0',
        'md:h-[607px] md:max-w-[537px] md:px-9 md:py-8',
      )}
    >
      <BoxHeader title="Select Token" onBack={prevStepHandler} />
      <input
        type="text"
        placeholder="Search token"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cn(
          'mb-6 w-full rounded-md border-[#000000] px-3 py-2',
          'bg-white/30 text-white placeholder:text-white/50',
        )}
      />
      <div className="flex w-full flex-col gap-y-5 overflow-y-auto">
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
