'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PAGE_PARAMS_DATA } from '../_constants';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useSharedStore } from '@/store/store';
import Image from 'next/image';
import BridgeContent from './bridge-content';
import AdvancedContent from './advanced-content';
import DexContent from './dex-content';

const NeedConnectWallet = ({ title, description }: { title: string; description: string }) => {
  return (
    <div
      className={cn(
        'm-auto flex flex-col items-center justify-center gap-y-5',
        'h-full max-w-[490px] px-6 text-center text-white',
      )}
    >
      <Image src="/images/wallet.svg" alt="wallet-Image" width={210} height={210} quality={100} />
      <p className="text-xl">{title}</p>
      <p className="mb-24 text-sm leading-6">{description}</p>
    </div>
  );
};

export default function TabSection({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const { icpBalance, evmBalance } = useSharedStore();

  return (
    <Tabs
      defaultValue={defaultValue}
      onValueChange={(value) => router.push(`/transactions-history/${value}`)}
      className="flex h-full w-full flex-col gap-y-7 overflow-y-auto pt-1.5 md:pt-0"
    >
      <TabsList
        className={cn(
          'mx-auto flex max-w-fit items-center justify-center gap-1.5',
          'rounded-full bg-box-background text-white ring-[5px] ring-box-border',
          'px-4 py-2.5 md:px-2',
          'md:absolute md:-left-24 md:top-24 md:mb-0 md:flex-col',
        )}
      >
        {PAGE_PARAMS_DATA.map((item, idx) => (
          <TabsTrigger
            key={idx}
            value={item.name}
            className="h-10 w-10 data-[state=active]:text-white dark:data-[state=active]:text-black"
          >
            {item.icon}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="dex" asChild>
        {evmBalance || icpBalance ? (
          <div className="flex flex-col items-center justify-center gap-y-6 md:px-2">
            <DexContent />
          </div>
        ) : (
          <NeedConnectWallet
            title="Connect your wallet to access history"
            description="To access the full history of your wallet transactions, please connect your wallet. It’s quick, secure, and easy."
          />
        )}
      </TabsContent>
      <TabsContent value="bridge" asChild>
        {evmBalance || icpBalance ? (
          <div className="flex flex-col items-center justify-center gap-y-6 md:px-2">
            <BridgeContent />
          </div>
        ) : (
          <NeedConnectWallet
            title="Connect your wallet to access history"
            description="To access the full history of your wallet transactions, please connect your wallet. It’s quick, secure, and easy."
          />
        )}
      </TabsContent>
      <TabsContent value="advanced" asChild>
        {icpBalance ? (
          <div className="flex flex-col items-center justify-center gap-y-6 px-2">
            <AdvancedContent />
          </div>
        ) : (
          <NeedConnectWallet
            title="Connect your Icp wallet to access history"
            description="To access the full history of your wallet transactions, please connect your wallet. It’s quick, secure, and easy."
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
