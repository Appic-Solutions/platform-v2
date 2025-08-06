import { useState } from 'react';
import { FormattedPosition, Step } from '@/app/positions/types';
import AddLiquidityStepOne from './step-one';
import AddLiquidityStepTwo from './step-two';
import { ArrowLeftIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import {
  AddLiquidityFormDefaultValues,
  addLiquidityFormSchema,
} from '@/app/positions/create/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  generate_args_and_approve_add_liquidity,
  increase_liquidity,
} from '@/blockchain_api/functions/icp/dex/tx/add_liquidity';
import { useSharedStore } from '@/store/store';

interface AddLiquidityProps {
  position: FormattedPosition;
  setCurrentStep: React.Dispatch<React.SetStateAction<Step>>;
}

export default function AddLiquidity({ position, setCurrentStep }: AddLiquidityProps) {
  const [step, setStep] = useState<number>(1);
  const { authenticatedAgent, unAuthenticatedAgent } = useSharedStore();

  const addLiquidityForm = useForm<AddLiquidityFormDefaultValues>({
    defaultValues: {
      token0DepositAmount: '0',
      token1DepositAmount: '0',
    },
    resolver: zodResolver(addLiquidityFormSchema),
    mode: 'onChange',
  });

  const onBack = () => {
    if (step === 1) {
      setCurrentStep('positionDetail');
    } else {
      setStep(1);
    }
  };

  const onNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      addLiquidityForm.handleSubmit(submitHandler)();
    }
  };

  const submitHandler = async (values: AddLiquidityFormDefaultValues) => {
    console.log(values);
    if (authenticatedAgent && unAuthenticatedAgent) {
      // step1
      const increaseLiquidityArgs = await generate_args_and_approve_add_liquidity(
        {
          amount0_max: values.token0DepositAmount,
          amount1_max: values.token1DepositAmount,
          position: position,
          token0: position.token0,
          token1: position.token0,
        },
        authenticatedAgent,
        unAuthenticatedAgent,
      );

      if (increaseLiquidityArgs.result) {
        const { amount0_max, amount1_max, from_subaccount, pool, tick_lower, tick_upper } =
          increaseLiquidityArgs.result;
        // step2
        const result = await increase_liquidity(
          { pool, tick_lower, tick_upper, amount1_max, from_subaccount, amount0_max },
          authenticatedAgent,
        );

        if (result.result) {
          console.log(result);
        }
      }
    }
    // onNext();
  };

  return (
    <FormProvider {...addLiquidityForm}>
      <form onSubmit={addLiquidityForm.handleSubmit(submitHandler)} className="h-full w-full">
        <div className="flex h-full w-full animate-fade flex-col justify-between">
          {/* Header */}
          <div className="relative isolate mb-10 flex w-full items-center justify-between gap-4">
            <ArrowLeftIcon
              onClick={onBack}
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
          {step === 1 && (
            <AddLiquidityStepOne addLiquidityForm={addLiquidityForm} position={position} />
          )}

          {step === 2 && (
            <AddLiquidityStepTwo addLiquidityForm={addLiquidityForm} position={position} />
          )}
          {/* Action Button */}
          <div
            className={cn(
              'flex h-[50px] items-center justify-center gap-x-3 self-end lg:h-[66px]',
              'mt-8 w-full',
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
              type="button"
              disabled={
                addLiquidityForm.formState.isSubmitting || !addLiquidityForm.formState.isValid
              }
              onClick={onNext}
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
        </div>
      </form>
    </FormProvider>
  );
}
