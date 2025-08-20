'use client';

import BoxHeader from '@/components/ui/box-header';
import { cn } from '@/lib/utils';
import RHFInput from '@/components/form/rhf-input';
import { useFormContext, useWatch } from 'react-hook-form';
import { IcpToken } from '@/blockchain_api/types/tokens';
import TokenCard from '@/app/auto-invest/_components/chain-token-list/token-card';
import { useSharedStore } from '@/store/store';
import { CreatePositionFormDefaultValues } from '../../schema';
import { TokenListPageProps } from '@/app/positions/types';

export default function TokenListPage({
  stateBackHandler,
  selectTokenHandler,
  selectedTokenType,
}: TokenListPageProps) {
  const { control, setValue } = useFormContext<CreatePositionFormDefaultValues>();
  const [query, token0, token1] = useWatch({
    control,
    name: ['searchTokenQuery', 'token0', 'token1'],
  });

  const { icpTokens } = useSharedStore();

  const currentSelected = selectedTokenType === 1 ? token0 : token1;
  const otherSelected = selectedTokenType === 1 ? token1 : token0;

  const lowerQuery = query?.toLowerCase() || '';

  const matchesSearch = (token: IcpToken) =>
    token.name.toLowerCase().includes(lowerQuery) ||
    token.symbol.toLowerCase().includes(lowerQuery) ||
    token.canisterId.toLowerCase().includes(lowerQuery);

  const filteredTokens = icpTokens?.filter(
    (token) => token.canisterId !== otherSelected?.canisterId && matchesSearch(token),
  );

  const handleTokenClick = (token: IcpToken) => {
    selectTokenHandler({
      name: selectedTokenType === 1 ? 'token0' : 'token1',
      value: token,
    });
    setValue('searchTokenQuery', '');
    stateBackHandler();
  };

  return (
    <div className="flex h-full w-full animate-fade flex-col gap-y-4 overflow-y-auto">
      <BoxHeader title="Select Token" onBack={stateBackHandler} />

      <RHFInput
        name="searchTokenQuery"
        placeholder="Search token"
        wrapperClassName="w-full"
        className={cn(
          'h-10 w-full',
          'rounded-md border-[#1C68F8] dark:border-[#000000]',
          'px-3 py-2',
        )}
      />

      <div className="mt-4 flex h-full w-full flex-col gap-2 overflow-y-auto">
        {filteredTokens?.length ? (
          filteredTokens.map((token) => (
            <TokenCard
              key={token.canisterId}
              token={token}
              isSelected={token.canisterId === currentSelected?.canisterId}
              onClick={() => handleTokenClick(token)}
            />
          ))
        ) : (
          <div className="text-muted-foreground text-center text-sm">No tokens found.</div>
        )}
      </div>
    </div>
  );
}
