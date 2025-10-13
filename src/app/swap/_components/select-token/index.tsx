import { ArrowsUpDownIcon, WalletIcon } from '@/components/icons';
import Box from '@/components/ui/box';
import { cn, getChainLogo } from '@/lib/utils';
import HistoryIcon from '@/components/icons/history';
import Link from 'next/link';
import { TokenCard } from './token-card';
import AmountInput from './amount-input';
import WalletAddressInput from './wallet-address-input';
import ActionButton from './action-button';
import { SwapQuote } from './swap-quote';
import { useSwapSelectTokenLogic } from './_logic/use-select-token-logic';
import { useSwapActions, useSwapStore } from '../../_store';
import { useQuery } from '@tanstack/react-query';
import { fetchICPQuote } from '@/blockchain_api/quoter/icp';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { useEffect } from 'react';
import { useToast } from '@/lib/hooks/use-toast';
import BigNumber from 'bignumber.js';
import { fetchCrossChainQuote } from '@/blockchain_api/quoter/cross-chain';
import { fetchSameChainQuote } from '@/blockchain_api/quoter/same-chain';
import { notification } from '@/components/common/ui/toast/notification';

export default function SwapSelectTokenPage() {
  const { tokenIn, tokenOut, amount, toWalletAddress, toWalletValidationError, swapQuote } =
    useSwapStore();
  const { setSelectedTokenType, setToWalletAddress, setToWalletValidationError, setSwapQuote } =
    useSwapActions();
  const {
    changeStep,
    swapTokens,
    showWalletAddress,
    setShowWalletAddress,
    actionButtonHandler,
    actionButtonStatus,
    nativeToken,
  } = useSwapSelectTokenLogic();

  const getQuote = async () => {
    let response;

    if (tokenIn?.chain_type === 'ICP' && tokenOut?.chain_type === 'ICP') {
      response = await fetchICPQuote(tokenIn as IcpToken, tokenOut as IcpToken, amount);
      return response;
    } else if (tokenIn?.chainId === tokenOut?.chainId && nativeToken) {
      response = await fetchSameChainQuote({
        amount,
        tokenIn: tokenIn as EvmToken,
        tokenOut: tokenOut as EvmToken,
        nativeToken: nativeToken,
      });
    } else {
      response = await fetchCrossChainQuote({
        amount,
        tokenIn: tokenIn as IcpToken | EvmToken,
        tokenOut: tokenOut as IcpToken | EvmToken,
        nativeToken,
      });
    }
    return response;
  };

  const {
    data: swapQuoteData,
    isSuccess,
    isError,
    isFetched,
    refetch,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['swap-quot', tokenIn, tokenOut, amount],
    queryFn: () => getQuote(),
    enabled: !!tokenIn && !!tokenOut && !!amount && !isNaN(Number(amount)) && Number(amount) > 0,
    refetchInterval: 20000,
  });

  useEffect(() => {
    if (!isFetched || !(Number(amount) > 0) || isNaN(Number(amount))) return;
    console.log({ swapQuoteData });
    if (
      isSuccess &&
      swapQuoteData?.result &&
      swapQuoteData.success &&
      !BigNumber(swapQuoteData.result.amountOut).isNegative()
    ) {
      setSwapQuote(swapQuoteData.result);
    } else if (
      swapQuoteData &&
      swapQuoteData.result &&
      BigNumber(swapQuoteData.result.amountOut).isNegative()
    ) {
      setSwapQuote(undefined);
      notification({
        message: 'Amount too low',
        type: 'error',
      });
    } else {
      setSwapQuote(undefined);
      notification({
        message: 'No route found for selected tokens',
        type: 'error',
      });
    }
  }, [isFetched, isSuccess, swapQuoteData, setSwapQuote]);

  useEffect(() => {
    if (isError) {
      notification({
        message: 'Failed to fetch quote',
        type: 'error',
      });
    }
  }, [isError]);

  useEffect(() => {
    if (amount) {
      refetch();
    }
  }, [amount, tokenIn, tokenOut]);

  return (
    <Box
      className={cn(
        'flex h-full flex-col gap-6 md:h-fit',
        'md:w-full md:max-w-[537px]',
        'overflow-x-hidden lg:overflow-x-hidden',
        'transition-[max-height] duration-300 ease-in-out',
        Number(amount) > 0 && (swapQuote || isLoading || isFetching)
          ? 'lg:w-[1060px] lg:max-w-[1060px]'
          : '',
        showWalletAddress ? 'lg:max-h-[780px]' : 'lg:max-h-[600px]',
      )}
    >
      <div className="flex w-full items-center justify-between text-white md:text-black md:dark:text-white">
        <h1 className="text-2xl font-bold md:text-3xl">Swap</h1>
        <Link href="/transactions-history/dex" className="flex items-center gap-x-2 text-sm">
          <HistoryIcon width={20} height={20} />
          History
        </Link>
      </div>

      <div className="flex w-full flex-1 flex-col justify-between gap-x-4 gap-y-6 lg:flex-row lg:overflow-hidden">
        {/* TOKENS AND AMOUNT INPUT */}
        <div className="flex h-full w-full flex-col items-center justify-between gap-y-4 md:overflow-hidden lg:max-w-[482px]">
          <div className="flex h-full w-full flex-col justify-between">
            {/* TOKENS */}
            <div
              className={cn(
                'relative flex w-full',
                tokenIn && tokenOut
                  ? 'flex-col gap-y-4 sm:flex-row sm:gap-x-4'
                  : 'flex-col gap-y-4',
              )}
            >
              <TokenCard
                token={tokenIn}
                customOnClick={() => {
                  setSelectedTokenType('in');
                  changeStep('next');
                }}
                label="Sell"
                className={cn(
                  tokenIn &&
                    tokenOut &&
                    'max-h-min py-5 md:max-h-min md:rounded-3xl md:px-6 md:py-5',
                )}
              />
              <div
                className={cn(
                  'group absolute inset-0 z-20 m-auto h-10 w-10 cursor-pointer rounded-full',
                  'flex items-center justify-center',
                  'bg-[#C0C0C0] text-black dark:bg-[#0B0B0B] dark:text-white',
                  'border-2 border-white dark:border-white/30',
                  'transition-transform duration-300',
                  tokenIn && tokenOut
                    ? 'hover:rotate-180 sm:rotate-90 sm:hover:-rotate-90'
                    : 'hover:rotate-180',
                )}
                onClick={swapTokens}
              >
                <ArrowsUpDownIcon width={20} height={20} />
              </div>
              <TokenCard
                token={tokenOut}
                customOnClick={() => {
                  setSelectedTokenType('out');
                  changeStep('next');
                }}
                label="Buy"
                className={cn(
                  tokenIn &&
                    tokenOut &&
                    'max-h-min py-5 md:max-h-min md:rounded-3xl md:px-6 md:py-5',
                )}
              />
            </div>
            {/* AMOUNT INPUT */}
            {tokenIn && tokenOut && <AmountInput />}
            {/* WALLET ADDRESS INPUT */}
            <WalletAddressInput
              token={tokenOut}
              address={toWalletAddress}
              setAddress={setToWalletAddress}
              validationError={toWalletValidationError}
              onValidationError={setToWalletValidationError}
              show={showWalletAddress}
              avatar={getChainLogo(tokenOut?.chainId)}
            />
          </div>
          {/* DESKTOP ACTION BUTTONS */}
          <div className={cn('flex w-full items-center gap-x-2', 'max-lg:hidden')}>
            <ActionButton onClick={actionButtonHandler} isDisabled={actionButtonStatus.isDisable}>
              {actionButtonStatus.text}
            </ActionButton>
            <div
              onClick={() => setShowWalletAddress(!showWalletAddress)}
              className={cn(
                'flex min-h-12 min-w-12 items-center justify-center rounded-full px-4',
                'cursor-pointer transition-colors duration-300',
                'bg-primary-buttons hover:opacity-85',
                'transition-all ease-in-out',
              )}
            >
              <WalletIcon className="text-white" />
            </div>
          </div>
        </div>

        {Number(amount) > 0 && (swapQuote || isLoading || isFetching) ? (
          <SwapQuote isLoading={isLoading || isFetching} />
        ) : null}
      </div>
      {/* MOBILE ACTION BUTTONS */}
      <div className="flex w-full items-center gap-x-2 lg:hidden">
        <ActionButton onClick={actionButtonHandler} isDisabled={actionButtonStatus.isDisable}>
          {actionButtonStatus.text}
        </ActionButton>
        <div
          onClick={() => setShowWalletAddress(!showWalletAddress)}
          className={cn(
            'flex min-h-12 min-w-12 items-center justify-center rounded-full px-4',
            'cursor-pointer transition-colors duration-300',
            'bg-primary-buttons hover:opacity-90',
            'transition-all ease-out',
          )}
        >
          <WalletIcon className="text-white" />
        </div>
      </div>
    </Box>
  );
}
