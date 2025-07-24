import { Avatar } from '@/components/common/ui/avatar';
import { ArrowLeftIcon } from '@/components/icons';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';

export default function CollectFeesPage() {
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
          Get help
        </button>
      </div>

      {/* Main */}
      <div
        className={cn(
          'rounded-[21px] bg-[#222222]',
          'px-6 py-5 md:px-8 md:py-6',
          'flex flex-col gap-y-9',
          'w-full',
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="relative">
            <Avatar
              // src={token?.logo}
              src="/images/logo/icp-logo.svg"
              className="h-6 w-6 md:h-7 md:w-7"
            />
            <Avatar
              // src={getChainLogo(token?.chainId)}
              src="/images/logo/icp-logo.svg"
              className="absolute -right-1 bottom-0 h-3.5 w-3.5 shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]"
            />
          </div>
          <p
            className={cn(
              'text-nowrap md:text-xl',
              'flex-grow',
              // token?.symbol.length && token?.symbol.length > 7 && 'w-28 text-ellipsis',
            )}
          >
            {/* {token?.symbol || 'Select Token'} */}
            Select Token
          </p>
          <p className="text-sm text-white/80 md:text-base">0.001 BNB $0.0</p>
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
    </Box>
  );
}
