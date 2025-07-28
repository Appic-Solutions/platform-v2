import React from 'react';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { cn } from '@/lib/utils';
import { useCreatePosition } from '@/app/positions/create/_context/CreatePositionContext';
import BigNumber from 'bignumber.js';

interface Props {
  userTokenBalance: string | undefined;
  token: IcpToken;
  isAmountZero: boolean;
}

const SetUserWalletBalanceButton = ({ userTokenBalance, token, isAmountZero }: Props) => {
  const { handleDepositAmountInput } = useCreatePosition();

  return (
    <div className="flex w-full items-center justify-between gap-1.5">
      <span className="text-sm font-semibold text-white/50">
        {userTokenBalance ?? '0'} {token.symbol}
      </span>
      <button
        disabled={!userTokenBalance}
        className={cn(
          'bg-[#2060D5]/45',
          'text-xs font-medium text-[#A7C6FF] md:text-sm',
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
            handleDepositAmountInput({
              amount: formattedBalance,
              isAmountZero: isAmountZero,
            });
          } else {
            handleDepositAmountInput({
              amount: '0',
              isAmountZero: isAmountZero,
            });
          }
        }}
      >
        Max
      </button>
    </div>
  );
};

export default SetUserWalletBalanceButton;
