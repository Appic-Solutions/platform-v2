import { cn } from '@/lib/utils';
import React from 'react';

const SolidCard = ({
  children,
  size = 'lg',
  className,
}: {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'w-full bg-[#222222] text-primary',
        size === 'sm'
          ? 'rounded-lg px-1.5 py-px'
          : size === 'md'
            ? 'rounded-xl px-4 py-3'
            : 'rounded-2xl px-5 py-4',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default SolidCard;
