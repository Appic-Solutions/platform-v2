import { Avatar } from '@/components/common/ui/avatar';
import React, { useState } from 'react';
import { FormattedToken } from './wallet-pop';
import { useMutation } from '@tanstack/react-query';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { Agent } from '@dfinity/agent';
import { withdraw_funds_from_appic_dex } from '@/blockchain_api/functions/icp/dex/tx/withdraw';
import Spinner from '@/components/common/ui/spinner';
import { useAuthenticatedAgent } from '@/lib/hooks/useAuthenticatedAgent';

export const DexBalanceItems = ({
  tokens,
}: {
  tokens: (IcpToken & {
    displayUsd: string;
    chainName: string;
    chainLogo: string;
  })[];
}) => {
  const authenticatedAgent = useAuthenticatedAgent();
  const { mutateAsync: withdrawFundsHandler, isPending } = useMutation({
    mutationKey: ['withdraw-dex-balance'],
    mutationFn: ({
      amount,
      authenticatedAgent,
      token,
    }: {
      token: IcpToken;
      amount: string;
      authenticatedAgent: Agent;
    }) => withdraw_funds_from_appic_dex({ amount, token }, authenticatedAgent),
  });

  return (
    <div className="flex max-h-56 flex-col gap-y-5 overflow-y-auto">
      {tokens.map((token, idx) => {
        const { displayUsd, chainName, chainLogo, ...icpToken } = token;
        return (
          <div
            key={idx}
            className="text-dark flex items-center justify-between gap-x-4 text-sm dark:text-white"
          >
            <div className="relative flex items-center gap-x-5">
              <Avatar src={token.logo} className="h-9 w-9" />
              <Avatar src={token.chainLogo} className="absolute left-7 top-5 h-4 w-4" />
              <span>{`${token.symbol} (${token.chainName})`}</span>
            </div>
            <div className="flex h-8 flex-col items-end">
              <span>$ {token.displayUsd}</span>
              {isPending ? (
                <Spinner className="h-3 w-3" />
              ) : (
                <span
                  onClick={() =>
                    withdrawFundsHandler({
                      amount: token.balance!,
                      token: icpToken,
                      authenticatedAgent: authenticatedAgent!,
                    })
                  }
                  className="cursor-pointer text-xs hover:text-opacity-50"
                >
                  Withdraw
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
