import { Avatar } from '@/components/common/ui/avatar';
import { cn } from '@/lib/utils';
import SolidCard from '@/components/ui/cards/SolidCard';
import { useSharedStore } from '@/store/store';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AddLiquidityFormDefaultValues,
  addLiquidityFormSchema,
} from '@/app/positions/create/schema';
import { FormattedPosition } from '@/app/positions/types';
import SetUserWalletBalanceButton from '@/app/positions/create/_components/SetUserWalletBalanceButton';
import { useEffect, useState } from 'react';
import AddLiquidityInput from './add-liquidity-input';

const AddLiquidityStepOne = ({
  position,
  onBack,
  onNext,
}: {
  position: FormattedPosition;
  onBack: () => void;
  onNext: () => void;
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

  const addLiquidityForm = useForm<AddLiquidityFormDefaultValues>({
    defaultValues: {
      token0DepositAmount: '0',
      token1DepositAmount: '0',
    },
    resolver: zodResolver(addLiquidityFormSchema),
    mode: 'onChange',
  });

  const [token0DepositAmount, token1DepositAmount] = useWatch({
    control: addLiquidityForm.control,
    name: ['token0DepositAmount', 'token1DepositAmount'],
  });

  const submitHandler = (values: AddLiquidityFormDefaultValues) => {
    console.log(values);
    onNext();
  };

  return (
    <FormProvider {...addLiquidityForm}>
      <form onSubmit={addLiquidityForm.handleSubmit(submitHandler)}>
        {/* token names */}
        <div className={cn('flex items-center justify-between gap-4', 'mb-7 md:mb-3')}>
          <div
            className={cn(
              'max-h-[58px] flex-1',
              'grid grid-cols-9 md:grid-cols-8',
              'md:grid-rows-2',
            )}
          >
            <div
              className={cn(
                'flex items-center',
                'col-span-2 sm:col-span-1 md:col-span-2',
                'max-w-fit',
                'md:row-span-full',
              )}
            >
              <Avatar
                src={position.token0.logo}
                className="h-[31px] w-[31px] md:h-[58px] md:w-[58px]"
              />
              <Avatar
                // src={token?.logo}
                src={position.token1.logo}
                className={cn('h-[31px] w-[31px] md:h-[58px] md:w-[58px]', '-ml-4')}
              />
            </div>
            <div
              className={cn(
                'flex items-center',
                'text-[27px] font-bold md:text-[32px]',
                'col-span-7 sm:col-span-8 md:col-span-6',
              )}
            >
              {position.token0.symbol}/{position.token1.symbol}
            </div>
            <div
              className={cn(
                'flex items-center gap-x-1',
                'text-xs font-medium',
                'col-span-full md:col-span-6',
              )}
            >
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
          <div className="flex w-full items-center justify-between rounded-[20px] bg-box-background-secondary px-5 py-6 lg:px-8">
            {/* input0 */}
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

        <div
          className={cn(
            'group mb-8 rounded-[20px] bg-box-border-gradient p-0.5 text-black backdrop-blur-[30px] dark:text-white',
          )}
        >
          <div className="flex w-full items-center justify-between rounded-[20px] bg-box-background-secondary px-5 py-6 lg:px-8">
            {/* input1 */}
            <div className="flex h-full w-2/3 flex-col justify-between font-semibold">
              <AddLiquidityInput
                fieldName="token1DepositAmount"
                form={addLiquidityForm}
                position={position}
              />
              <p className="text-xs text-[#FFFFFF7A] lg:text-sm">
                $
                {(
                  Number(token1DepositAmount || 0) * Number(position.token1?.usdPrice || 0)
                ).toFixed(2)}
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
        <SolidCard className="mb-8 bg-transparent px-5 lg:bg-[#222222] lg:px-8">
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
                  ? (
                      parseFloat(position.token0_reserves) + parseFloat(token0DepositAmount)
                    ).toFixed(8)
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
                  ? (
                      parseFloat(position.token1_reserves) + parseFloat(token1DepositAmount)
                    ).toFixed(8)
                  : parseFloat(position.token1_reserves).toFixed(8)}{' '}
                {position.token1.symbol}
              </div>
            </div>
          </div>
        </SolidCard>

        {/* Action Button */}
        <div
          className={cn(
            'flex h-[50px] items-center justify-center gap-x-3 self-end lg:h-[66px]',
            'w-full',
          )}
        >
          <button
            onClick={onBack}
            type="button"
            className={cn(
              'h-full w-full',
              'bg-white/35',
              'text-white',
              'mt-auto md:mt-0',
              'select-none rounded-[15px] duration-200',
              'hover:opacity-85',
            )}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              addLiquidityForm.formState.isSubmitting || !addLiquidityForm.formState.isValid
            }
            className={cn(
              'h-full w-full',
              'bg-primary-buttons',
              'text-white',
              'mt-auto md:mt-0',
              'select-none rounded-[15px] duration-200',
              'hover:opacity-85',
              'disabled:opacity-50',
            )}
          >
            Continue
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddLiquidityStepOne;
