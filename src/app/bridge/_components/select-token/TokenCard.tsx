import { getChainName } from '@/common/helpers/utils';
import { getChainLogo } from '@/common/helpers/utils';
import { Card } from '@/common/components/ui/card';
import { cn } from '@/common/helpers/utils';
import { TokenType } from '@/app/bridge/_store';
import { Avatar } from '@/components/common/ui/avatar';

interface TokenCardProps {
  customOnClick: () => void;
  token: TokenType | undefined;
  label: string;
  className?: string;
}

export function TokenCard({ token, customOnClick, label, className }: TokenCardProps) {
  return (
    <Card
      className={cn(
        'max-h-[133px] md:max-h-[155px] cursor-pointer flex-col items-start justify-center gap-2',
        className,
      )}
      onClick={() => {
        customOnClick?.();
      }}
    >
      <p className="text-sm font-semibold">{label}</p>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar
            src={token?.logo}
            className='w-11 h-11 '
          />
          <Avatar
            src={getChainLogo(token?.chainId)}
            className='absolute -right-1 -bottom-1 w-5 h-5 shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]'
          />
        </div>
        <div>
          <p className={cn('text-nowrap ', token?.symbol.length && token?.symbol.length > 7 && 'text-ellipsis w-28')}>
            {token?.symbol || 'Select Token'}
          </p>
          <p className={cn('text-sm', getChainName(token?.chainId).length > 3 && 'text-ellipsis w-20')}>
            {getChainName(token?.chainId)}
          </p>
        </div>
      </div>
    </Card>
  );
}
