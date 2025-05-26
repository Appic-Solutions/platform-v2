import { cn } from '@/lib/utils';
import React from 'react';

interface CardProps extends React.AllHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className, ...other }: CardProps) {
  return (
    <div
      className={cn(
        'group relative flex w-full items-center gap-x-7 overflow-clip',
        'rounded-3xl px-6 py-11 shadow-md',
        'text-2xl font-bold leading-7 text-black dark:text-white',
        'bg-input-fields bg-cover bg-center bg-no-repeat',
        'backdrop-blur-[30.07605743408203px] duration-200 hover:bg-[#000000]/75',
        'md:rounded-[36px] md:px-10 md:py-14 md:text-[28px] md:leading-8',
        className,
      )}
      {...other}
    >
      {children}
    </div>
  );
}

export { Card };
