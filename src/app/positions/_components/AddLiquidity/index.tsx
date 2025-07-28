import { Avatar } from '@/components/common/ui/avatar';
import { ArrowLeftIcon } from '@/components/icons';
import { cn, limitDecimalPlaces } from '@/lib/utils';
import { FormattedPosition, Step } from '../../page';
import Link from 'next/link';
import SolidCard from '@/components/ui/cards/SolidCard';
import { useSharedStore } from '@/store/store';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { AddLiquidityFormDefaultValues, addLiquidityFormSchema } from '../../create/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { calculate_mint_amounts } from '@/blockchain_api/functions/icp/dex/calculate_mint_amounts';
import SetUserWalletBalanceButton from '../../create/_components/step-two/DepositTokenInputs/SetUserWalletBalanceButton';
import { useEffect, useState } from 'react';

interface AddLiquidityProps {
  position: FormattedPosition;
  setCurrentStep: React.Dispatch<React.SetStateAction<Step>>;
}

export default function AddLiquidity({ position, setCurrentStep }: AddLiquidityProps) {
  const { icpBalance, icpIdentity } = useSharedStore();
  const { token0, token1, is_in_range, total_fees_owed_usd } = position;

  const [userTokenBalances, setUserTokenBalances] = useState<{
    token0Balance: string;
    token1Balance: string;
  }>();

  useEffect(() => {
    if (!icpBalance || !icpIdentity) return;

    const userToken0 = icpBalance.tokens.find((t) => t.canisterId === token0?.canisterId);
    const userToken1 = icpBalance.tokens.find((t) => t.canisterId === token1?.canisterId);

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

  const submitHandler = (values: AddLiquidityFormDefaultValues) => {
    console.log(values);
  };

  const [token0DepositAmount, token1DepositAmount] = useWatch({
    control: addLiquidityForm.control,
    name: ['token0DepositAmount', 'token1DepositAmount'],
  });

  const handleDepositAmountInput = ({
    amount,
    isAmountZero,
  }: {
    isAmountZero: boolean;
    amount: string;
  }) => {
    const trimmed = amount.trim();
    const field = isAmountZero ? 'token0DepositAmount' : 'token1DepositAmount';

    const validAmount = limitDecimalPlaces(trimmed);
    addLiquidityForm.setValue(field, validAmount, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (!trimmed) {
      console.log('Empty input, skipping calculation');
      addLiquidityForm.trigger(field);
      addLiquidityForm.setValue('token0DepositAmount', '0');
      addLiquidityForm.setValue('token1DepositAmount', '0');
      return;
    }

    const parsed = parseFloat(validAmount);
    if (isNaN(parsed) || parsed < 0) {
      console.log('Invalid or negative amount, skipping calculation');
      addLiquidityForm.setValue(field, '', {
        shouldValidate: true,
        shouldDirty: true,
      });
      return;
    }

    console.log({
      selected_amount: validAmount,
      token0: position.token0,
      token1: position.token1,
      sqrt_price_x96: position.pool.sqrt_price_x96,
      min_tick: position.key.tick_lower,
      max_tick: position.key.tick_upper,
      is_amount_zero: isAmountZero,
    });

    try {
      const result = calculate_mint_amounts({
        selected_amount: validAmount,
        token0: position.token0,
        token1: position.token1,
        sqrt_price_x96: position.pool.sqrt_price_x96,
        min_tick: position.key.tick_lower.toString(),
        max_tick: position.key.tick_upper.toString(),
        is_amount_zero: isAmountZero,
      });

      console.log('Mint amounts calculated', {
        result,
        token0Amount: result.token0.formatted,
        token1Amount: result.token1.formatted,
        isAmountZero,
      });

      addLiquidityForm.setValue('token0DepositAmount', result.token0.formatted, {
        shouldValidate: true,
        shouldDirty: true,
      });
      addLiquidityForm.setValue('token1DepositAmount', result.token1.formatted, {
        shouldValidate: true,
        shouldDirty: true,
      });

      addLiquidityForm.trigger('token0DepositAmount');
      addLiquidityForm.trigger('token1DepositAmount');
    } catch (error) {
      console.error('Error calculating mint amounts:', error);
      addLiquidityForm.setError(field, {
        type: 'manual',
        message: 'Failed to calculate deposit amounts',
      });
    }
  };

  console.log('token0DepositAmount', token0DepositAmount);
  console.log('token0_reserves', position.token0_reserves);

  return (
    <FormProvider {...addLiquidityForm}>
      <form
        onSubmit={addLiquidityForm.handleSubmit(submitHandler)}
        className="flex h-full w-full items-center justify-center"
      >
        <div className="flex h-full w-full animate-fade flex-col justify-between">
          {/* Header */}
          <div
            className={cn('relative isolate', 'flex items-center justify-between gap-4', 'w-full')}
          >
            <ArrowLeftIcon
              onClick={() => {
                setCurrentStep('positionDetail');
              }}
              className="z-10 hidden cursor-pointer md:inline-block"
            />
            <h1
              className={cn(
                'text-[27px] font-bold md:text-[30px]',
                'md:absolute md:inset-x-0 md:text-center',
              )}
            >
              Add liquidity
            </h1>
            <button
              className={cn(
                'px-2.5 py-0.5',
                'rounded-md',
                'bg-white/10',
                'text-xs font-medium text-white/60',
                'z-10',
              )}
            >
              <Link href="https://t.me/Appic_dao">Get help</Link>
            </button>
          </div>

          {/* Main */}
          <div className="flex w-full flex-col gap-y-3">
            {/* token names */}
            <div className={cn('flex items-center justify-between gap-4', 'mb-7 md:mb-1')}>
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
                  <Avatar src={token0.logo} className="h-[31px] w-[31px] md:h-[58px] md:w-[58px]" />
                  <Avatar
                    // src={token?.logo}
                    src={token1.logo}
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
                  {token0.symbol}/{token1.symbol}
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
                      is_in_range ? 'text-[#77EF4B]' : 'text-[#EE5D5D]',
                    )}
                  >
                    <span
                      className={cn(
                        'h-[9px] w-[9px] animate-pulse rounded-full',
                        is_in_range ? 'bg-[#77EF4B]' : 'bg-[#EE5D5D]',
                      )}
                    />
                    {is_in_range ? 'In range' : 'Out of range'}
                  </p>
                </div>
              </div>
              <SolidCard size="sm" className="w-max bg-[#FFFFFF1A]">
                <span className="text-xs leading-5 text-white/60">{total_fees_owed_usd}%</span>
              </SolidCard>
            </div>

            {/* inputs */}
            <div
              className={cn(
                'group rounded-[20px] bg-box-border-gradient p-0.5 text-black backdrop-blur-[30px] dark:text-white',
              )}
            >
              <div className="flex w-full items-center justify-between rounded-[20px] bg-box-background-secondary px-5 py-6 lg:px-8">
                {/* input0 */}
                <div className="flex h-full w-2/3 flex-col justify-between font-semibold">
                  <Controller
                    control={addLiquidityForm.control}
                    name="token0DepositAmount"
                    render={({ field }) => (
                      <input
                        type="text"
                        inputMode="decimal"
                        className="border-none bg-transparent text-[22px] outline-none lg:text-[27px]"
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
                  <p className="text-xs text-[#FFFFFF7A] lg:text-sm">
                    ${(Number(token0DepositAmount || 0) * Number(token0.usdPrice || 0)).toFixed(2)}
                  </p>
                </div>
                {/* logo */}
                <div className="flex w-max flex-col gap-2">
                  <div className={cn('relative', 'flex gap-x-1.5 self-end')}>
                    <Avatar src={token0.logo} className="h-5 w-5 md:h-6 md:w-6" />
                    <p className="text-sm font-semibold text-white md:text-xl">{token0.symbol}</p>
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
                'group rounded-[20px] bg-box-border-gradient p-0.5 text-black backdrop-blur-[30px] dark:text-white',
              )}
            >
              <div className="flex w-full items-center justify-between rounded-[20px] bg-box-background-secondary px-5 py-6 lg:px-8">
                {/* input1 */}
                <div className="flex h-full w-2/3 flex-col justify-between font-semibold">
                  <Controller
                    control={addLiquidityForm.control}
                    name="token1DepositAmount"
                    render={({ field }) => (
                      <input
                        type="text"
                        inputMode="decimal"
                        className="border-none bg-transparent text-[22px] outline-none lg:text-[27px]"
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
                  <p className="text-xs text-[#FFFFFF7A] lg:text-sm">
                    ${(Number(token1DepositAmount || 0) * Number(token1?.usdPrice || 0)).toFixed(2)}
                  </p>
                </div>
                {/* logo */}
                <div className="flex w-max flex-col gap-2">
                  <div className={cn('relative', 'flex gap-x-1.5 self-end')}>
                    <Avatar src={token1.logo} className="h-5 w-5 md:h-6 md:w-6" />
                    <p className="text-sm font-semibold text-white md:text-xl">{token1.symbol}</p>
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
          </div>

          {/* balance */}
          <SolidCard className="bg-transparent px-5 lg:bg-[#222222] lg:px-8">
            <div className={cn('flex flex-col gap-y-3', 'w-full')}>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-white/70 md:text-base">
                  {token0.symbol} position
                </p>
                <div
                  className={cn(
                    'relative',
                    'flex items-center gap-x-1.5',
                    'text-sm font-semibold text-white md:text-base',
                  )}
                >
                  <Avatar src={token0.logo} className="h-5 w-5 md:h-6 md:w-6" />
                  {(parseFloat(position.token0_reserves) + parseFloat(token0DepositAmount)).toFixed(
                    8,
                  )}{' '}
                  {token0.symbol}
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-white/70 md:text-base">
                  {token1.symbol} position
                </p>
                <div
                  className={cn(
                    'relative',
                    'flex items-center gap-x-1.5',
                    'text-sm font-semibold text-white md:text-base',
                  )}
                >
                  <Avatar src={token1.logo} className="h-5 w-5 md:h-6 md:w-6" />
                  {(parseFloat(position.token1_reserves) + parseFloat(token1DepositAmount)).toFixed(
                    8,
                  )}{' '}
                  {token1.symbol}
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
              onClick={() => {
                setCurrentStep('positionDetail');
              }}
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
              className={cn(
                'h-full w-full',
                'bg-primary-buttons',
                'text-white',
                'mt-auto md:mt-0',
                'select-none rounded-[15px] duration-200',
                'hover:opacity-85',
              )}
            >
              Continue
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
