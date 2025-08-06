import { Avatar } from '@/components/common/ui/avatar';
import { cn } from '@/lib/utils';
import SolidCard from '@/components/ui/cards/SolidCard';
import { useSharedStore } from '@/store/store';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { AddLiquidityFormDefaultValues } from '@/app/positions/create/schema';
import { FormattedPosition } from '@/app/positions/types';
import SetUserWalletBalanceButton from '@/app/positions/create/_components/SetUserWalletBalanceButton';
import { useEffect, useState } from 'react';
import AddLiquidityInput from './add-liquidity-input';
import AvatarGroup from '../../AvatarGroup';

const AddLiquidityStepOne = ({
  position,
  addLiquidityForm,
}: {
  position: FormattedPosition;
  addLiquidityForm: UseFormReturn<AddLiquidityFormDefaultValues>;
}) => {
  const [userTokenBalances, setUserTokenBalances] = useState<{
    token0Balance: string;
    token1Balance: string;
  }>();
  const { icpBalance, icpIdentity } = useSharedStore();

  useEffect(() => {
    if (!icpBalance || !icpIdentity) return;

    const userToken0 = icpBalance.tokens.find((t) => t.canisterId === position.token0?.canisterId);
    const userToken1 = icpBalance.tokens.find((t) => t.canisterId === position.token1?.canisterId);

    if (userToken0?.balance && userToken1?.balance) {
      setUserTokenBalances({
        token0Balance: userToken0?.balance,
        token1Balance: userToken1?.balance,
      });
    }
  }, [icpBalance, icpIdentity]);

  const [token0DepositAmount, token1DepositAmount] = useWatch({
    control: addLiquidityForm.control,
    name: ['token0DepositAmount', 'token1DepositAmount'],
  });

  return (
    <>
      {/* token names */}
      <div className={cn('flex items-center justify-between gap-4', 'mb-3')}>
        <div className="flex gap-4">
          {/* avatars */}
          <AvatarGroup avatar0={position.token0.logo} avatar1={position.token1.logo} />

          <div>
            <div className="flex items-center text-xl font-semibold md:text-2xl">
              {position.token0.symbol}/{position.token1.symbol}
            </div>
            <p
              className={cn(
                'flex items-center gap-x-1.5 text-[13px]',
                position.is_in_range ? 'text-[#77EF4B]' : 'text-[#EE5D5D]',
              )}
            >
              <span
                className={cn(
                  'h-[9px] w-[9px] animate-pulse rounded-full',
                  position.is_in_range ? 'bg-[#77EF4B]' : 'bg-[#EE5D5D]',
                )}
              />
              {position.is_in_range ? 'In range' : 'Out of range'}
            </p>
          </div>
        </div>

        <SolidCard size="sm" className="w-max bg-[#FFFFFF1A]">
          <span className="text-xs leading-5 text-white/60">{position.total_fees_owed_usd}%</span>
        </SolidCard>
      </div>

      {/* inputs */}
      <div
        className={cn(
          'group mb-3 rounded-[20px] bg-box-border-gradient p-0.5 text-black backdrop-blur-[30px] dark:text-white',
        )}
      >
        {/* input0 */}
        <div className="flex w-full items-center justify-between rounded-[20px] bg-box-background-secondary px-5 py-4 lg:px-7">
          <div className="flex h-full w-2/3 flex-col justify-between font-semibold">
            <AddLiquidityInput
              fieldName="token0DepositAmount"
              form={addLiquidityForm}
              position={position}
            />
            <p className="text-xs text-[#FFFFFF7A] lg:text-sm">
              $
              {(Number(token0DepositAmount || 0) * Number(position.token0.usdPrice || 0)).toFixed(
                2,
              )}
            </p>
          </div>
          {/* logo */}
          <div className="flex w-max flex-col gap-2">
            <div className={cn('relative', 'flex gap-x-1.5 self-end')}>
              <Avatar src={position.token0.logo} className="h-5 w-5 md:h-6 md:w-6" />
              <p className="text-sm font-semibold text-white md:text-xl">
                {position.token0.symbol}
              </p>
            </div>
            {icpIdentity && icpBalance && (
              <SetUserWalletBalanceButton
                isAmountZero={true}
                token={position.token0}
                userTokenBalance={userTokenBalances?.token0Balance}
              />
            )}
          </div>
        </div>
      </div>
      {/* input1 */}
      <div
        className={cn(
          'group mb-3 rounded-[20px] bg-box-border-gradient p-0.5 text-black backdrop-blur-[30px] dark:text-white',
        )}
      >
        <div className="flex w-full items-center justify-between rounded-[20px] bg-box-background-secondary px-5 py-4 lg:px-7">
          <div className="flex h-full w-2/3 flex-col justify-between font-semibold">
            <AddLiquidityInput
              fieldName="token1DepositAmount"
              form={addLiquidityForm}
              position={position}
            />
            <p className="text-xs text-[#FFFFFF7A] lg:text-sm">
              $
              {(Number(token1DepositAmount || 0) * Number(position.token1?.usdPrice || 0)).toFixed(
                2,
              )}
            </p>
          </div>
          {/* logo */}
          <div className="flex w-max flex-col gap-2">
            <div className={cn('relative', 'flex gap-x-1.5 self-end')}>
              <Avatar src={position.token1.logo} className="h-5 w-5 md:h-6 md:w-6" />
              <p className="text-sm font-semibold text-white md:text-xl">
                {position.token1.symbol}
              </p>
            </div>
            {icpIdentity && icpBalance && (
              <SetUserWalletBalanceButton
                isAmountZero={false}
                token={position.token1}
                userTokenBalance={userTokenBalances?.token1Balance}
              />
            )}
          </div>
        </div>
      </div>

      {/* balance */}
      <SolidCard className="bg-transparent lg:bg-[#222222]">
        <div className={cn('flex flex-col gap-y-3', 'w-full')}>
          {/* token0 */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-white/70 md:text-base">
              {position.token0.symbol} position
            </p>
            <div
              className={cn(
                'relative',
                'flex items-center gap-x-1.5',
                'text-sm font-semibold text-white md:text-base',
              )}
            >
              <Avatar src={position.token0.logo} className="h-5 w-5 md:h-6 md:w-6" />
              {token0DepositAmount
                ? (parseFloat(position.token0_reserves) + parseFloat(token0DepositAmount)).toFixed(
                    8,
                  )
                : parseFloat(position.token0_reserves).toFixed(8)}{' '}
              {position.token0.symbol}
            </div>
          </div>
          {/* token1 */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-white/70 md:text-base">
              {position.token1.symbol} position
            </p>
            <div
              className={cn(
                'relative',
                'flex items-center gap-x-1.5',
                'text-sm font-semibold text-white md:text-base',
              )}
            >
              <Avatar src={position.token1.logo} className="h-5 w-5 md:h-6 md:w-6" />
              {token1DepositAmount
                ? (parseFloat(position.token1_reserves) + parseFloat(token1DepositAmount)).toFixed(
                    8,
                  )
                : parseFloat(position.token1_reserves).toFixed(8)}{' '}
              {position.token1.symbol}
            </div>
          </div>
        </div>
      </SolidCard>
    </>
  );
};

export default AddLiquidityStepOne;
