import { getChainName } from '@/common/helpers/utils';

import { getChainLogo } from '@/common/helpers/utils';

import { IcpToken } from '@/blockchain_api/types/tokens';
import { EvmToken } from '@/blockchain_api/types/tokens';
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar';
import { Card } from '@/common/components/ui/card';
import { cn } from '@/common/helpers/utils';

interface TokenCardProps {
  customOnClick: () => void;
  token: EvmToken | IcpToken | null;
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
          <Avatar className=" w-11 h-11 rounded-full">
            <AvatarImage src={token?.logo || 'images/logo/placeholder.png'} />
            <AvatarFallback>{token?.symbol}</AvatarFallback>
          </Avatar>
          <Avatar
            className={cn(
              'absolute -right-1 -bottom-1 w-5 h-5 rounded-full',
              'shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]',
            )}
          >
            <AvatarImage src={getChainLogo(token?.chainId)} />
            <AvatarFallback>{token?.symbol}</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <p className="text-nowrap ">{token?.symbol || 'Select Token'}</p>
          <p className={cn('text-sm', getChainName(token?.chainId).length > 3 && 'text-ellipsis w-20')}>
            {getChainName(token?.chainId)}
          </p>
        </div>
      </div>
    </Card>
  );
}
