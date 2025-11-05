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
        'flex flex-col justify-between gap-y-1.5 p-5',
        'min-h-24 min-w-[158px] lg:w-full',
        'rounded-2xl bg-white/15',
        'text-white',
      )}
    >
      <p className="text-[13px] text-sm font-semibold leading-5 text-[#898989]">{volume}</p>
      <p className="font-bold md:text-xl">
        {isDollar && '$'}
        {value}
      </p>
    </div>
  );
}
