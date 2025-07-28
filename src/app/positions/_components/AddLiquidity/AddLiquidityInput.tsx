import { Avatar } from '@/components/common/ui/avatar';
import { cn } from '@/lib/utils';
import React from 'react';
import { FormattedPosition } from '../../page';

const AddLiquidityInput = ({ position }: { position: FormattedPosition }) => {
  return (
    <div
      className={cn(
        'group rounded-[20px] bg-box-border-gradient p-0.5 text-black backdrop-blur-[30px] dark:text-white',
      )}
    >
      <div className="flex w-full items-center justify-between rounded-[20px] bg-box-background-secondary px-5 py-6 lg:px-8">
        {/* input */}
        <div className="flex h-full w-2/3 flex-col justify-between font-semibold">
          <input
            type="text"
            // {...createPositionForm.register('initialPrice')}
            className="border-none bg-transparent text-[22px] outline-none lg:text-[27px]"
            placeholder="0"
          />
          <p className="text-xs text-[#FFFFFF7A] lg:text-sm">1234</p>
        </div>
        {/* logo */}
        <div className="flex w-max flex-col gap-2">
          <div className={cn('relative', 'flex gap-x-1.5 self-end')}>
            <Avatar src={position.token0.logo} className="h-5 w-5 md:h-6 md:w-6" />
            <Avatar
              src={position.token1.logo}
              className={cn('h-3 w-3', 'absolute bottom-0 left-3')}
            />
            <p className="text-sm font-semibold text-white md:text-xl">ETH</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-white/50">0.03 ETH</span>
            <span
              className={cn(
                'bg-[#2060D5]/45',
                'text-xs font-medium text-[#A7C6FF] md:text-sm',
                'h-[18px] w-9 lg:h-5 lg:w-12',
                'rounded-[10px] md:rounded-[16px]',
                'flex items-center justify-center',
              )}
            >
              Max
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLiquidityInput;
