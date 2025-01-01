'use client';

import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { LinkIcon } from '@/common/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar';
import { Skeleton } from '@/common/components/ui/skeleton';
import { cn, formatToSignificantFigures } from '@/common/helpers/utils';
import { useSharedStore } from '@/common/state/store';
import Link from 'next/link';
import { useEffect, useState } from 'react';
const TokenCard = ({
  token,
  onClick,
  isSelected,
}: {
  token: EvmToken | IcpToken;
  onClick: () => void;
  isSelected: boolean;
}) => {
  const { icpBalance, evmBalance } = useSharedStore();
  const [tokenBalance, setTokenBalance] = useState<{ balance: string; usdBalance: string }>();

  useEffect(() => {
    if (token.chain_type === 'EVM' && evmBalance) {
      const balance = evmBalance.tokens.find((t) => t.contractAddress === token.contractAddress)?.balance;
      const usdBalance = evmBalance.tokens.find((t) => t.contractAddress === token.contractAddress)?.usdBalance;
      if (balance && usdBalance) setTokenBalance({ balance, usdBalance });
    }
    if (token.chain_type === 'ICP' && icpBalance) {
      const balance = icpBalance.tokens.find((t) => t.canisterId === token.canisterId)?.balance;
      const usdBalance = icpBalance.tokens.find((t) => t.canisterId === token.canisterId)?.usdBalance;
      if (balance && usdBalance) setTokenBalance({ balance, usdBalance });
      return;
    }
    setTokenBalance(undefined);
  }, [icpBalance, evmBalance, token]);

  return (
    <div
      className={cn(
        'flex justify-between items-center w-full rounded-md p-2',
        isSelected && 'bg-[#F5F5F5] dark:bg-[#2A2A2A]',
        'hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A]',
      )}
    >
      <div className={cn('flex items-center gap-x-5 cursor-pointer group duration-200 flex-grow')} onClick={onClick}>
        <Avatar className="w-[50px] h-[50px] rounded-full">
          <AvatarImage src={token.logo} alt={token.name} />
          <AvatarFallback>
            <Skeleton />
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col flex-1 min-w-0">
          <p className="text-xl font-bold text-black dark:text-white truncate">{token.symbol}</p>
          <div className="overflow-hidden h-5">
            <div className="flex flex-col transition-transform duration-300 group-hover:-translate-y-5">
              <p className="text-sm font-semibold text-[#6E6E6E] dark:text-[#B5B3B3] truncate">{token.name}</p>
              <p className="text-sm font-semibold text-[#6E6E6E] dark:text-[#B5B3B3] truncate flex items-center gap-x-2">
                {token?.contractAddress?.slice(0, 14) || token?.canisterId?.slice(0, 14)}
                <Link
                  href={
                    token.chain_type === 'EVM'
                      ? `https://etherscan.io/token/${token.contractAddress}`
                      : `https://dashboard.internetcomputer.org/canister/${token.canisterId}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-md p-0.5 hover:bg-white/10"
                >
                  <LinkIcon width={18} height={18} />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      {tokenBalance && (
        <div className="flex flex-col">
          <p className="text-xl font-bold text-black dark:text-white truncate">
            {formatToSignificantFigures(tokenBalance.balance)}
          </p>
          <p className="text-sm font-semibold text-[#6E6E6E] dark:text-[#B5B3B3] truncate flex items-center gap-x-2">
            ${Number(tokenBalance.usdBalance).toFixed(3)}
          </p>
        </div>
      )}
    </div>
  );
};

export default TokenCard;
