'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PAGE_PARAMS_DATA } from '../_constants';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useSharedStore } from '@/store/store';
import Image from 'next/image';
import BridgeContent from './bridge-content';
import AdvancedContent from './advanced-content';

const NeedConnectWallet = ({ title, description }: { title: string, description: string }) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center gap-y-5 m-auto',
      'text-center max-w-[490px] h-full px-6 text-white',
    )}>
      <Image src="/images/wallet.svg" alt="wallet-Image" width={210} height={210} quality={100} />
      <p className="text-xl">{title}</p>
      <p className="text-sm leading-6 mb-24">{description}</p>
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
      className="h-full w-full overflow-y-auto max-md:pt-4 max-md:pb-10"
    >
      <TabsList
        className={cn(
          'flex items-center justify-center gap-1.5 px-4 py-2.5 max-w-fit mx-auto mb-5',
          'bg-box-background rounded-full text-white ring-[5px] ring-box-border',
          'sm:px-6 sm:py-3.5',
          'md:flex-col md:py-5 md:px-2 md:absolute md:-left-24 md:top-24 md:mb-0',
        )}
      >
        {PAGE_PARAMS_DATA.map((item, idx) => (
          <TabsTrigger key={idx} value={item.name}>
            {item.icon}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value='bridge' asChild>
        {evmBalance || icpBalance ? (
          <div className='flex items-center justify-center flex-col gap-y-5 px-4'>
            <BridgeContent />
          </div>
        ) : (
          <NeedConnectWallet
            title='Connect your wallet to access history'
            description='To access the full history of your wallet transactions, please connect your wallet. It’s quick, secure, and easy.'
          />
        )}
      </TabsContent>
      <TabsContent value='advanced' asChild>
        {icpBalance ? (
          <div className='flex items-center justify-center flex-col gap-y-5 px-4'>
            <AdvancedContent />
          </div>
        ) : (
          <NeedConnectWallet
            title='Connect your Icp wallet to access history'
            description='To access the full history of your wallet transactions, please connect your wallet. It’s quick, secure, and easy.'
          />
        )
        }
      </TabsContent >

    </Tabs >
  );
}
