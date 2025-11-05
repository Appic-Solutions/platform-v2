'use client';
import HeaderPage from '@/app/(panel)/_layout/header';
import ShapesPage from '@/app/(panel)/_layout/shapes';
import '@nfid/identitykit/react/styles.css';
import { WalletWrapper } from '@/lib/wrappers/wallet/wrapper';
import { UserWalletProvider } from '@/lib/wrappers/wallet/userWalletProvider';
import { cn } from '@/lib/utils';
import NavbarPage from './_layout/navbar';
import { Toaster } from 'react-hot-toast';
import { QueryClient } from '@tanstack/query-core';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 10,
      staleTime: 1000 * 60,
    },
  },
});

const persister = createAsyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  key: 'appic-cache',
  throttleTime: 1000,
});

export default function PanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <WalletWrapper>
        <UserWalletProvider />
        <body
          className={cn(
            '!pointer-events-auto relative isolate !select-auto',
            'flex flex-col items-center justify-center',
            'min-h-screen !px-6 !py-3.5 md:!py-8',
          )}
        >
          <HeaderPage />
          <ShapesPage />
          <main className="mb-28 flex w-full flex-1 xl:mb-0">{children}</main>
          <NavbarPage />
          <Toaster toasterId="notification" />
          <Toaster toasterId="transactionNotification" />
        </body>
      </WalletWrapper>
    </PersistQueryClientProvider>
  );
}
