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
        'px-9 py-11 rounded-[36px] shadow-md',
        'text-2xl leading-7 font-bold text-black dark:text-white',
        'bg-input-fields bg-center bg-no-repeat bg-cover',
        'duration-200 hover:bg-[#000000]/75',
        'md:backdrop-blur-[30.07605743408203px] md:px-10 md:py-14 md:text-[28px] md:leading-8',
        className,
      )}
      {...other}
    >
      {children}
    </div>
  );
}

export { Card };
