import { AddLiquidityFormDefaultValues, addLiquidityFormKeys } from '@/app/positions/create/schema';
import { FormattedPosition } from '@/app/positions/types';
import { calculate_mint_amounts } from '@/blockchain_api/functions/icp/dex/calculate_mint_amounts';
import { allowedInputCharacters } from '@/lib/constants/positions';
import { limitDecimalPlaces } from '@/lib/utils';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';

const AddLiquidityInput = ({
  form,
  position,
  fieldName,
}: {
  form: UseFormReturn<AddLiquidityFormDefaultValues>;
  fieldName: addLiquidityFormKeys;
  position: FormattedPosition;
}) => {
  const isAmountZero = fieldName === 'token0DepositAmount';

  const handleDepositAmountInput = ({
    amount,
    isAmountZero,
  }: {
    isAmountZero: boolean;
    amount: string;
  }) => {
    const field = isAmountZero ? 'token0DepositAmount' : 'token1DepositAmount';

    form.setValue(field, amount, {
      shouldValidate: true,
      shouldDirty: true,
    });

    const parsed = parseFloat(amount);

    if (amount === '' || isNaN(parsed) || /^(\d*\.)?$/.test(amount) || parsed < 0) {
      form.setValue('token0DepositAmount', '0', {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue('token1DepositAmount', '0', {
        shouldValidate: true,
        shouldDirty: true,
      });
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

      form.setValue('token0DepositAmount', result.token0.formatted, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue('token1DepositAmount', result.token1.formatted, {
        shouldValidate: true,
        shouldDirty: true,
      });

      form.trigger('token0DepositAmount');
      form.trigger('token1DepositAmount');
    } catch (error) {
      console.error('Error calculating mint amounts:', error);
      form.setError(field, {
        type: 'manual',
        message: 'Failed to calculate deposit amounts',
      });
    }
  };

  return (
    <Controller
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <input
          type="text"
          inputMode="decimal"
          className="border-none bg-transparent text-xl outline-none lg:text-2xl"
          value={field.value || ''}
          onChange={(e) => {
            const value = limitDecimalPlaces(e.target.value).trim();
            field.onChange(value);
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
      )}
    />
  );
};

export default AddLiquidityInput;
