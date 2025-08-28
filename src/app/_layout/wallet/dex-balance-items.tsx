import { DexBalanceItem } from './dex-balance-item';
import { FormattedToken } from './_types';
import { IcpToken } from '@/blockchain_api/types/tokens';

interface DexBalanceItemsProps {
  tokens: FormattedToken[];
}

function isFormattedIcpToken(token: FormattedToken): token is IcpToken & FormattedToken {
  return (token as IcpToken).canisterId !== undefined;
}

export const DexBalanceItems = ({ tokens }: DexBalanceItemsProps) => {
  const icpTokens = tokens.filter(isFormattedIcpToken);

  if (icpTokens.length === 0) {
    return (
      <div className="flex items-center justify-center text-sm font-semibold text-white">
        No ICP tokens found
      </div>
    );
  }

  return (
    <div className="flex max-h-56 flex-col gap-y-5 overflow-y-auto">
      {icpTokens.map((token) => (
        <DexBalanceItem key={token.canisterId} token={token} />
      ))}
    </div>
  );
};
