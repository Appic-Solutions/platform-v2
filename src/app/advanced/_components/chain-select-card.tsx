import { Chain } from '@/blockchain_api/types/chains';
import { Avatar } from '@/components/common/ui/avatar';
import { Card } from '@/components/ui/card';
import { cn, getChainLogo, getChainName, getChainSymbol } from '@/lib/utils';

interface ChainSelectCardProps {
  label: string;
  value?: Chain | undefined;
  onClick: () => void;
  error?: string;
}

export default function ChainSelectCard({ label, value, onClick, error }: ChainSelectCardProps) {
  const chainId = value?.chainId;
  const hasValue = chainId || chainId === 0;

  return (
    <div className="flex w-full flex-col gap-y-1">
      <Card
        className={cn(
          'max-h-[133px] md:max-h-[155px]',
          'flex-col items-start justify-center gap-2',
          'cursor-pointer',
        )}
        onClick={onClick}
      >
        <p className="text-sm font-semibold">{label}</p>
        <div className="flex items-center gap-4">
          <Avatar
            key={hasValue ? chainId : 'default'}
            src={getChainLogo(chainId)}
            className="h-12 w-12"
          />
          <p
            className={cn('text-nowrap', getChainName(chainId).length > 3 && 'w-40 text-ellipsis')}
          >
            {hasValue ? `${getChainName(chainId)} (${getChainSymbol(chainId)})` : 'Select Chain'}
          </p>
        </div>
      </Card>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
