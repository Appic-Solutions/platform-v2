import { IcpToken } from '@/blockchain_api/types/tokens';
import { LinkIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/common/ui/avatar';
import Link from 'next/link';

const TokenCard = ({
  token,
  onClick,
  isSelected,
}: {
  token: IcpToken;
  onClick: () => void;
  isSelected: boolean;
}) => (
  <div
    className={cn(
      'group flex cursor-pointer items-center gap-x-5 rounded-md p-2 duration-200',
      'hover:bg-[#2A2A2A]',
      isSelected && 'bg-[#2A2A2A]',
    )}
    onClick={onClick}
  >
    <Avatar src={token.logo} className="h-[50px] w-[50px]" />
    <div className="flex min-w-0 flex-1 flex-col">
      <p className="truncate text-xl font-bold text-white">{token.symbol}</p>
      <div className="h-5 overflow-hidden">
        <div className="flex flex-col transition-transform duration-300 group-hover:-translate-y-5">
          <p className="truncate text-sm font-semibold text-[#B5B3B3]">{token.name}</p>
          <p className="flex items-center gap-x-2 truncate text-sm font-semibold text-[#B5B3B3]">
            {token?.canisterId?.slice(0, 14)}
            <Link
              href={`https://dashboard.internetcomputer.org/canister/${token.canisterId}`}
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
);

export default TokenCard;
