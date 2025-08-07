import { cn } from '@/lib/utils';
import React from 'react';

const GradientBorderCard = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) => {
  return (
    <div
      className={cn(
        'group rounded-[20px] bg-box-border-gradient p-0.5 text-black backdrop-blur-[30px] dark:text-white lg:rounded-[30px]',
        className,
      )}
      onClick={onClick}
    >
      <div className="h-full w-full rounded-[20px] bg-box-background-secondary px-4 py-2 lg:rounded-[30px] lg:px-6 lg:py-4">
        {children}
      </div>
    </div>
  );
};

export default GradientBorderCard;
