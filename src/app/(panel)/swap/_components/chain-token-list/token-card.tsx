'use client';

import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { LinkIcon } from '@/components/icons';
import { cn, formatToSignificantFigures } from '@/lib/utils';
import { Avatar } from '@/components/common/ui/avatar';
import Link from 'next/link';
const TokenCard = ({
  token,
  onClick,
  isSelected,
}: {
  token: EvmToken | IcpToken;
  onClick: () => void;
  isSelected: boolean;
}) => {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-between rounded-md p-2 hover:bg-[#2A2A2A]',
        isSelected && 'bg-[#2A2A2A]',
      )}
    >
      <div
        className={cn('group flex flex-grow cursor-pointer items-center gap-x-5 duration-200')}
        onClick={onClick}
      >
        <Avatar src={token.logo} alt={token.name} className="h-12 w-12" />
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate text-xl font-bold text-white">{token.symbol}</p>
          <div className="h-5 overflow-hidden">
            <div className="flex flex-col transition-transform duration-300 group-hover:-translate-y-5">
              <p className="truncate text-sm font-semibold text-[#B5B3B3]">{token.name}</p>
              <p className="flex items-center gap-x-2 truncate text-sm font-semibold text-[#B5B3B3]">
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
      {token.balance && (
        <div className="flex flex-col">
          <p className="truncate text-xl font-bold text-white">
            {formatToSignificantFigures(token.balance)}
          </p>
          <p className="flex items-center gap-x-2 truncate text-sm font-semibold text-[#B5B3B3]">
            ${Number(token.usdBalance).toFixed(3)}
          </p>
        </div>
      )}
    </div>
  );
};

export default TokenCard;
