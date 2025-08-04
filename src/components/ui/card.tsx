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
        'rounded-3xl p-6 shadow-md',
        'text-xl font-bold leading-7 text-black dark:text-white',
        'bg-input-fields bg-cover bg-center bg-no-repeat',
        'backdrop-blur-[30.07605743408203px] duration-200 hover:bg-[#000000]/75',
        'md:rounded-[36px] md:p-9 md:text-2xl md:leading-8',
        className,
      )}
      {...other}
    >
      {children}
    </div>
  );
}

export { Card };
