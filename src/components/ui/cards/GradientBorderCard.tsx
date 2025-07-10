import { cn } from '@/lib/utils';
import React from 'react';

const GradientBorderCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'group rounded-[20px] bg-box-border-gradient p-0.5 text-black backdrop-blur-[30px] dark:text-white lg:rounded-[35px]',
        className,
      )}
    >
      <div className="h-full w-full rounded-[20px] bg-box-background-secondary px-6 py-4 lg:rounded-[35px] lg:px-8 lg:py-6">
        {children}
      </div>
    </div>
  );
};

export default GradientBorderCard;
