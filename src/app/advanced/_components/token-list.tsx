import Box from '@/components/ui/box';
import BoxHeader from '@/components/ui/box-header';
import { TokenListProps } from '../_types';
import { chains } from '@/blockchain_api/lists/chains';
import { useFormContext, useWatch } from 'react-hook-form';
import { Chain } from '@/blockchain_api/types/chains';
import ChainItem from '@/components/ui/chain-item';

export default function TokenListPage({
  prevStepHandler,
  fieldName,
  title,
  baseChain,
  twinChain,
}: TokenListProps) {
  const { setValue, control, clearErrors } = useFormContext();

  const selectedChain = useWatch({ control, name: fieldName });
  const isBaseField = fieldName === 'baseChain';

  const ChainItemClickHandler = (chain: Chain) => {
    setValue(fieldName, chain, { shouldDirty: true, shouldValidate: true });
    clearErrors(fieldName);
    prevStepHandler();
  };

  return (
    <Box className="animate-slide-in gap-y-6 opacity-0 md:max-w-[533px]">
      <BoxHeader title={title} onBack={prevStepHandler} />
      <div className="grid w-full select-none grid-cols-5 place-items-center gap-5">
        {chains.map((chain, idx) => {
          const otherChain = isBaseField ? twinChain : baseChain;

          const typeMismatch = !isBaseField && otherChain?.type && chain.type === otherChain.type;

          const isDuplicate =
            !isBaseField &&
            otherChain?.chainId !== undefined &&
            chain.chainId === otherChain.chainId;

          const disabled = !chain.twin_token_support || typeMismatch || isDuplicate;

          return (
            <ChainItem
              key={idx}
              chain={chain}
              selectedId={selectedChain}
              disabled={disabled}
              onClick={ChainItemClickHandler}
            />
          );
        })}
      </div>
    </Box>
  );
}
