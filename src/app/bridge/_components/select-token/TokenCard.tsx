import { getChainName } from '@/lib/utils';
import { getChainLogo } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
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
        'max-h-[133px] cursor-pointer flex-col items-start justify-center gap-2 md:max-h-[155px]',
        className,
      )}
      onClick={() => {
        customOnClick?.();
      }}
    >
      <p className="text-sm font-semibold">{label}</p>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar src={token?.logo} className="h-11 w-11" />
          <Avatar
            src={getChainLogo(token?.chainId)}
            className="absolute -bottom-1 -right-1 h-5 w-5 shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]"
          />
        </div>
        <div>
          <p
            className={cn(
              'text-nowrap',
              token?.symbol.length && token?.symbol.length > 7 && 'w-28 text-ellipsis',
            )}
          >
            {token?.symbol || 'Select Token'}
          </p>
          <p
            className={cn(
              'text-sm',
              getChainName(token?.chainId).length > 3 && 'w-20 text-ellipsis',
            )}
          >
            {getChainName(token?.chainId)}
          </p>
        </div>
      </div>
    </Card>
  );
}
