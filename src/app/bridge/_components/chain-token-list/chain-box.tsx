import React from 'react';
import { chains } from '@/blockchain_api/lists/chains';
import { Chain } from '@/blockchain_api/types/chains';
import ChainItem from '@/components/ui/chain-item';

const ChainBoxPage = ({
  selectedChainId,
  onChainSelect,
}: {
  selectedChainId: Chain['chainId'];
  onChainSelect: (chainId: Chain['chainId']) => void;
}) => {

  const ChainItemClickHandler = (chain: Chain) => {
    onChainSelect(chain.chainId);
  }

  return (
    <div className="grid grid-cols-5 gap-5 place-items-center w-full select-none md:px-4 mb-7">
      {chains.map((chain, idx) => (
        <ChainItem
          key={idx}
          chain={chain}
          selectedId={selectedChainId}
          disabled={chain.disabled}
          onClick={ChainItemClickHandler}
        />
      ))}
    </div>
  );
};

export default ChainBoxPage;
