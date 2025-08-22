import { Card } from '@/components/ui/card';
import { cn, formatToSignificantFigures } from '@/lib/utils';
import Image from 'next/image';
import { ClockIcon, FireIcon } from '@/components/icons';
import Box from '@/components/ui/box';
import BoxHeader from '@/components/ui/box-header';
import { useSwapActions, useSwapStore } from '../../_store';
import { DialogTrigger } from '@/components/ui/dialog';

const SwapReview = ({ onOpenModal }: { onOpenModal: () => void }) => {
  const { swapQuote, tokenOut } = useSwapStore();
  const { setActiveStep } = useSwapActions();

  if (swapQuote && swapQuote.quote && tokenOut) {
    return (
      <Box
        className={cn(
          'h-full animate-slide-in justify-normal opacity-0',
          'gap-6 md:h-[607px] md:max-w-[546px]',
        )}
      >
        <BoxHeader title="Swap Review" onBack={() => setActiveStep(1)} />
        <div className="flex h-full w-full flex-col justify-between gap-y-4">
          <Card
            className={cn(
              'min-w-[300px] flex-col items-start justify-between gap-3 overflow-hidden rounded-[20px] border !py-4 px-4',
              'md:rounded-[36px] md:px-6',
              'transition duration-300',
              'bg-highlighted-card',
              'border-blue-600',
            )}
          >
            {/* top section */}
            <div className="flex w-full items-center justify-between">
              <p
                className={cn(
                  'w-fit rounded-[10px] px-2 py-1 text-xs font-thin text-muted md:rounded-2xl md:text-sm',
                  'bg-primary-buttons text-white',
                )}
              >
                Best Return
              </p>
            </div>
            {/* middle section */}
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-x-2">
                <div className="rounded-full border-2 border-white/50 p-1 md:p-1">
                  <div className={cn('relative h-7 w-7', 'lg:h-10 lg:w-10')}>
                    <Image
                      src={tokenOut.logo}
                      alt="btc"
                      className="rounded-full object-contain"
                      fill
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <p
                    className={cn(
                      'text-lg font-semibold md:text-xl',
                      swapQuote.quote.amountOut.length > 7 && 'w-fit text-ellipsis md:w-56',
                    )}
                  >
                    ~{' '}
                    {formatToSignificantFigures(swapQuote.quote.amountOut) + ' ' + tokenOut.symbol}
                  </p>
                  <p
                    className={cn(
                      'text-xs leading-none text-muted md:text-sm',
                      swapQuote.quote.amountOut.length > 7 && 'w-fit text-ellipsis md:w-56',
                    )}
                  >
                    ~ ${swapQuote.quote.amountOutUSD}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-y-3">
                <div className="flex items-center gap-x-1 rounded-xl bg-white px-2 py-1 md:rounded-2xl md:px-4">
                  <span className={cn('text-xs text-blue-600 lg:text-sm')}>via Appic</span>
                  <Image src="images/logo/icp-logo.svg" alt="logo" width={15} height={15} />
                </div>
              </div>
            </div>
            {/* bottom section */}
            <div className="flex w-full items-end justify-end gap-x-4">
              <span className="flex w-max items-center gap-x-1">
                <p className="text-xs font-thin text-primary">
                  {/* TODO: Replace fee */}
                  FEE HERE
                  {/* ${Number(swapQuote.quote..total_fee_usd_price).toFixed(2)} */}
                </p>
                <FireIcon width={15} height={15} className="text-primary" />
              </span>
              <span className="flex w-max items-center gap-x-1">
                <p className="text-xs font-thin text-primary">{swapQuote.quote.estimatedTime}</p>
                <ClockIcon width={15} height={15} className="text-primary" />
              </span>
            </div>

            <div
              className={cn(
                'w-full border-t border-gray-200 dark:border-gray-700',
                'transform transition-all duration-300',
                'translate-y-0 pt-3 opacity-100',
              )}
            >
              <div className="space-y-3">
                <p className="text-sm font-medium">Quote Details:</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Route:</span>
                    <span>{swapQuote.quote.routeString}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Minimum Received:</span>
                    <span className="flex gap-2">
                      <span className="text-ellipsis">{swapQuote.quote.minAmountOut}</span>
                      <span>{swapQuote.quote.tokenOut.symbol}</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Network Fee:</span>
                    <span>~ $0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Estimated Time:</span>
                    <span>{swapQuote.quote.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Fee:</span>
                    <span>
                      ~ FEE HERE
                      {/* TODO: REplace fee */}
                      {/* {formatToSignificantFigures(swapQuote.quote.fees.human_readable_total_native_fee) +
																					' ' +
																					swapQuote.quote.fees.native_fee_token_symbol} */}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <DialogTrigger onClick={onOpenModal}>
            <div
              className={cn(
                'flex h-14 w-full items-center justify-center rounded-[16px] text-white',
                'bg-primary-buttons',
                'transition-all ease-in-out',
                'hover:opacity-85',
              )}
            >
              Start swapping
            </div>
          </DialogTrigger>
        </div>
      </Box>
    );
  }
};

export default SwapReview;
