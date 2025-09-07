import { usePositionDetailsStore } from '@/app/positions/_store/usePositionDetailsStore';
import SetUserWalletBalanceButton from '@/app/positions/create/_components/SetUserWalletBalanceButton';
import { FormattedPosition } from '@/app/positions/types';
import { calculate_mint_amounts } from '@/blockchain_api/functions/icp/dex/calculate_mint_amounts';
import { Avatar } from '@/components/common/ui/avatar';
import { allowedInputCharacters } from '@/lib/constants/positions';
import { cn, limitDecimalPlaces } from '@/lib/utils';
import { useSharedStore } from '@/store/store';
import React from 'react';

interface Props {
  position: FormattedPosition;
  userTokenBalance?: string;
  isAmountZero: boolean;
}

const AddLiquidityInput = ({ position, userTokenBalance, isAmountZero }: Props) => {
  const { icpIdentity, icpBalance } = useSharedStore();

  const token = isAmountZero ? position.token0 : position.token1;
  const { actions, token0DepositAmount, token1DepositAmount } = usePositionDetailsStore();

  const setTokenFn = isAmountZero ? actions.setToken0DepositAmount : actions.setToken1DepositAmount;
  const currentAmount = isAmountZero ? token0DepositAmount : token1DepositAmount;

  const handleDepositAmountInput = ({
    amount,
    isAmountZero,
  }: {
    isAmountZero: boolean;
    amount: string;
  }) => {
    const trimmed = amount.trim();
    const validAmount = limitDecimalPlaces(trimmed);

    setTokenFn(amount);

    if (validAmount.endsWith('.')) {
      setTokenFn(validAmount);
      return;
    }

    const parsed = parseFloat(amount);

    if (amount === '' || isNaN(parsed) || /^(\d*\.)?$/.test(amount) || parsed < 0) {
      actions.setToken0DepositAmount('0');
      actions.setToken1DepositAmount('0');
    }

    if (isNaN(parsed) || /^(\d*\.)?$/.test(amount) || parsed < 0) {
      return;
    }

    try {
      const result = calculate_mint_amounts({
        selected_amount: amount,
        token0: position.token0,
        token1: position.token1,
        sqrt_price_x96: position.pool.sqrt_price_x96,
        min_tick: position.key.tick_lower.toString(),
        max_tick: position.key.tick_upper.toString(),
        is_amount_zero: isAmountZero,
      });

      actions.setToken0DepositAmount(result.token0.formatted);
      actions.setToken1DepositAmount(result.token1.formatted);
    } catch (error) {
      console.error('Error calculating mint amounts:', error);
    }
  };

  return (
    <div
      className={cn(
        'group rounded-[20px] bg-box-border-gradient p-0.5 text-black backdrop-blur-[30px] dark:text-white',
      )}
    >
      <div className="flex w-full items-center justify-between gap-4 rounded-[20px] bg-box-background-secondary px-5 py-4 lg:px-7">
        <div className="flex h-full w-2/3 flex-col justify-between font-semibold">
          <input
            type="text"
            inputMode="decimal"
            className="border-none bg-transparent text-xl outline-none lg:text-2xl"
            value={currentAmount || ''}
            onChange={(e) => {
              const value = limitDecimalPlaces(e.target.value).trim();
              handleDepositAmountInput({ amount: value, isAmountZero: isAmountZero });
            }}
            onKeyDown={(e) => {
              if (!allowedInputCharacters.includes(e.key)) {
                e.preventDefault();
              }
              if (e.key === '.' && e.currentTarget.value.includes('.')) {
                e.preventDefault();
              }
            }}
            onPaste={(e) => {
              const pasteData = e.clipboardData.getData('Text');
              if (!/^\d*\.?\d*$/.test(pasteData)) {
                e.preventDefault();
              }
            }}
            placeholder="0"
          />

          <p className="text-xs text-[#FFFFFF7A] lg:text-sm">
            ${(Number(currentAmount || 0) * Number(token.usdPrice || 0)).toFixed(2)}
          </p>
        </div>

        <div className="flex w-max flex-col items-end gap-2">
          <div className={cn('relative', 'flex gap-x-1.5 self-end')}>
            <Avatar src={token.logo} className="h-5 w-5 md:h-6 md:w-6" />
            <p className="text-sm font-semibold text-white md:text-xl">{token.symbol}</p>
          </div>
          {icpIdentity && icpBalance && (
            <SetUserWalletBalanceButton
              onMaxClick={(amount) =>
                handleDepositAmountInput({
                  amount,
                  isAmountZero,
                })
              }
              token={token}
              userTokenBalance={userTokenBalance}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddLiquidityInput;
