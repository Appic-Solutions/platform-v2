import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { cn, formatToSignificantFigures } from '@/lib/utils';
import Image from 'next/image';
import { ClockIcon, FireIcon } from '@/components/icons';

import { useSwapActions, useSwapStore } from '@/app/swap/_store';
import { RadialCountDown } from './radial-count-down';
import SwapQuoteSkeleton from './swap-quote-skeleton';
import { useQuery } from '@tanstack/react-query';
import { fetchICPQuote } from '@/blockchain_api/quoter/icp';
import { IcpToken } from '@/blockchain_api/types/tokens';

const SwapQuotesList = () => {
  const { tokenOut, swapQuote, tokenIn, amount } = useSwapStore();
  const { setSwapQuote } = useSwapActions();
  const refetchDuration = 5000;

  const { data: swapQuoteData, isPending } = useQuery({
    queryKey: ['swap-quot'],
    // TODO: When Evm to Evm and Evm to Icp swap developed, this type assertions
    queryFn: () => fetchICPQuote(tokenIn as IcpToken, tokenOut as IcpToken, amount),
    enabled: !!tokenIn && !!tokenOut && !!amount,
    refetchInterval: refetchDuration,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (swapQuoteData && swapQuoteData.data) {
      console.log('swapQuoteData', swapQuoteData);
      setSwapQuote({ message: '', quote: swapQuoteData.data });
    }
  }, [swapQuoteData]);

  return (
    <div className="flex animate-slide-in flex-col items-start opacity-0 md:pr-2 lg:w-full">
      <p className="mb-5 text-[26px] font-bold leading-7 text-primary md:hidden md:text-[40px] md:leading-10">
        Swap Options
      </p>
      <div
        className={cn(
          'flex w-full gap-4 lg:flex-col',
          'lg:h-full',
          'overflow-x-auto lg:overflow-y-auto',
          'hide-scrollbar',
        )}
      >
        <div className={cn('flex-shrink-1 h-fit w-full')}>
          {tokenOut && swapQuote.quote ? (
            <Card
              // onClick={() => handleQuoteSelect(quote)}
              className={cn(
                'w-full flex-col items-start justify-between gap-3 overflow-hidden rounded-[20px] border !py-4 px-4',
                'md:rounded-[36px] md:px-6',
                'transition duration-300',
                'cursor-pointer',
                'border-blue-600 bg-highlighted-card',
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
                <RadialCountDown duration={refetchDuration} isPending={isPending} />
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
                  <p
                    className={cn(
                      'text-base lg:text-xl',
                      swapQuote.quote.amountOut.length > 7 && 'w-fit text-ellipsis md:w-48',
                    )}
                  >
                    ~{' '}
                    {formatToSignificantFigures(swapQuote.quote.amountOut) + ' ' + tokenOut.symbol}
                  </p>
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
                  <p className="text-xs font-thin text-primary">
                    {/* TODO: Replace time */} DURATION HERE
                  </p>
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
                    {/* TODO: remove network fee if don't need to it */}
                    {/* <div className="flex justify-between text-sm">
													<span className="text-muted">Network Fee:</span>
													<span>
														~{' '}
														{formatToSignificantFigures(swapQuote.quote.fees.human_readable_max_network_fee) +
															' ' +
															swapQuote.quote.fees.native_fee_token_symbol}
													</span>
												</div> */}
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
          ) : (
            <SwapQuoteSkeleton />
          )}
        </div>
      </div>
    </div>
  );
};

export default SwapQuotesList;
