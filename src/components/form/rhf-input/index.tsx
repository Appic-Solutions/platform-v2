'use client';
import { cn } from '@/lib/utils';
import { Controller, useFormContext } from 'react-hook-form';
import { InputProps } from './types';

export default function RHFInput({
  name,
  label,
  wrapperClassName,
  showError = true,
  className,
  ...props
}: InputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('flex w-full flex-col gap-1', wrapperClassName)}>
          {label && (
            <label htmlFor={name} className="capitalize text-white">
              {label}
            </label>
          )}
          <input
            id={name}
            autoComplete="off"
            {...field}
            {...props}
            className={cn(
              'border-none outline-none ring-0',
              'flex h-[42px] w-full items-center',
              'rounded-lg bg-white/30 text-white placeholder:text-white/50',
              'px-3.5 py-2.5',
              error ? 'border-red-500' : 'border-gray-300',
              className,
            )}
          />
          {showError && error && <span className="text-sm text-red-500">{error.message}</span>}
        </div>
      )}
    />
  );
}
