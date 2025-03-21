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
        'relative w-full flex items-center gap-x-7 overflow-clip group',
        'px-6 py-11 shadow-md rounded-3xl',
        'text-2xl leading-7 font-bold text-black dark:text-white',
        'bg-input-fields bg-center bg-no-repeat bg-cover',
        'backdrop-blur-[30.07605743408203px] duration-200 hover:bg-[#000000]/75',
        'md:px-10 md:py-14 md:text-[28px] md:leading-8 md:rounded-[36px]',
        className,
      )}
      {...other}
    >
      {children}
    </div>
  );
}

export { Card };
