import { IcpToken } from '@/blockchain_api/types/tokens';
import { Avatar } from '@/components/common/ui/avatar';
import { cn } from '@/lib/utils';

interface AvatarArgs {
  token0: IcpToken;
  token1: IcpToken;
}

const AvatarGroup = ({ token1, token0 }: AvatarArgs) => {
  return (
    <div
      className={cn(
        'flex items-center',
        'col-span-2 sm:col-span-1 md:col-span-2',
        'max-w-fit',
        'md:row-span-full',
      )}
    >
      <Avatar
        src={token0.logo}
        // src="/images/logo/chains-logos/arbitrum.svg"
        className="h-[33px] w-[33px] md:h-[48px] md:w-[48px]"
      />
      <Avatar
        src={token1.logo}
        className={cn('h-[33px] w-[33px] md:h-[48px] md:w-[48px]', '-ml-4')}
      />
    </div>
  );
};

export default AvatarGroup;
