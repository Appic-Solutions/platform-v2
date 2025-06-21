import { Avatar } from '@/components/common/ui/avatar';
import { ArrowLeftIcon, PlusIcon, PoolIcon } from '@/components/icons';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';

export default function YourPositionsPage() {
  return (
    <Box
      className={cn(
        'gap-y-9',
        'md:w-[611px]',
        'md:p-12',
        'text-white md:text-black md:dark:text-white',
      )}
    >
      {/* Header */}
      <div className={cn('flex items-center justify-between gap-4', 'w-full')}>
        <h1 className="text-[27px] font-bold md:text-[30px]">Your positions</h1>
        <button
          className={cn(
            'flex items-center justify-center',
            'text-[13px] font-medium md:text-[15px]',
            'rounded-[10px] p-2.5',
            'bg-primary-buttons',
          )}
        >
          <PlusIcon className="h-[14px] w-[14px] md:h-[17px] md:w-[17px]" />
          Create position
        </button>
      </div>

      {/* Main */}
      <div
        className={cn(
          'relative isolate',
          'flex w-full flex-col gap-2.5',
          'px-6 py-5 md:p-8',
          'bg-gradient-to-b from-[#1D55BF]/30 to-[#000000]/30',
          'rounded-[20px] md:rounded-[30px]',
          'border border-[#4982EF]/40',
        )}
      >
        <div className="flex items-center gap-x-1.5">
          <PoolIcon width={24} height={24} />
          <p className="text-lg font-medium md:text-xl">Welcome to your positions</p>
        </div>
        <p className="text-sm text-white/75 md:text-[15px]">
          Connect your wallet to view your current positions.
        </p>
      </div>

      <div
        className={cn(
          'flex w-full flex-col gap-3',
          'pt-3',
          'border-t border-white/20',
          'max-h-96 overflow-y-auto',
        )}
      >
        <div className={cn('bg-[#222222]', 'rounded-[21px]')}>
          <div className={cn('flex items-start justify-between', 'px-6 pb-5 pt-5 md:px-8 md:pt-6')}>
            <div className="flex items-center gap-x-2.5">
              <div className="relative flex">
                <Avatar
                  // src={token?.logo}
                  src="/images/logo/icp-logo.svg"
                  className="h-[34px] w-[34px] md:h-[46px] md:w-[46px]"
                />
                <Avatar
                  // src={token?.logo}
                  src="/images/logo/icp-logo.svg"
                  className={cn('h-[34px] w-[34px] md:h-[46px] md:w-[46px]', '-ml-4')}
                />
                <Avatar
                  // src={token?.logo}
                  src="/images/logo/icp-logo.svg"
                  className={cn(
                    'h-[13px] w-[13px] md:h-[17px] md:w-[17px]',
                    'absolute bottom-1 right-0',
                  )}
                />
              </div>
              <div className="flex flex-col gap-y-1">
                <p className="text-lg font-medium md:text-2xl">USDC/ETH</p>
                <p className={cn('flex items-center gap-x-1.5', 'text-[13px] text-[#77EF4B]')}>
                  <div className="h-[9px] w-[9px] rounded-full bg-[#77EF4B]" />
                  In range
                </p>
              </div>
            </div>
            <div className="flex items-center gap-x-1">
              <div
                className={cn(
                  'rounded-[6px] bg-white/10',
                  'px-1.5 py-px',
                  'text-xs leading-5 text-white/60',
                )}
              >
                V3
              </div>
              <div
                className={cn(
                  'rounded-[6px] bg-white/10',
                  'px-1.5 py-px',
                  'text-xs leading-5 text-white/60',
                )}
              >
                1%
              </div>
            </div>
          </div>

          <div
            className={cn(
              'flex items-center justify-between gap-4',
              'px-6 pb-3.5 pt-6 md:px-8 md:pb-[18px] md:pt-3.5',
              'border-t border-t-white/5',
            )}
          >
            <div className="flex flex-col">
              <span className="text-sm font-semibold md:text-lg">$2.01</span>
              <span className="text-[13px] font-semibold text-white/50">Position</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold md:text-lg">$0.01</span>
              <span className="text-[13px] font-semibold text-white/50">Fees</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold md:text-lg">$2.01</span>
              <span className="text-[13px] font-semibold text-white/50">APR</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-white/50">Full range</span>
              <span className="text-sm font-semibold md:text-lg">$2.01</span>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}
