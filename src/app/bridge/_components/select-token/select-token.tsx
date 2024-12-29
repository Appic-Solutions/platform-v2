import { ArrowsUpDownIcon } from '@/common/components/icons';
import Box from '@/common/components/ui/box';
import { cn, getChainLogo } from '@/common/helpers/utils';
import { TokenCard } from './_components/TokenCard';
import AmountInput from './_components/AmountInput';
import { useState } from 'react';
import ActionButton from './_components/ActionButton';
import BridgeOptionsList from './_components/BridgeOptionsList';
import WalletIcon from '@/common/components/icons/wallet';
import WalletAddressInput from './_components/WalletAddressInput';
import HistoryIcon from '@/common/components/icons/history';
import Link from 'next/link';
import { useBridgeActions, useBridgeStore } from '../../_store';
import { useStepChange, useSwapTokens } from '../../_logic/hooks';
import { useSharedStore } from '@/common/state/store';

interface SelectTokenProps {
  isPendingBridgeOptions: boolean;
  isErrorBridgeOptions: boolean;
}

export default function BridgeSelectTokenPage({ isPendingBridgeOptions, isErrorBridgeOptions }: SelectTokenProps) {
  const [usdPrice, setUsdPrice] = useState('0');
  const [showWalletAddress, setShowWalletAddress] = useState(false);
  const [toWalletAddress, setToWalletAddress] = useState('');
  const [toWalletValidationError, setToWalletValidationError] = useState<string | null>(null);

  // store
  const { fromToken, toToken, selectedOption, amount, bridgeOptions } = useBridgeStore();
  const { setSelectedOption, setAmount, setSelectedTokenType } = useBridgeActions();
  const { isEvmConnected, authenticatedAgent } = useSharedStore();

  const handleStepChange = useStepChange();
  const swapTokensHandler = useSwapTokens();

  const disabled = () => {
    if (!selectedOption) return true;
    if (!fromToken || !toToken) return true;
    if (fromToken.contractAddress === toToken.contractAddress && fromToken.chainId === toToken.chainId) return true;

    if (!selectedOption || !Number(amount)) return true;

    const isSourceWalletConnected = fromToken.chain_type === 'EVM' ? isEvmConnected : authenticatedAgent;

    const isDestWalletValid = toWalletAddress && !toWalletValidationError;
    const isDestWalletConnected = toToken.chain_type === 'EVM' ? isEvmConnected : authenticatedAgent;

    if (!isSourceWalletConnected || !(isDestWalletConnected || isDestWalletValid)) return true;

    return false;
  };

  const getButtonText = () => {
    if (
      fromToken &&
      toToken &&
      fromToken.contractAddress === toToken.contractAddress &&
      fromToken.chainId === toToken.chainId
    ) {
      return 'Please select different tokens';
    }

    if (!selectedOption || !Number(amount)) {
      if (!selectedOption) return 'Select Bridge Option';
      return 'Fill Amount Field';
    }

    const isSourceWalletDisconnected =
      (fromToken?.chain_type === 'EVM' && !isEvmConnected) || (fromToken?.chain_type === 'ICP' && !authenticatedAgent);
    if (isSourceWalletDisconnected) {
      return 'Connect Source Wallet';
    }

    if (showWalletAddress) {
      return !toWalletAddress || toWalletValidationError ? 'Enter Valid Address' : 'Confirm';
    }

    const isDestWalletValid = toWalletAddress && !toWalletValidationError;
    if (isDestWalletValid) {
      return 'Confirm';
    }

    const isDestWalletDisconnected =
      (toToken?.chain_type === 'EVM' && !isEvmConnected) || (toToken?.chain_type === 'ICP' && !authenticatedAgent);
    return isDestWalletDisconnected ? 'Connect Destination Wallet' : 'Confirm';
  };

  return (
    <Box
      className={cn(
        'flex flex-col gap-4 h-full md:h-fit ',
        'md:px-[65px] md:py-[55px] md:max-w-[617px]',
        'overflow-x-hidden',
        'transition-[max-height] duration-300 ease-in-out',
        amount && Number(amount) > 0 && 'lg:max-w-[1060px]',
        showWalletAddress ? 'lg:max-h-[780px]' : 'lg:max-h-[600px]',
      )}
    >
      <div className="flex items-center justify-between w-full mb-5 text-white md:text-black md:dark:text-white">
        <h1 className="text-[26px] leading-7 md:text-[40px] md:leading-10 font-bold">Bridge</h1>
        <Link href="/transactions-history#bridge" className="flex items-center gap-x-2 text-sm">
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
                  handleStepChange('next');
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
                onClick={swapTokensHandler}
              >
                <ArrowsUpDownIcon width={24} height={24} />
              </div>
              <TokenCard
                token={toToken}
                customOnClick={() => {
                  setSelectedTokenType('to');
                  handleStepChange('next');
                }}
                label="To"
                className={cn(
                  toToken && 'py-5 md:py-5 md:rounded-3xl',
                  fromToken && toToken && 'max-h-min md:max-h-min md:px-6',
                )}
              />
            </div>
            {/* AMOUNT INPUT */}
            {fromToken && toToken && (
              <AmountInput
                token={fromToken}
                amount={amount}
                setAmount={setAmount}
                usdPrice={usdPrice}
                setUsdPrice={setUsdPrice}
                isWalletConnected={(() => {
                  if (fromToken.chain_type === 'EVM' && isEvmConnected) return true;
                  if (fromToken.chain_type === 'ICP' && authenticatedAgent) return true;
                  return false;
                })()}
              />
            )}
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
            <ActionButton onClick={() => handleStepChange(3)} isDisabled={disabled()}>
              {getButtonText()}
            </ActionButton>
            <div
              onClick={() => setShowWalletAddress(!showWalletAddress)}
              className={cn(
                'rounded-full bg-primary-buttons bg-opacity-20 flex items-center justify-center px-4 h-full',
                'transition-colors duration-300 cursor-pointer',
              )}
            >
              <WalletIcon className="text-white" />
            </div>
          </div>
        </div>

        {/* BRIDGE OPTIONS */}
        {toToken && Number(amount) > 0 && (
          <BridgeOptionsList
            bridgeOptions={bridgeOptions}
            selectedOption={selectedOption}
            handleOptionSelect={setSelectedOption}
            isError={isErrorBridgeOptions}
            isPending={isPendingBridgeOptions}
            toTokenLogo={toToken.logo}
          />
        )}
      </div>
      {/* MOBILE ACTION BUTTONS */}
      <div className={cn('flex items-center gap-x-2 w-full', 'lg:hidden')}>
        <ActionButton onClick={() => handleStepChange(3)} isDisabled={disabled()}>
          {getButtonText()}
        </ActionButton>
        <div
          onClick={() => setShowWalletAddress(!showWalletAddress)}
          className={cn(
            'rounded-full bg-primary-buttons bg-opacity-20 flex items-center justify-center px-4 h-full',
            'transition-colors duration-300 cursor-pointer',
          )}
        >
          <WalletIcon className="text-white" />
        </div>
      </div>
    </Box>
  );
}
