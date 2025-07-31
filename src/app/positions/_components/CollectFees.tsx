import { Avatar } from '@/components/common/ui/avatar';
import { ArrowLeftIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { FormattedPosition, Step } from '../page';
import Link from 'next/link';
import SolidCard from '@/components/ui/cards/SolidCard';

interface CollectFeesProps {
  position: FormattedPosition;
  setCurrentStep: React.Dispatch<React.SetStateAction<Step>>;
}

export default function CollectFeesPage({ position, setCurrentStep }: CollectFeesProps) {
  const { token0, token1, is_in_range, fees_token0_owed, fees_token1_owed } = position;
  return (
    <div className="w-full animate-fade">
      {/* Header */}
      <div
        className={cn('relative isolate', 'mb-8 flex items-center justify-between gap-4', 'w-full')}
      >
        <ArrowLeftIcon
          onClick={() => {
            setCurrentStep('positionDetail');
          }}
          className="z-10 hidden cursor-pointer md:inline-block"
        />
        <h1
          className={cn(
            'text-[27px] font-bold md:text-[30px]',
            'md:absolute md:inset-x-0 md:text-center',
          )}
        >
          Collect fees
        </h1>
        <button
          className={cn(
            'px-2.5 py-0.5',
            'rounded-md',
            'bg-white/10',
            'text-xs font-medium text-white/60',
            'z-10',
          )}
        >
          <Link href="https://t.me/Appic_dao">Get help</Link>
        </button>
      </div>

      {/* Main */}
      <SolidCard className="mb-8 bg-transparent px-5 lg:bg-[#222222] lg:px-8">
        {/* token0 */}
        <div className="flex items-center justify-between gap-2">
          <Avatar src={token0.logo} className="h-6 w-6 md:h-7 md:w-7" />
          <p className={cn('text-nowrap md:text-xl', 'flex-grow')}>{token0.symbol}</p>
          <p className="text-sm text-white/80 md:text-base">
            {fees_token0_owed} {token0.symbol}
          </p>
        </div>
        {/* token1 */}
        <div className="mt-9 flex items-center justify-between gap-2">
          <Avatar src={token1.logo} className="h-6 w-6 md:h-7 md:w-7" />
          <p className={cn('text-nowrap md:text-xl', 'flex-grow')}>{token1.symbol}</p>
          <p className="text-sm text-white/80 md:text-base">
            {fees_token1_owed} {token1.symbol}
          </p>
        </div>
      </SolidCard>

      {/* Action Button */}
      <div className={cn('flex items-center justify-center gap-x-3', 'w-full')}>
        <button
          onClick={() => {
            setCurrentStep('positionDetail');
          }}
          className={cn(
            'min-h-14 w-full',
            'bg-white/35',
            'text-white',
            'mt-auto md:mt-0',
            'select-none rounded-[16px] duration-200',
            'hover:opacity-85',
            'md:hidden',
          )}
        >
          Cancel
        </button>
        <button
          className={cn(
            'min-h-14 w-full',
            'bg-primary-buttons',
            'text-white',
            'mt-auto md:mt-0',
            'select-none rounded-[16px] duration-200',
            'hover:opacity-85',
          )}
        >
          Collect
        </button>
      </div>
    </div>
  );
}
