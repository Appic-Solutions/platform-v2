'use client';

import { Avatar } from '@/components/common/ui/avatar';
import GradientBorderCard from '@/components/ui/cards/GradientBorderCard';
import { Controller, useWatch } from 'react-hook-form';
import { cn, limitDecimalPlaces } from '@/lib/utils';
import { useCreatePosition } from '../../_context/CreatePositionContext';
import { useSharedStore } from '@/store/store';
import SetUserWalletBalanceButton from '../SetUserWalletBalanceButton';

const DepositTokenInputs = () => {
  const { handleDepositAmountInput, createPositionForm, userTokenBalances } = useCreatePosition();
  const { icpIdentity } = useSharedStore();

  const [
    token0,
    token1,
    initialPrice,
    token0DepositAmount,
    token1DepositAmount,
    isToken0DepositAmountActive,
    isToken1DepositAmountActive,
  ] = useWatch({
    control: createPositionForm.control,
    name: [
      'token0',
      'token1',
      'initialPrice',
      'token0DepositAmount',
      'token1DepositAmount',
      'isToken0DepositAmountActive',
      'isToken1DepositAmountActive',
    ],
  });

  const isToken0Disabled =
    !(initialPrice && parseFloat(initialPrice) > 0) || !isToken0DepositAmountActive;
  const isToken1Disabled =
    !(initialPrice && parseFloat(initialPrice) > 0) || !isToken1DepositAmountActive;

  return (
    <div>
      <h3 className="mb-2 text-lg font-bold lg:text-xl">Deposit tokens</h3>
      <p className="mb-4 text-sm font-medium text-muted">
        The amount earned providing liquidity. Choose an amount that suits your risk tolerance and
        strategy.
      </p>
      <div className="relative flex justify-start gap-4 lg:justify-between">
        {/* token0 */}
        <GradientBorderCard
          className={cn(
            'h-[148px] w-[166px] transition-opacity lg:h-40 lg:w-[210px]',
            isToken0Disabled && 'opacity-30',
          )}
        >
          <div className="flex h-full flex-col justify-between font-semibold">
            {/* token name and logo */}
            <div className="flex items-center gap-2">
              <Avatar src={token0?.logo} className="h-5 w-5 md:h-7 md:w-7" />
              <p className="text-ellipsis text-[#FFFFFF] lg:text-xl">{token0?.symbol || 'N/A'}</p>
            </div>

            {icpIdentity && userTokenBalances && (
              <SetUserWalletBalanceButton
                isDisabled={isToken0Disabled}
                userTokenBalance={userTokenBalances?.token0Balance}
                onMaxClick={(balance) => {
                  handleDepositAmountInput({
                    amount: balance,
                    isAmountZero: true,
                  });
                }}
              />
            )}

            {/* input and usd price */}
            <div className="flex flex-col">
              <Controller
                control={createPositionForm.control}
                name="token0DepositAmount"
                render={({ field }) => (
                  <input
                    type="text"
                    disabled={isToken0Disabled}
                    inputMode="decimal"
                    className="w-28 border-none bg-transparent text-lg outline-none md:w-full lg:text-xl"
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = limitDecimalPlaces(e.target.value);
                      field.onChange(value);
                      handleDepositAmountInput({ amount: value, isAmountZero: true });
                    }}
                    placeholder="0"
                  />
                )}
              />
              <p className="text-xs text-[#FFFFFF7A]">
                ${(Number(token0DepositAmount || 0) * Number(token0?.usdPrice || 0)).toFixed(2)}
              </p>
            </div>
          </div>
        </GradientBorderCard>
        {/* token1 */}
        <GradientBorderCard
          className={cn(
            'h-[148px] w-[166px] transition-opacity lg:h-40 lg:w-[210px]',
            isToken1Disabled && 'opacity-30',
          )}
        >
          <div className="flex h-full flex-col justify-between font-semibold">
            {/* token name and logo */}
            <div className="flex items-center gap-2">
              <Avatar src={token1?.logo} className="h-5 w-5 md:h-7 md:w-7" />
              <p className="text-ellipsis text-[#FFFFFF] lg:text-xl">{token1?.symbol || 'N/A'}</p>
            </div>

            {/* user wallet balance */}
            {icpIdentity && userTokenBalances && (
              <SetUserWalletBalanceButton
                isDisabled={isToken1Disabled}
                userTokenBalance={userTokenBalances.token1Balance}
                onMaxClick={(balance) => {
                  handleDepositAmountInput({
                    amount: balance,
                    isAmountZero: false,
                  });
                }}
              />
            )}
            {/* input and usd price */}
            <div className="flex flex-col">
              <Controller
                control={createPositionForm.control}
                name="token1DepositAmount"
                render={({ field }) => (
                  <input
                    type="text"
                    disabled={isToken1Disabled}
                    inputMode="decimal"
                    className="w-28 border-none bg-transparent text-lg outline-none md:w-full lg:text-xl"
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = limitDecimalPlaces(e.target.value);
                      field.onChange(value);
                      handleDepositAmountInput({ amount: value, isAmountZero: false });
                    }}
                    placeholder="0"
                  />
                )}
              />
              <p className="text-xs text-[#FFFFFF7A]">
                ${(Number(token1DepositAmount || 0) * Number(token1?.usdPrice || 0)).toFixed(2)}
              </p>
            </div>
          </div>
        </GradientBorderCard>
        {createPositionForm.formState.errors.token0DepositAmount ||
        createPositionForm.formState.errors.token1DepositAmount ? (
          <p className="absolute bottom-[-12%] text-[#EE5D5D] lg:text-sm">
            {createPositionForm.formState.errors.token0DepositAmount?.message ??
              createPositionForm.formState.errors.token1DepositAmount?.message}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default DepositTokenInputs;
