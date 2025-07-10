import { ErrorIcon } from '@/components/icons';
import React, { useState } from 'react';
import { chartTypes } from './data';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import SolidCard from '@/components/ui/cards/SolidCard';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { CreatePoolFormDefaultValues } from '../../schema';
import { useFormContext, useWatch } from 'react-hook-form';
import GradientBorderCard from '@/components/ui/cards/GradientBorderCard';

const StepTwoPoolNotExist = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreatePoolFormDefaultValues>();

  const [token0, token1, Fee] = useWatch({
    control,
    name: ['token0', 'token1', 'fee'],
  });
  const [selectedChart, setSelectedChart] = useState<string>('usdc');
  const [inputValue, setInputValue] = useState('1234.55');
  const [selectedToken, setSelectedToken] = useState<IcpToken>(token0);
  console.log(selectedToken);
  return (
    <>
      <SolidCard>
        <div className="flex items-center gap-2">
          <ErrorIcon width={22} height={22} />
          <h3 className="text-lg font-medium md:text-xl">Create new pool</h3>
        </div>
        <p className="mt-2 text-sm font-light text-[#FFFFFFBA]">
          Choose the tokens you want to provide liquidity for. You can select tokens on all
          supported networks.. Choose the tokens you want to provide liquidity for. You can select
          tokens on all supported networks.
        </p>
      </SolidCard>
      <div className="mt-4 md:mt-8">
        <h3 className="mb-4 text-2xl font-bold">Set initial price</h3>
        <p className="mb-4 text-[15px] font-thin">
          Choose the tokens you want to provide liquidity for. You can select tokens on all
          supported networks.
        </p>
        <GradientBorderCard className="h-[148px] lg:h-[196px]">
          <div className="flex h-full w-full flex-col justify-between font-semibold">
            <div className="flex items-start justify-between">
              <p className="text-base text-[#FFFFFFB8] lg:text-[21px]">Initial price</p>
              <div className="flex rounded-[10px] bg-[#222222] px-[4px] py-[2px]">
                {chartTypes.map((chart) => (
                  <button
                    key={chart.value}
                    className={cn(
                      'flex items-center gap-1 rounded-md px-[10px] py-[4px] text-xs font-semibold transition-all',
                      chart.value === selectedChart
                        ? 'bg-[#1E53B8] text-white'
                        : 'bg-[#222222] text-white/70',
                    )}
                    onClick={() => setSelectedChart(chart.value)}
                  >
                    <Image src={chart.icon} alt="" width={17} height={17} />
                    {chart.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <input
                className="border-none bg-transparent text-[22px] outline-none lg:text-[27px]"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <p className="text-xs text-[#FFFFFF7A] lg:text-sm">1 ICP = 1 ETH</p>
            </div>
          </div>
        </GradientBorderCard>
      </div>
      <SolidCard>
        <div className="flex w-full flex-col items-start gap-1 text-sm font-medium lg:flex-row lg:items-center lg:justify-between lg:text-[17px]">
          <h3 className="md:text-xl">Market price: 0 ICP = 1 ETH (-)</h3>
          <button className="text-[#FFFFFFC9]">Use market price</button>
        </div>
      </SolidCard>
    </>
  );
};

export default StepTwoPoolNotExist;
