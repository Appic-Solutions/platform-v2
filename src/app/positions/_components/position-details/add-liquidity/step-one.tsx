import { Avatar } from '@/components/common/ui/avatar';
import { cn } from '@/lib/utils';
import SolidCard from '@/components/ui/cards/SolidCard';
import { useSharedStore } from '@/store/store';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { AddLiquidityFormDefaultValues } from '@/app/positions/create/schema';
import { FormattedPosition } from '@/app/positions/types';
import { useEffect, useState } from 'react';
import AvatarGroup from '../../AvatarGroup';
import AddLiquidityInput from './add-liquidity-input';

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
    setUserTokenBalances({
      token0Balance: userToken0?.balance ?? '0',
      token1Balance: userToken1?.balance ?? '0',
    });
  }, [icpBalance, icpIdentity]);

  const [token0DepositAmount, token1DepositAmount] = useWatch({
    control: addLiquidityForm.control,
    name: ['token0DepositAmount', 'token1DepositAmount'],
  });

  return (
    <>
      <div className="flex flex-col gap-2">
        {/* token names */}
        <div className="flex items-center justify-between gap-4">
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
            <span className="text-xs leading-5 text-white/60">
              {Number(position.pool.pool_id.fee) / 10000}%
            </span>
          </SolidCard>
        </div>

        <AddLiquidityInput
          fieldName="token0DepositAmount"
          form={addLiquidityForm}
          position={position}
          userTokenBalance={userTokenBalances?.token0Balance}
        />

        <AddLiquidityInput
          fieldName="token1DepositAmount"
          form={addLiquidityForm}
          position={position}
          userTokenBalance={userTokenBalances?.token1Balance}
        />
      </div>

      <SolidCard className="bg-transparent lg:bg-[#222222]">
        <div className="flex w-full flex-col gap-y-3">
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
