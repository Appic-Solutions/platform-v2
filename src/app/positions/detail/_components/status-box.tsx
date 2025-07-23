import { cn } from '@/lib/utils';

type StatusBoxProps = {
  volume: string;
  value: string;
};

export default function StatusBox({ volume, value }: StatusBoxProps) {
  const isDollar = volume !== 'Pools';

  return (
    <div
      className={cn(
        'flex flex-col justify-center gap-y-1.5',
        'min-h-[118px] min-w-[158px] lg:w-full',
        'px-8 py-6 md:py-8',
        'rounded-[20px] bg-white/15',
        'text-[13px] font-medium text-white md:text-[15px]',
      )}
    >
      <p className="leading-5 text-[#898989]">{volume}</p>
      <p className="text-lg font-bold md:text-[22px]">
        {isDollar && '$'}
        {value}
      </p>
    </div>
  );
}
