import Box from '@/components/ui/box';
import BoxHeader from '@/components/ui/box-header';
import { TokenListProps } from '../_types';
import { chains } from '@/blockchain_api/lists/chains';
import { useFormContext, useWatch } from 'react-hook-form';
import { Chain } from '@/blockchain_api/types/chains';
import ChainItem from '@/components/ui/chain-item';

export default function TokenListPage({ prevStepHandler }: TokenListProps) {
  const { setValue, control, clearErrors } = useFormContext();

  const ChainIdWatched = useWatch({ control, name: 'chain_id' });

  const ChainItemClickHandler = (chain: Chain) => {
    setValue('chain_id', String(chain.chainId));
    clearErrors('chain_id');
    prevStepHandler();
  };

  return (
    <Box className="animate-slide-in justify-normal opacity-0 md:h-[280px] md:max-w-[612px] md:px-9 md:pt-8">
      <BoxHeader title="Select Chain" onBack={prevStepHandler} />
      <div className="mb-7 grid w-full select-none grid-cols-5 place-items-center gap-5 md:px-4">
        {chains.map((chain, idx) => (
          <ChainItem
            key={idx}
            chain={chain}
            selectedId={ChainIdWatched}
            disabled={!chain.twin_token_support}
            onClick={ChainItemClickHandler}
          />
        ))}
      </div>
    </Box>
  );
}
