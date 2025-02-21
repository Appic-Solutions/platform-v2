import { IcpToken } from '@/blockchain_api/types/tokens';
import { cn } from '@/common/helpers/utils';
import React, { useState } from 'react';
import Box from '@/common/components/ui/box';
import Link from 'next/link';
import HistoryIcon from '@/common/components/icons/history';
import { TokenCard } from './_components/TokenCard';
import { ArrowsUpDownIcon } from '@/common/components/icons';
import AutoInvestReview from './_components/AutoInvestReview';
import InvestPeriod from './_components/InvestPeriod';
import InvestRepeat from './_components/InvestRepeat';
import { format } from 'date-fns';

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
        'flex flex-col gap-4 h-full md:min-h-[10vh]',
        'md:px-[65px] md:py-[55px] md:max-w-[617px]',
        'overflow-x-hidden',
        'transition-[max-height] duration-300 ease-in-out',
        showDetails && 'lg:max-w-[1200px]',
      )}
    >
      <div className="flex items-center justify-between w-full mb-5 text-white md:text-black md:dark:text-white">
        <div className="flex items-center w-full justify-between text-[26px] leading-7 md:text-[40px] md:leading-10 font-bold gap-x-16">
          <h1 className="w-full">Auto Invest</h1>
          {showDetails && <h2 className="w-full hidden lg:block">Details</h2>}
        </div>
        <Link href="/transactions-history/auto-invest" className="flex items-center gap-x-2 text-sm">
          <HistoryIcon width={20} height={20} />
          History
        </Link>
      </div>
      <div className="flex flex-col gap-x-16 flex-1 justify-between lg:flex-row lg:overflow-hidden w-full">
        {/* TOKENS */}
        <div
          className={cn(
            'flex flex-col justify-between h-full items-center gap-y-4 w-full lg:max-w-[482px] md:overflow-y-hidden',
            showDetails && 'hidden lg:flex',
          )}
        >
          <div className="flex flex-col gap-y-8 md:gap-y-4 w-full h-full">
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
                  'absolute rounded-full w-12 h-12 md:w-14 md:h-14 z-20 cursor-pointer group',
                  'top-1/2 -translate-y-1/2 right-4 -translate-x-1/2',
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
            <div className="text-white flex flex-col gap-y-8 md:gap-y-4">
              <p className="text-[28px] font-bold hidden md:block text-black dark:text-white">Recurrence</p>
              <InvestPeriod
                investmentPeriod={investmentPeriod}
                setRepeatCountHandle={setRepeatCountHandle}
                cycleOptions={cycleOptions}
                selectedCycle={selectedCycle}
                setSelectedCycle={setSelectedCycle}
              />
              <div className={cn('flex flex-col gap-y-8', 'md:flex-row md:items-start md:gap-x-8')}>
                <InvestRepeat repeatOn={repeatOn} setRepeatOn={setRepeatOn} selectedCycle={selectedCycle} date={date} />
                <div className="flex-col gap-y-2 flex md:hidden">
                  <p className="text-[18px] text-black dark:text-white">Ends On</p>
                  <div className="text-primary font-light text-md">{format(date, 'PP')}</div>
                </div>
              </div>
            </div>
          </div>
          {/* DESKTOP ACTION BUTTONS */}
          <div className={cn('flex items-center gap-x-2 w-full', 'max-lg:hidden')}>
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
      <div className={cn('flex items-center gap-x-2 w-full', 'lg:hidden')}>
        <button onClick={() => setShowDetails(true)} disabled={disabled()}>
          {getButtonText()}
        </button>
      </div>
    </Box>
  );
};

export default AutoInvestSelectToken;
