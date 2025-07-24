import { ArrowLeftIcon, VerifiedIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useFormContext, useWatch } from 'react-hook-form';
import { FeeTiersProps } from '../../_types';

export default function FeeTiers({ stateBackHandler, feeTiers, selectFeeHandler }: FeeTiersProps) {
  const { control } = useFormContext();

  const Fee = useWatch({
    control,
    name: 'fee',
  });

  console.log('Fee =========>', Fee);
  return (
    <div className="flex h-full w-full animate-fade flex-col gap-10">
      {/* Header */}
      <div
        className="relative isolate flex w-full items-center justify-between gap-4"
        onClick={stateBackHandler}
      >
        <ArrowLeftIcon className="z-10 cursor-pointer" />
        <h1 className="absolute inset-x-0 text-center text-[27px] font-bold md:text-[30px]">
          Fee tiers
        </h1>
      </div>

      {/* Main */}
      <div className="flex h-full w-full flex-col gap-3 overflow-y-auto *:w-full">
        {feeTiers.map((tier, idx) => (
          <div
            key={idx}
            className={cn(
              'relative isolate cursor-pointer',
              Number(tier.fee) === Fee
                ? 'bg-[linear-gradient(to_bottom,#242424_35%,#3C3C3C_100%)]'
                : 'bg-[linear-gradient(to_bottom,#242424_0%,#2121214D_100%)]',
              'px-8 py-6',
              'rounded-[28px] backdrop-blur-[30px]',
              'border-2 border-[#4C4C4C]/30',
            )}
            onClick={() => {
              console.log('selecting fee tier', tier);
              console.log('selecting fee tier to number', Number(tier.fee));
              selectFeeHandler(Number(tier.fee));
              stateBackHandler();
            }}
          >
            <div className="flex items-center justify-between gap-5">
              <div className="text-xl font-semibold md:text-2xl">{Number(tier.fee) / 10000}%</div>
              {/* {selected && (
                <>
                  <div className="flex-1">
                    <span
                      className={cn(
                        'rounded-[16px] bg-[#2060D5]/45',
                        'p-1 md:px-2',
                        'text-[13px] text-[#A7C6FF] md:text-sm',
                      )}
                    >
                      HighestTVL
                    </span>
                  </div>
                  <LockIcon width={24} height={24} />
                </>
              )} */}
              {Number(tier.fee) === Fee && <VerifiedIcon width={32} height={32} />}
            </div>
            <div className="mb-6 text-[17px] text-[#898989] md:mb-8 md:text-xl">{tier.desc}</div>
            <div className="flex items-center justify-between gap-4 text-white md:text-xl">
              <span>${Number(tier.tvl).toFixed(2)} TVL</span>
              {/* <span>0% select</span> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
