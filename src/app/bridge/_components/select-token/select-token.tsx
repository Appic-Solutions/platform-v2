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
import { TokenType, useBridgeActions, useBridgeStore } from '../../_store';
import { useActionButtonText, useCheckWalletConnectStatus, useStepChange, useSwapTokens } from '../../_logic/hooks';
import { useAuth } from '@nfid/identitykit/react';
import { useAppKit } from '@reown/appkit/react';

interface SelectTokenProps {
  isPendingBridgeOptions: boolean;
}

export default function BridgeSelectTokenPage({ isPendingBridgeOptions }: SelectTokenProps) {
  const [showWalletAddress, setShowWalletAddress] = useState(false);
  const [toWalletValidationError, setToWalletValidationError] = useState<string | null>(null);
  const { connect: openIcpModal } = useAuth();
  const { open: openEvmModal } = useAppKit();

  // store
  const { fromToken, toToken, selectedOption, amount, toWalletAddress } = useBridgeStore();
  const { setSelectedTokenType, setToWalletAddress } = useBridgeActions();

  const handleStepChange = useStepChange();
  const swapTokensHandler = useSwapTokens();
  const checkIsWalletConnected = useCheckWalletConnectStatus();
  const actionButtonTextHandler = useActionButtonText();

  const isActionButtonDisable = () => {
    if (!selectedOption || !fromToken || !toToken) return true;
    if (showWalletAddress && (toWalletValidationError || !toWalletAddress)) return true;
    if (fromToken.contractAddress === toToken.contractAddress && fromToken.chainId === toToken.chainId) return true;

    if (!Number(amount)) return true;

    return false;
  };

  const openConnectWalletModalHandler = (token: TokenType) => {
    if (token?.chain_type === 'ICP') {
      return openIcpModal();
    }
    if (token?.chain_type === 'EVM') {
      return openEvmModal();
    }
  };

  const actionButtonHandler = () => {
    if (!checkIsWalletConnected('from') && fromToken && !showWalletAddress) {
      openConnectWalletModalHandler(fromToken);
      return;
    }
    if (!checkIsWalletConnected('to') && toToken && !showWalletAddress) {
      openConnectWalletModalHandler(toToken);
      return;
    }

    if (
      checkIsWalletConnected('from') &&
      (checkIsWalletConnected('to') || (toWalletAddress && !toWalletValidationError))
    ) {
      handleStepChange(3);
    }
  };

  return (
    <Box
      className={cn(
        'flex flex-col gap-4 h-full md:h-fit',
        'md:px-[65px] md:py-[55px] md:max-w-[617px]',
        'overflow-x-hidden',
        'transition-[max-height] duration-300 ease-in-out',
        amount && Number(amount) > 0 && 'lg:max-w-[1060px]',
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
            <ActionButton onClick={actionButtonHandler} isDisabled={isActionButtonDisable()}>
              {actionButtonTextHandler({
                showWalletAddress,
                toWalletAddress,
                toWalletValidationError,
              })}
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
        {toToken && Number(amount) > 0 && <BridgeOptionsList isPending={isPendingBridgeOptions} />}
      </div>
      {/* MOBILE ACTION BUTTONS */}
      <div className={cn('flex items-center gap-x-2 w-full', 'lg:hidden')}>
        <ActionButton onClick={actionButtonHandler} isDisabled={isActionButtonDisable()}>
          {actionButtonTextHandler({
            showWalletAddress,
            toWalletAddress,
            toWalletValidationError,
          })}
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

// TODO: move logics into separate file, change bridge review page details, connect api s
