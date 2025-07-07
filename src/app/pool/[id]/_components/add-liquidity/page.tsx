import { Avatar } from '@/components/common/ui/avatar';
import { ArrowLeftIcon } from '@/components/icons';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';

export default function AddLiquidityPage() {
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
      <div className={cn('relative isolate', 'flex items-center justify-between gap-4', 'w-full')}>
        <ArrowLeftIcon className="z-10 hidden cursor-pointer md:inline-block" />
        <h1
          className={cn(
            'text-[27px] font-bold md:text-[30px]',
            'md:absolute md:inset-x-0 md:text-center',
          )}
        >
          Add liquidity
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
          Get help
        </button>
      </div>

      {/* Main */}
      <div className="flex w-full flex-col gap-y-3">
        <div className={cn('flex items-center justify-between gap-4', 'mb-7 md:mb-1')}>
          <div
            className={cn(
              'max-h-[58px] flex-1',
              'grid grid-cols-9 md:grid-cols-8',
              'md:grid-rows-2',
            )}
          >
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
                src="/images/logo/icp-logo.svg"
                className="h-[31px] w-[31px] md:h-[58px] md:w-[58px]"
              />
              <Avatar
                // src={token?.logo}
                src="/images/logo/icp-logo.svg"
                className={cn('h-[31px] w-[31px] md:h-[58px] md:w-[58px]', '-ml-4')}
              />
            </div>
            <div
              className={cn(
                'flex items-center',
                'text-[27px] font-bold md:text-[32px]',
                'col-span-7 sm:col-span-8 md:col-span-6',
              )}
            >
              USDC/ETH
            </div>
            <div
              className={cn(
                'flex items-center gap-x-1',
                'text-xs font-medium',
                'col-span-full md:col-span-6',
              )}
            >
              <Avatar
                // src={token?.logo}
                src="/images/logo/icp-logo.svg"
                className="h-6 w-6"
              />
              <p className="text-white">BNB Smart Chain Mainnet</p>
              <p className={cn('flex items-center gap-x-1.5', 'ml-2 text-[#77EF4B]')}>
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
            'bg-[linear-gradient(to_bottom,#242424_0%,#2121214D_100%)]',
            'border-2 border-[#4C4C4C]/30',
            'rounded-[28px]',
            'px-8 py-6',
            'flex items-center justify-between gap-4',
          )}
        >
          <div className="flex flex-col gap-2">
            <p className="text-[22px] font-semibold text-white md:text-[27px]">1234.55</p>
            <p className="text-sm font-semibold text-white/50">$54379502</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className={cn('relative', 'flex gap-x-1.5 self-end')}>
              <Avatar
                // src={token?.logo}
                src="/images/logo/icp-logo.svg"
                className="h-5 w-5 md:h-6 md:w-6"
              />
              <Avatar
                // src={token?.logo}
                src="/images/logo/icp-logo.svg"
                className={cn('h-3 w-3', 'absolute bottom-0 left-3')}
              />
              <p className="text-sm font-semibold text-white md:text-xl">ETH</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-white/50">0.03 ETH</span>
              <span
                className={cn(
                  'bg-[#2060D5]/45',
                  'text-xs font-medium text-[#A7C6FF] md:text-sm',
                  'px-1.5 py-1 md:px-3',
                  'rounded-[10px] md:rounded-[16px]',
                )}
              >
                Max
              </span>
            </div>
          </div>
        </div>
        <div
          className={cn(
            'bg-[linear-gradient(to_bottom,#242424_0%,#2121214D_100%)]',
            'border-2 border-[#4C4C4C]/30',
            'rounded-[28px]',
            'px-8 py-6',
            'flex items-center justify-between gap-4',
          )}
        >
          <div className="flex flex-col gap-2">
            <p className="text-[22px] font-semibold text-white md:text-[27px]">1234.55</p>
            <p className="text-sm font-semibold text-white/50">$54379502</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className={cn('relative', 'flex gap-x-1.5 self-end')}>
              <Avatar
                // src={token?.logo}
                src="/images/logo/icp-logo.svg"
                className="h-5 w-5 md:h-6 md:w-6"
              />
              <Avatar
                // src={token?.logo}
                src="/images/logo/icp-logo.svg"
                className={cn('h-3 w-3', 'absolute bottom-0 left-3')}
              />
              <p className="text-sm font-semibold text-white md:text-xl">ETH</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-white/50">0.03 ETH</span>
              <span
                className={cn(
                  'bg-[#2060D5]/45',
                  'text-xs font-medium text-[#A7C6FF] md:text-sm',
                  'px-1.5 py-1 md:px-3',
                  'rounded-[10px] md:rounded-[16px]',
                )}
              >
                Max
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'md:bg-[#222222]',
          'rounded-[14px] md:rounded-[21px]',
          'px-8 py-6',
          'flex flex-col gap-y-2.5',
          'w-full',
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-white/70 md:text-base">ETH position</p>
          <div
            className={cn(
              'relative',
              'flex items-center gap-x-1.5',
              'text-sm font-semibold text-white md:text-base',
            )}
          >
            <Avatar
              // src={token?.logo}
              src="/images/logo/icp-logo.svg"
              className="h-5 w-5 md:h-6 md:w-6"
            />
            <Avatar
              // src={token?.logo}
              src="/images/logo/icp-logo.svg"
              className={cn('h-3 w-3', 'absolute bottom-0 left-3')}
            />
            0.002 ETH
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-white/70 md:text-base">ETH position</p>
          <div
            className={cn(
              'relative',
              'flex items-center gap-x-1.5',
              'text-sm font-semibold text-white md:text-base',
            )}
          >
            <Avatar
              // src={token?.logo}
              src="/images/logo/icp-logo.svg"
              className="h-5 w-5 md:h-6 md:w-6"
            />
            <Avatar
              // src={token?.logo}
              src="/images/logo/icp-logo.svg"
              className={cn('h-3 w-3', 'absolute bottom-0 left-3')}
            />
            0.002 ETH
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className={cn('flex items-center justify-center gap-x-3', 'w-full')}>
        <button
          className={cn(
            'min-h-14 w-full',
            'bg-white/35',
            'text-white',
            'mt-auto md:mt-0',
            'select-none rounded-[16px] duration-200',
            'hover:opacity-85',
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
          Continue
        </button>
      </div>
    </Box>
  );
}
