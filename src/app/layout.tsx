'use client';

import '@/style/globals.css';
import '@nfid/identitykit/react/styles.css';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import AOSWrapper from '@/lib/wrappers/aos';
import { QueryClient } from '@tanstack/query-core';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { WalletWrapper } from '@/lib/wrappers/wallet/wrapper';
import { UserWalletProvider } from '@/lib/wrappers/wallet/userWalletProvider';

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

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="font-rethink-sans relative bg-[#060607] md:h-full">
      <body>
        <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
          <WalletWrapper>
            <UserWalletProvider />
            <AOSWrapper>{children}</AOSWrapper>
            <Toaster toasterId="notification" />
            <Toaster toasterId="transactionNotification" />
          </WalletWrapper>
        </PersistQueryClientProvider>
      </body>
    </html>
  );
}
