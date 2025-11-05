import { Avatar } from '@/components/common/ui/avatar';
import { InfoCircleIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export default function ReviewPositionPage() {
  return (
    <div className="flex h-full w-full animate-fade flex-col gap-4">
      <div className="max-w-[606px]">
        <div className={cn('flex items-center justify-between gap-4', 'mb-10 w-full')}>
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
            <div className="text-[27px] font-bold md:text-[40px]">USDC/ETH</div>
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
            'flex flex-col gap-y-2.5 md:gap-y-3.5',
            'bg-[#222222]',
            'rounded-[21px]',
            'px-6 py-5 md:px-8 md:py-6',
            'w-full',
            'mb-10 md:mb-[55px]',
          )}
        >
          <div className={cn('flex items-center gap-x-1.5', 'text-lg font-medium md:text-xl')}>
            <InfoCircleIcon />
            Create new pool
          </div>
          <p className="text-sm text-white/70 md:text-sm">
            Full-range liquidity ensures seamless market participation across all prices but risks
            higher impermanent loss. Custom-range liquidity boosts capital efficiency and fee
            earnings within set price bounds, requiring active management.
          </p>
        </div>
        <div>
          <p className="mb-1.5 text-xl md:text-2xl">Set initial price</p>
          <p className="mb-2.5 max-w-[528px] text-[13px] md:mb-[18px] md:text-sm">
            Choose the tokens you want to provide liquidity for. You can select tokens on all
            supported networks.
          </p>
          <div
            className={cn(
              'relative isolate',
              'bg-[linear-gradient(to_bottom,#242424_0%,#2121214D_100%)]',
              'px-8 py-6',
              'rounded-[28px] backdrop-blur-[30px]',
              'border-2 border-[#4C4C4C]/30',
              'mb-3 md:mb-5',
            )}
          >
            <div className={cn('flex items-center justify-between gap-4', 'mb-9 md:mb-10')}>
              <p className="font-semibold text-white/70 md:text-[21px]">initial price</p>
              <div
                className={cn(
                  'flex items-center justify-center gap-1',
                  'bg-[#2B2B2B]',
                  'rounded-[10px] p-1',
                  '*:flex *:items-center *:justify-center *:gap-x-1',
                  '*:px-2.5 *:py-1',
                  '*:rounded-[6px]',
                  'text-xs font-semibold',
                )}
              >
                <div className={cn('bg-[#1E53B8]')}>
                  <Avatar
                    // src={token?.logo}
                    src="/images/logo/icp-logo.svg"
                    className="h-4 w-4"
                  />
                  USDC
                </div>
                <div className="">
                  <Avatar
                    // src={token?.logo}
                    src="/images/logo/icp-logo.svg"
                    className="h-4 w-4"
                  />
                  USDC
                </div>
              </div>
            </div>
            <div className="font-semibold">
              <p className="text-xl md:text-2xl">1234.55</p>
              <p className="text-xs text-white/50 md:text-sm">1 USDC = 1 ETH</p>
            </div>
          </div>
        </div>
        <div
          className={cn(
            'flex flex-col gap-y-2.5 md:flex-row md:justify-between md:gap-y-5',
            'bg-[#222222]',
            'rounded-[21px]',
            'px-6 py-5 md:px-8 md:py-6',
            'w-full',
            '*:text-sm *:md:text-[17px]',
          )}
        >
          <p>
            <span className="text-white/80">Market price: </span>0 ICP = 1 ETH (-)
          </p>
          <p className="text-white/80">Use market price</p>
        </div>
      </div>
      <div>
        <div className="mb-10 md:mb-[55px]">
          <p className="mb-3 text-xl md:mb-4 md:text-2xl">Set price range</p>
          <div className="flex w-full items-center gap-2 *:w-full md:gap-5">
            <div
              className={cn(
                'relative isolate',
                'bg-[linear-gradient(to_bottom,#242424_0%,#2121214D_100%)]',
                'px-8 py-6',
                'rounded-[28px] backdrop-blur-[30px]',
                'border-2 border-[#4C4C4C]/30',
              )}
            >
              <p className="mb-10 text-white/70 md:text-[21px]">Min price</p>
              <div className="font-semibold">
                <p className="text-xl md:text-2xl">1234.55</p>
                <p className="text-xs text-white/50 md:text-sm">USDC = 1 ETH</p>
              </div>
            </div>
            <div
              className={cn(
                'relative isolate',
                'bg-[linear-gradient(to_bottom,#242424_0%,#2121214D_100%)]',
                'px-8 py-6',
                'rounded-[28px] backdrop-blur-[30px]',
                'border-2 border-[#4C4C4C]/30',
              )}
            >
              <p className="mb-10 text-white/70 md:text-[21px]">Max price</p>
              <div className="font-semibold">
                <p className="text-xl md:text-2xl">1234.55</p>
                <p className="text-xs text-white/50 md:text-sm">USDC = 1 ETH</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-10 md:mb-[34px]">
          <p className="mb-2 text-xl md:mb-2.5 md:text-2xl">Deposit tokens</p>
          <p className="mb-3 text-sm text-white/70 md:mb-5 md:text-sm">
            The amount earned providing liquidity. Choose an amount that suits your risk tolerance
            and strategy.
          </p>
          <div className="flex w-full items-center gap-2 *:w-full md:gap-5">
            <div
              className={cn(
                'relative isolate',
                'bg-[linear-gradient(to_bottom,#242424_0%,#2121214D_100%)]',
                'px-8 py-6',
                'rounded-[28px] backdrop-blur-[30px]',
                'border-2 border-[#4C4C4C]/30',
              )}
            >
              <div
                className={cn('flex items-center gap-1.5', 'font-semibold md:text-[21px]', 'mb-10')}
              >
                <Avatar
                  // src={token?.logo}
                  src="/images/logo/icp-logo.svg"
                  className="h-[22px] w-[22px] md:h-7 md:w-7"
                />
                USDC
              </div>
              <div className="font-semibold">
                <p className="text-xl md:text-2xl">1234.55</p>
                <p className="text-xs text-white/50 md:text-sm">USDC = 1 ETH</p>
              </div>
            </div>
            <div
              className={cn(
                'relative isolate',
                'bg-[linear-gradient(to_bottom,#242424_0%,#2121214D_100%)]',
                'px-8 py-6',
                'rounded-[28px] backdrop-blur-[30px]',
                'border-2 border-[#4C4C4C]/30',
              )}
            >
              <div
                className={cn('flex items-center gap-1.5', 'font-semibold md:text-[21px]', 'mb-10')}
              >
                <Avatar
                  // src={token?.logo}
                  src="/images/logo/icp-logo.svg"
                  className="h-[22px] w-[22px] md:h-7 md:w-7"
                />
                USDC
              </div>
              <div className="font-semibold">
                <p className="text-xl md:text-2xl">1234.55</p>
                <p className="text-xs text-white/50 md:text-sm">USDC = 1 ETH</p>
              </div>
            </div>
          </div>
        </div>
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
          Review
        </button>
      </div>
    </div>
  );
}
