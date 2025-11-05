import React from 'react';
import { cn } from '@/lib/utils';
import BigNumber from 'bignumber.js';

interface Props {
  userTokenBalance: string | undefined;
  onMaxClick: (amount: string) => void;
  isDisabled?: boolean;
}

const SetUserWalletBalanceButton = ({
  userTokenBalance,
  onMaxClick,
  isDisabled = false,
}: Props) => {
  return (
    <div className="flex w-max items-center justify-between gap-1.5">
      <span className="text-ellipsis text-sm font-semibold text-white/50">
        {(userTokenBalance &&
          parseFloat(userTokenBalance)
            .toFixed(6)
            .replace(/\.?0+$/, '')) ||
          0}{' '}
      </span>
      <button
        disabled={!userTokenBalance || isDisabled}
        className={cn(
          'bg-[#2060D5]/45',
          'text-[9px] font-thin text-[#A7C6FF] md:text-xs',
          'h-[18px] w-9 lg:h-5 lg:w-12',
          'rounded-[10px] md:rounded-[16px]',
          'flex cursor-pointer items-center justify-center',
          'disabled:cursor-not-allowed disabled:opacity-30',
        )}
        onClick={() => {
          if (userTokenBalance && Number(userTokenBalance) > 0) {
            const formattedBalance = new BigNumber(userTokenBalance)
              .decimalPlaces(6, BigNumber.ROUND_DOWN)
              .toFixed();
            onMaxClick(formattedBalance);
          } else {
            onMaxClick('0');
          }
        }}
      >
        Max
      </button>
    </div>
  );
};

export default SetUserWalletBalanceButton;
