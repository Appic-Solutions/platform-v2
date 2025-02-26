import { ArrowsUpDownIcon, WalletIcon } from '@/components/icons';
import Box from '@/components/ui/box';
import { cn, getChainLogo } from '@/lib/utils';
import HistoryIcon from '@/components/icons/history';
import Link from 'next/link';
import { TokenCard } from './TokenCard';
import AmountInput from './AmountInput';
import WalletAddressInput from './WalletAddressInput';
import ActionButton from './ActionButton';
import BridgeOptionsList from './BridgeOptionsList';
import SelectTokenLogic from './_logic';
import { useBridgeActions, useBridgeStore } from '../../_store';

interface SelectTokenProps {
  isPendingBridgeOptions: boolean;
}

export default function BridgeSelectTokenPage({ isPendingBridgeOptions }: SelectTokenProps) {
  // bridge store
  const { fromToken, toToken, amount, toWalletAddress, bridgeOptions, toWalletValidationError } = useBridgeStore();
  const { setSelectedTokenType, setToWalletAddress, setToWalletValidationError } = useBridgeActions();
  // Logic
  const { changeStep, swapTokens, showWalletAddress, setShowWalletAddress, actionButtonHandler, actionButtonStatus } =
    SelectTokenLogic();

  return (
    <Box
      className={cn(
        'flex flex-col gap-4 h-full md:h-fit',
        'md:px-[65px] md:py-[55px] md:max-w-[617px]',
        'overflow-x-hidden lg:overflow-x-hidden',
        'transition-[max-height] duration-300 ease-in-out',
        Number(amount) > 0 &&
        bridgeOptions.options &&
        bridgeOptions.options.length > 0 &&
        'lg:max-w-[1060px] lg:w-[1060px]',
        showWalletAddress ? 'lg:max-h-[780px]' : 'lg:max-h-[600px]',
      )}
    >
      <div className="flex items-center justify-between w-full mb-5 text-white md:text-black md:dark:text-white">
        <h1 className="text-[26px] leading-7 md:text-[40px] md:leading-10 font-bold">Bridge</h1>
        <Link href="/transactions-history/bridge" className="flex items-center gap-x-2 text-sm">
          <HistoryIcon width={20} height={20} />
          History
        </Link>
      </div>

      <div className="flex flex-col gap-x-4 flex-1 justify-between lg:flex-row lg:overflow-hidden w-full">
        {/* TOKENS AND AMOUNT INPUT */}
        <div className="flex flex-col justify-between h-full items-center gap-y-4 w-full lg:max-w-[482px] md:overflow-hidden">
          <div className="flex flex-col gap-y-4 w-full h-full">
            {/* TOKENS */}
            <div
              className={cn(
                'relative flex w-full',
                fromToken && toToken ? 'flex-col gap-y-4 sm:flex-row sm:gap-x-4' : 'flex-col gap-y-4',
              )}
            >
              <TokenCard
                token={fromToken}
                customOnClick={() => {
                  setSelectedTokenType('from');
                  changeStep('next');
                }}
                label="From"
                className={cn(
                  fromToken && 'py-5 md:py-5 md:rounded-3xl',
                  fromToken && toToken && 'max-h-min md:max-h-min md:px-6',
                )}
              />
              <div
                className={cn(
                  'absolute rounded-full inset-0 w-12 h-12 m-auto z-20 cursor-pointer group',
                  'flex items-center justify-center',
                  'bg-[#C0C0C0] text-black dark:bg-[#0B0B0B] dark:text-white',
                  'border-2 border-white dark:border-white/30',
                  'transition-transform duration-300',
                  fromToken && toToken ? 'hover:rotate-180 sm:rotate-90 sm:hover:-rotate-90' : 'hover:rotate-180',
                )}
                onClick={swapTokens}
              >
                <ArrowsUpDownIcon width={24} height={24} />
              </div>
              <TokenCard
                token={toToken}
                customOnClick={() => {
                  setSelectedTokenType('to');
                  changeStep('next');
                }}
                label="To"
                className={cn(
                  toToken && 'py-5 md:py-5 md:rounded-3xl',
                  fromToken && toToken && 'max-h-min md:max-h-min md:px-6',
                )}
              />
            </div>
            {/* AMOUNT INPUT */}
            {fromToken && toToken && <AmountInput />}
            {/* WALLET ADDRESS INPUT */}
            <WalletAddressInput
              token={toToken}
              address={toWalletAddress}
              setAddress={setToWalletAddress}
              validationError={toWalletValidationError}
              onValidationError={setToWalletValidationError}
              show={showWalletAddress}
              avatar={getChainLogo(toToken?.chainId)}
            />
          </div>
          {/* DESKTOP ACTION BUTTONS */}
          <div className={cn('flex items-center gap-x-2 w-full', 'max-lg:hidden')}>
            <ActionButton onClick={actionButtonHandler} isDisabled={actionButtonStatus.isDisable}>
              {actionButtonStatus.text}
            </ActionButton>
            <div
              onClick={() => setShowWalletAddress(!showWalletAddress)}
              className={cn(
                'rounded-full flex items-center justify-center px-4 h-full',
                'transition-colors duration-300 cursor-pointer',
                'bg-primary-buttons hover:opacity-85',
                'transition-all ease-in-out',
              )}
            >
              <WalletIcon className="text-white" />
            </div>
          </div>
        </div>

        {/* BRIDGE OPTIONS */}
        {Number(amount) > 0 && bridgeOptions.options && bridgeOptions.options?.length > 0 && (
          <BridgeOptionsList isPending={isPendingBridgeOptions} />
        )}
      </div>
      {/* MOBILE ACTION BUTTONS */}
      <div className={cn('flex items-center gap-x-2 w-full', 'lg:hidden')}>
        <ActionButton onClick={actionButtonHandler} isDisabled={actionButtonStatus.isDisable}>
          {actionButtonStatus.text}
        </ActionButton>
        <div
          onClick={() => setShowWalletAddress(!showWalletAddress)}
          className={cn(
            'rounded-full flex items-center justify-center px-4 h-full',
            'transition-colors duration-300 cursor-pointer',
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
