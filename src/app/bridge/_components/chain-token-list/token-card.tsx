'use client';

import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { LinkIcon } from '@/common/components/icons';
import { cn, formatToSignificantFigures } from '@/common/helpers/utils';
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
        'flex justify-between items-center w-full rounded-md p-2',
        isSelected && 'bg-[#F5F5F5] dark:bg-[#2A2A2A]',
        'hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A]',
      )}
    >
      <div className={cn('flex items-center gap-x-5 cursor-pointer group duration-200 flex-grow')} onClick={onClick}>
        <Avatar
          src={token.logo} alt={token.name}
          className='w-[50px] h-[50px]'
        />
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
      {token.balance && (
        <div className="flex flex-col">
          <p className="text-xl font-bold text-black dark:text-white truncate">
            {formatToSignificantFigures(token.balance)}
          </p>
          <p className="text-sm font-semibold text-[#6E6E6E] dark:text-[#B5B3B3] truncate flex items-center gap-x-2">
            ${Number(token.usdBalance).toFixed(3)}
          </p>
        </div>
      )}
    </div>
  );
};

export default TokenCard;
