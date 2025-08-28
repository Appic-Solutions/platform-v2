import { Avatar } from '@/components/common/ui/avatar';
import React from 'react';
import { FormattedToken } from './wallet-pop';

export const WalletBalanceItems = ({ tokens }: { tokens: FormattedToken[] }) => {
  return (
    <div className="flex max-h-56 flex-col gap-y-5 overflow-y-auto">
      {tokens.map((token, idx) => (
        <div
          key={idx}
          className="text-dark flex items-center justify-between gap-x-4 text-sm dark:text-white"
        >
          <div className="relative flex items-center gap-x-5">
            <Avatar src={token.logo} className="h-9 w-9" />
            <Avatar src={token.chainLogo} className="absolute left-7 top-5 h-4 w-4" />
            <span>{`${token.symbol} (${token.chainName})`}</span>
          </div>
          <span>$ {token.displayUsd}</span>
        </div>
      ))}
    </div>
  );
};
