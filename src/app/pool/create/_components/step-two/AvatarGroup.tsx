import { Avatar } from '@/components/common/ui/avatar';
import { cn } from '@/lib/utils';

const AvatarGroup = () => {
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
        // src={token?.logo}
        src="/images/logo/chains-logos/arbitrum.svg"
        className="h-[33px] w-[33px] md:h-[48px] md:w-[48px]"
      />
      <Avatar
        // src={token?.logo}
        src="/images/logo/chains-logos/ethereum.svg"
        className={cn('h-[33px] w-[33px] md:h-[48px] md:w-[48px]', '-ml-4')}
      />
    </div>
  );
};

export default AvatarGroup;
