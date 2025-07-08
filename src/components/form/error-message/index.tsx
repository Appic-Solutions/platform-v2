'use client';

import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  name: string;
  className?: string;
}

export default function ErrorMessage({ name, className }: ErrorMessageProps) {
  const {
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  if (!error?.message) return null;

  return <p className={cn('mt-1 text-sm text-red-500', className)}>{error.message.toString()}</p>;
}
