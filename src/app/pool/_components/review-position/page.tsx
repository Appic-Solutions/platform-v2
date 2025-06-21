import { Avatar } from '@/components/common/ui/avatar';
import { InfoCircleIcon } from '@/components/icons';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';

export default function ReviewPositionPage() {
  return (
    <Box
      className={cn(
        'gap-x-16 gap-y-10 md:flex-row',
        'md:w-[1204px]',
        'md:p-12',
        'text-white md:text-black md:dark:text-white',
      )}
    >
      <div>
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
        <div
          className={cn(
            'flex flex-col gap-y-2.5 md:gap-y-5',
            'bg-[#222222]',
            'rounded-[21px]',
            'px-6 py-5 md:px-8 md:py-6',
            'w-full',
          )}
        >
          <div className="flex">
            <InfoCircleIcon />
            Create new pool
          </div>
          <p>
            Choose the tokens you want to provide liquidity for. You can select tokens on all
            supported networks.. Choose the tokens you want to provide liquidity for. You can select
            tokens on all supported networks.
          </p>
        </div>
        <div>
          <p>Set initial price</p>
          <p>
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
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <p>initial price</p>
              <div className="flex">
                <div className="flex">
                  <Avatar
                    // src={token?.logo}
                    src="/images/logo/icp-logo.svg"
                    className="h-4 w-4"
                  />
                  USDC
                </div>
                <div className="flex">
                  <Avatar
                    // src={token?.logo}
                    src="/images/logo/icp-logo.svg"
                    className="h-4 w-4"
                  />
                  USDC
                </div>
              </div>
            </div>
            <div>
              <p>1234.55</p>
              <p>1 USDC = 1 ETH</p>
            </div>
          </div>
        </div>
        <div
          className={cn(
            'flex flex-col gap-y-2.5 md:flex-row md:gap-y-5',
            'bg-[#222222]',
            'rounded-[21px]',
            'px-6 py-5 md:px-8 md:py-6',
            'w-full',
          )}
        >
          <p>Market price: 0 ICP = 1 ETH (-)</p>
          <p>Use market price</p>
        </div>
      </div>
      <div>
        <div>
          <p>Set price range</p>
          <div className="flex">
            <div
              className={cn(
                'relative isolate',
                'bg-[linear-gradient(to_bottom,#242424_0%,#2121214D_100%)]',
                'px-8 py-6',
                'rounded-[28px] backdrop-blur-[30px]',
                'border-2 border-[#4C4C4C]/30',
              )}
            >
              <p>Min price</p>
              <div>
                <p>1234.55</p>
                <p>USDC = 1 ETH</p>
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
              <p>Max price</p>
              <div>
                <p>1234.55</p>
                <p>USDC = 1 ETH</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p>Deposit tokens</p>
          <p>
            The amount earned providing liquidity. Choose an amount that suits your risk tolerance
            and strategy.
          </p>
          <div className="flex">
            <div
              className={cn(
                'relative isolate',
                'bg-[linear-gradient(to_bottom,#242424_0%,#2121214D_100%)]',
                'px-8 py-6',
                'rounded-[28px] backdrop-blur-[30px]',
                'border-2 border-[#4C4C4C]/30',
              )}
            >
              <div className="flex">
                <Avatar
                  // src={token?.logo}
                  src="/images/logo/icp-logo.svg"
                  className="h-[22px] w-[22px] md:h-7 md:w-7"
                />
                USDC
              </div>
              <div>
                <p>1234.55</p>
                <p>USDC = 1 ETH</p>
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
              <div className="flex">
                <Avatar
                  // src={token?.logo}
                  src="/images/logo/icp-logo.svg"
                  className="h-[22px] w-[22px] md:h-7 md:w-7"
                />
                USDC
              </div>
              <div>
                <p>1234.55</p>
                <p>USDC = 1 ETH</p>
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
    </Box>
  );
}
