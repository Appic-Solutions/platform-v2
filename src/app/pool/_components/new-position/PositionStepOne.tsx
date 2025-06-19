import { Avatar } from '@/components/common/ui/avatar';
import { ArrowPathIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

const PositionStepOne = () => {
  return (
    <div className="flex h-full w-full animate-fade flex-col gap-y-9 md:gap-y-[25px]">
      {/* Header */}
      <div className={cn('flex items-center justify-between gap-4', 'w-full')}>
        <h1 className={cn('text-[27px] font-bold md:text-[39px]')}>New position</h1>
        <button
          className={cn(
            'flex items-center justify-center gap-x-0.5',
            'px-3.5 py-2.5',
            'rounded-lg',
            'bg-[#565656]',
            'text-sm font-medium text-white',
          )}
        >
          <ArrowPathIcon width={17} height={17} />
          Rest
        </button>
      </div>

      {/* Main */}
      <div className={cn('flex flex-col gap-y-1', 'w-full', 'max-md:-mb-4')}>
        <p className="text-xl font-bold md:text-2xl">Select pair</p>
        <p className="max-w-[424px] text-[13px] md:text-[15px]">
          Choose the tokens you want to provide liquidity for. You can select tokens on all
          supported networks.
        </p>
      </div>

      <div className={cn('flex flex-col gap-2 md:gap-3', 'w-full')}>
        <div
          className={cn(
            'group relative overflow-clip',
            'flex items-center gap-x-3.5',
            'text-[22px] font-bold text-black dark:text-white md:text-2xl',
            'rounded-[20px] border-2 border-[#4C4C4C]/60',
            'w-full',
            'p-5 md:px-8 md:py-4',
            'bg-[linear-gradient(to_bottom,#242424_0%,#2121214D_100%)]',
            'duration-200 hover:bg-[#000000]/75',
          )}
        >
          <div className="relative">
            <Avatar
              // src={token?.logo}
              src="/images/logo/icp-logo.svg"
              className="h-9 w-9 md:h-[53px] md:w-[53px]"
            />
            <Avatar
              // src={getChainLogo(token?.chainId)}
              src="/images/logo/icp-logo.svg"
              className={cn(
                'absolute -bottom-1 -right-1',
                'h-3.5 w-3.5 md:h-[22px] md:w-[22px]',
                'shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]',
              )}
            />
          </div>
          <p
            className={cn(
              'text-nowrap',
              // token?.symbol.length && token?.symbol.length > 7 && 'w-28 text-ellipsis',
            )}
          >
            {/* {token?.symbol || 'Select Token'} */}
            Select Token
          </p>
        </div>
      </div>

      <div className={cn('flex flex-col gap-y-1', 'w-full')}>
        <p className="text-xl font-bold md:text-2xl">Fee tier</p>
        <p className="max-w-[424px] text-[13px] md:text-[15px]">
          The amount earned providing liquidity. Choose an amount that suits your risk tolerance and
          strategy.
        </p>
      </div>

      <div
        className={cn(
          'flex items-center justify-between gap-4',
          'w-full',
          'bg-[#222222]/40',
          'p-[18px] py-[17px]',
          'rounded-[10px]',
        )}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-x-2.5 md:gap-x-3.5">
            <span className="text-lg font-bold">0.05% fee tier</span>
            <span
              className={cn(
                'text-[10px] font-medium text-[#7DABFF]',
                'bg-[#2060D5]/30',
                'rounded-full p-1',
              )}
            >
              HighestTVL
            </span>
          </div>
          <p className="text-sm text-white/60">The % you will earn in fees</p>
        </div>
        <button
          className={cn(
            'flex items-center justify-center gap-x-0.5',
            'px-4 py-2.5',
            'rounded-lg',
            'bg-[#565656]',
            'text-sm font-medium text-white',
          )}
        >
          change
        </button>
      </div>

      {/* Action Button */}
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
  );
};

export default PositionStepOne;
