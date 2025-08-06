import { cn } from '@/lib/utils';
import { FC, ReactNode } from 'react';

interface BoxProps {
  children: ReactNode;
  className?: string;
  ref?: React.RefObject<HTMLDivElement>;
}

export default function ({ children, className, ref }: BoxProps) {
  return (
    <div
      ref={ref}
      className={cn(
        'relative overflow-y-auto overflow-x-hidden',
        'h-fit w-full md:backdrop-blur-md',
        'flex flex-col items-center justify-between',
        'md:bg-box-background md:bg-center md:bg-no-repeat',
        'md:m-auto md:rounded-3xl md:ring-8 md:ring-box-border',
        'md:max-h-[80vh] md:p-8',
        '*:z-10',
        className,
      )}
    >
      {children}
    </div>
  );
}
