import React from 'react';
import { useWatch } from 'react-hook-form';
import { useCreatePosition } from '../../_context/CreatePositionContext';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Props {
  onButtonClick?: () => void;
}

const TokenSwitcher = ({ onButtonClick }: Props) => {
  const { isToken0Selected, handleSelectedTokenChange, createPositionForm } = useCreatePosition();

  const [token0, token1] = useWatch({
    control: createPositionForm.control,
    name: ['token0', 'token1'],
  });

  return (
    <div className="flex rounded-md bg-[#222222] px-[4px] py-[2px]">
      {[token0, token1].map(
        (t, idx) =>
          t && (
            <button
              type="button"
              key={idx}
              className={cn(
                'flex items-center gap-1 rounded-md px-[10px] py-[4px] text-xs font-semibold transition-all',
                (isToken0Selected && idx === 0) || (!isToken0Selected && idx === 1)
                  ? 'bg-[#1E53B8] text-white'
                  : 'bg-[#222222] text-white/70',
              )}
              onClick={() => {
                if ((idx === 0 && isToken0Selected) || (idx === 1 && !isToken0Selected)) {
                  return;
                }
                handleSelectedTokenChange();
                onButtonClick && onButtonClick();
              }}
              disabled={!t}
            >
              <Image src={t.logo} alt={t.symbol} width={17} height={17} className="rounded-full" />
              {t.symbol}
            </button>
          ),
      )}
    </div>
  );
};

export default TokenSwitcher;
