import { IcpToken } from '@/blockchain_api/types/tokens';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import Box from '@/components/ui/box';
import Link from 'next/link';
import HistoryIcon from '@/components/icons/history';
import { ArrowsUpDownIcon } from '@/components/icons';

import { format } from 'date-fns';
import { TokenCard } from './TokenCard';
import InvestPeriod from './InvestPeriod';
import InvestRepeat from './InvestRepeat';
import AutoInvestReview from './AutoInvestReview';

interface AutoInvestSelectTokenProps {
  stepHandler: (value: 'next' | 'prev' | number) => void;
  setSelectedType: (type: 'buy' | 'sell') => void;
  fromToken: IcpToken | null;
  toToken: IcpToken | null;
  swapTokensHandler: () => void;
}

const cycleOptions = ['Day', 'Week', 'Month'];

const AutoInvestSelectToken = ({
  fromToken,
  setSelectedType,
  stepHandler,
  swapTokensHandler,
  toToken,
}: AutoInvestSelectTokenProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [date] = useState<Date>(new Date());
  const [selectedCycle, setSelectedCycle] = useState<string>(cycleOptions[0]);
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(1);
  const [repeatOn, setRepeatOn] = useState<number>(1);

  const disabled = () => {
    if (!fromToken || !toToken) return true;
    // if (
    //   fromToken.contractAddress === toToken.contractAddress &&
    //   fromToken.chainId === toToken.chainId
    // )
    // return true;

    return false;
  };

  const getButtonText = () => {
    // if (
    //   fromToken &&
    //   toToken &&
    //   fromToken.contractAddress === toToken.contractAddress &&
    //   fromToken.chainId === toToken.chainId
    // ) {
    //   return "Please select different tokens";
    // }
    if (fromToken && toToken && showDetails) return 'Set Auto Invest';
    else return 'View Details ';
  };

  const setRepeatCountHandle = (type: 'add' | 'sub') => {
    if (type === 'add') {
      setInvestmentPeriod(investmentPeriod + 1);
    } else {
      if (investmentPeriod === 1) return;
      setInvestmentPeriod(investmentPeriod - 1);
    }
  };

  return (
    <Box
      className={cn(
        'flex h-full flex-col gap-4 md:min-h-[10vh]',
        'md:max-w-[537px] md:px-[65px] md:py-[55px]',
        'overflow-x-hidden',
        'transition-[max-height] duration-300 ease-in-out',
        showDetails && 'lg:max-w-[1200px]',
      )}
    >
      <div className="mb-5 flex w-full items-center justify-between text-white md:text-black md:dark:text-white">
        <div className="flex w-full items-center justify-between gap-x-16 text-[26px] font-bold leading-7 md:text-[40px] md:leading-10">
          <h1 className="w-full">Auto Invest</h1>
          {showDetails && <h2 className="hidden w-full lg:block">Details</h2>}
        </div>
        <Link
          href="/transactions-history/auto-invest"
          className="flex items-center gap-x-2 text-sm"
        >
          <HistoryIcon width={20} height={20} />
          History
        </Link>
      </div>
      <div className="flex w-full flex-1 flex-col justify-between gap-x-16 lg:flex-row lg:overflow-hidden">
        {/* TOKENS */}
        <div
          className={cn(
            'flex h-full w-full flex-col items-center justify-between gap-y-4 md:overflow-y-hidden lg:max-w-[482px]',
            showDetails && 'hidden lg:flex',
          )}
        >
          <div className="flex h-full w-full flex-col gap-y-8 md:gap-y-4">
            {/* TOKENS */}
            <div className="relative flex w-full flex-col gap-y-4">
              <TokenCard
                token={fromToken}
                customOnClick={() => {
                  setSelectedType('sell');
                  stepHandler('next');
                }}
                label="Sell"
              />
              <div
                className={cn(
                  'group absolute z-20 h-12 w-12 cursor-pointer rounded-full md:h-14 md:w-14',
                  'right-4 top-1/2 -translate-x-1/2 -translate-y-1/2',
                  'flex items-center justify-center',
                  'bg-[#C0C0C0] text-black dark:bg-[#0B0B0B] dark:text-white',
                  'border-2 border-white dark:border-white/30',
                  'transition-transform duration-300',
                  'hover:rotate-180',
                )}
                onClick={swapTokensHandler}
              >
                <ArrowsUpDownIcon width={24} height={24} />
              </div>
              <TokenCard
                token={toToken}
                customOnClick={() => {
                  setSelectedType('buy');
                  stepHandler('next');
                }}
                label="Buy"
              />
            </div>
            <div className="flex flex-col gap-y-8 text-white md:gap-y-4">
              <p className="hidden text-[28px] font-bold text-black dark:text-white md:block">
                Recurrence
              </p>
              <InvestPeriod
                investmentPeriod={investmentPeriod}
                setRepeatCountHandle={setRepeatCountHandle}
                cycleOptions={cycleOptions}
                selectedCycle={selectedCycle}
                setSelectedCycle={setSelectedCycle}
              />
              <div className={cn('flex flex-col gap-y-8', 'md:flex-row md:items-start md:gap-x-8')}>
                <InvestRepeat
                  repeatOn={repeatOn}
                  setRepeatOn={setRepeatOn}
                  selectedCycle={selectedCycle}
                  date={date}
                />
                <div className="flex flex-col gap-y-2 md:hidden">
                  <p className="text-[18px] text-black dark:text-white">Ends On</p>
                  <div className="text-md font-light text-primary">{format(date, 'PP')}</div>
                </div>
              </div>
            </div>
          </div>
          {/* DESKTOP ACTION BUTTONS */}
          <div className={cn('flex w-full items-center gap-x-2', 'max-lg:hidden')}>
            <button onClick={() => setShowDetails(true)} disabled={disabled()}>
              {getButtonText()}
            </button>
          </div>
        </div>

        {/* Auto Invest Review */}
        {showDetails && (
          <AutoInvestReview
            showDetails={showDetails}
            setShowDetails={setShowDetails}
            fromToken={fromToken}
            selectedCycle={selectedCycle}
            investmentPeriod={investmentPeriod}
          />
        )}
      </div>
      {/* MOBILE ACTION BUTTONS */}
      <div className={cn('flex w-full items-center gap-x-2', 'lg:hidden')}>
        <button onClick={() => setShowDetails(true)} disabled={disabled()}>
          {getButtonText()}
        </button>
      </div>
    </Box>
  );
};

export default AutoInvestSelectToken;
