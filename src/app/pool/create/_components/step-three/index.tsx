import { Avatar } from '@/components/common/ui/avatar';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';

export default function CreatePoolStepThree() {
  return (
    <div className="flex h-full w-full animate-fade flex-col gap-5">
      <div className="flex w-full items-center justify-between gap-4">
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
              className="-ml-4 h-[34px] w-[34px] md:h-[46px] md:w-[46px]"
            />
          </div>
          <div className="text-[27px] font-bold md:text-[34px]">USDC/ETH</div>
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

      <div className="flex w-full flex-col gap-x-4 gap-y-2 md:flex-row">
        <div
          className={cn(
            'flex flex-col gap-y-2.5 md:gap-y-5',
            'bg-[#222222]',
            'rounded-[21px]',
            'px-6 py-5 md:px-8 md:py-6',
            'w-full',
          )}
        >
          <p className="font-medium text-white/70 md:text-[21px]">Min price</p>
          <p className="text-xl font-semibold text-white">1234.55 USDC/ETH</p>
        </div>
        <div
          className={cn(
            'flex flex-col gap-y-2.5 md:gap-y-5',
            'bg-[#222222]',
            'rounded-[21px]',
            'px-6 py-5 md:px-8 md:py-6',
            'w-full',
          )}
        >
          <p className="font-medium text-white/70 md:text-[21px]">Min price</p>
          <p className="text-xl font-semibold text-white">1234.55 USDC/ETH</p>
        </div>
      </div>

      <div
        className={cn(
          'flex flex-col gap-y-3.5',
          'bg-[#222222]',
          'rounded-[21px]',
          'px-6 py-5 md:px-8 md:py-6',
          'w-full',
        )}
      >
        <p className="font-bold text-white md:text-xl">Set initial price</p>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5 font-semibold">
            <p className="text-[13px] text-white/50 md:text-sm">Depositing</p>
            <p className="text-white md:text-lg">1234.55 USDC/ETH</p>
            <p className="text-xs text-white/50">$110.0M</p>
          </div>
          <div
            className={cn(
              'relative',
              'flex items-center gap-x-2',
              'font-semibold text-white md:text-xl',
            )}
          >
            <Avatar
              // src={token?.logo}
              src="/images/logo/icp-logo.svg"
              className="h-6 w-6 md:h-7 md:w-7"
            />
            <Avatar
              // src={token?.logo}
              src="/images/logo/icp-logo.svg"
              className={cn('h-3 w-3 md:h-3.5 md:w-3.5', 'absolute bottom-0 left-3')}
            />
            ETH
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5 font-semibold">
            <p className="text-[13px] text-white/50 md:text-sm">Depositing</p>
            <p className="text-white md:text-lg">1234.55 USDC/ETH</p>
            <p className="text-xs text-white/50">$110.0M</p>
          </div>
          <div
            className={cn(
              'relative',
              'flex items-center gap-x-2',
              'font-semibold text-white md:text-xl',
            )}
          >
            <Avatar
              // src={token?.logo}
              src="/images/logo/icp-logo.svg"
              className="h-6 w-6 md:h-7 md:w-7"
            />
            <Avatar
              // src={token?.logo}
              src="/images/logo/icp-logo.svg"
              className={cn('h-3 w-3 md:h-3.5 md:w-3.5', 'absolute bottom-0 left-3')}
            />
            ETH
          </div>
        </div>
      </div>

      <div
        className={cn(
          'flex items-center justify-between gap-4',
          'bg-[#222222]',
          'rounded-[21px]',
          'px-6 py-7 md:px-8 md:py-6',
          'w-full',
        )}
      >
        <p className="font-medium text-white/70 md:text-[21px]">Market Price</p>
        <div
          className={cn(
            'flex items-center gap-x-1.5',
            'text-lg font-semibold text-white md:text-[21px]',
          )}
        >
          <Avatar
            // src={token?.logo}
            src="/images/logo/icp-logo.svg"
            className="h-5 w-5 md:h-7 md:w-7"
          />
          $0.01
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
    </div>
  );
}
