'use client';
import { Chain } from '@/blockchain_api/types/chains';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import Box from '@/common/components/ui/box';
import { cn } from '@/common/helpers/utils';
import { useState } from 'react';
import ChainBoxPage from './chain-box';
import BoxHeader from '@/common/components/ui/box-header';
interface TokenListProps {
  prevStepHandler: () => void;
  setTokenHandler: (token: EvmToken | IcpToken) => void;
  selectedToken: EvmToken | IcpToken | null;
}

export default function TokenListPage({ prevStepHandler }: TokenListProps) {
  const [selectedChainId, setSelectedChainId] = useState<Chain['chainId']>(0);

  return (
    <Box className={cn('justify-normal animate-slide-in opacity-0', 'md:max-w-[612px] md:h-[280px] md:px-9 md:pt-8')}>
      <BoxHeader title="Select Chain" onBack={prevStepHandler} />
      <ChainBoxPage selectedChainId={selectedChainId} onChainSelect={setSelectedChainId} />
    </Box>
  );
}
