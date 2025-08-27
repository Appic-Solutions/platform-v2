import { CollectedFeesHistory } from '@/blockchain_api/functions/icp/get_bridge_history';
import { Avatar } from '@/components/common/ui/avatar';
import SolidCard from '@/components/ui/cards/SolidCard';
import { cn, formatToSignificantFigures } from '@/lib/utils';

export default function CollectFeesCard({
  token0,
  token1,
  human_readable_amount0_collected,
  human_readable_amount1_collected,
}: CollectedFeesHistory) {
  return (
    <SolidCard className="bg-transparent px-5 lg:bg-[#222222] lg:px-8">
      {/* token0 */}
      <div className="flex items-center justify-between gap-2">
        <Avatar src={token0.logo} className="h-6 w-6 md:h-7 md:w-7" />
        <p className={cn('text-nowrap md:text-xl', 'flex-grow')}>{token0.symbol}</p>
        <p className="text-sm text-white/80 md:text-base">
          {formatToSignificantFigures(human_readable_amount0_collected)}
        </p>
      </div>

      {/* token1 */}
      <div className="mt-9 flex items-center justify-between gap-2">
        <Avatar src={token1.logo} className="h-6 w-6 md:h-7 md:w-7" />
        <p className={cn('text-nowrap md:text-xl', 'flex-grow')}>{token1.symbol}</p>
        <p className="text-sm text-white/80 md:text-base">
          {formatToSignificantFigures(human_readable_amount1_collected)}
        </p>
      </div>
    </SolidCard>
  );
}
