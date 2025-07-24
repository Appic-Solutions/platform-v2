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
        'w-full bg-[#222222]',
        size === 'sm'
          ? 'rounded-[6px] px-1.5 py-px'
          : size === 'md'
            ? 'rounded-[16px] px-5 py-4'
            : 'rounded-[21px] px-6 py-5',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default SolidCard;
