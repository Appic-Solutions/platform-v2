import { Avatar } from '@/components/common/ui/avatar';
import { cn } from '@/lib/utils';

interface AvatarArgs {
  avatar0: string;
  avatar1: string;
}

const AvatarGroup = ({ avatar0, avatar1 }: AvatarArgs) => {
  return (
    <div
      className={cn(
        'flex items-center',
        'col-span-2 sm:col-span-1 md:col-span-2',
        'max-w-fit',
        'md:row-span-full',
      )}
    >
      <Avatar src={avatar0} className="h-[28px] w-[28px] md:h-[38px] md:w-[38px]" />
      <Avatar src={avatar1} className={cn('h-[28px] w-[28px] md:h-[38px] md:w-[38px]', '-ml-4')} />
    </div>
  );
};

export default AvatarGroup;
