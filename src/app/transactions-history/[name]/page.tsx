import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import { PAGE_PARAMS_DATA, PageParamsItem } from '../_constants';
import BackButton from '@/components/ui/BackButton';
import TabSection from '../_components/TabSections';

export function generateStaticParams() {
  return PAGE_PARAMS_DATA;
}

export default function TransactionsHistoryPage({ params }: { params: PageParamsItem }) {
  return (
    <Box
      className={cn(
        'flex h-full flex-col justify-start gap-4 overflow-visible duration-300 ease-in-out',
        'gap-y-6 md:max-h-[650px] md:min-h-[10vh] md:max-w-[537px]',
      )}
    >
      {/* Head Title */}
      <div className="flex items-center justify-center text-white md:text-black md:dark:text-white">
        <BackButton />
        <p className="text-2xl font-bold capitalize md:text-3xl">{params.name}</p>
      </div>

      {/* Tab Section */}
      <TabSection defaultValue={params.name} />
    </Box>
  );
}
