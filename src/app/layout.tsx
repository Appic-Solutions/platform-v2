'use client';
import '../style/globals.css';
import HeaderPage from '@/app/_layout/header';
import ShapesPage from '@/app/_layout/shapes';
import '@nfid/identitykit/react/styles.css';
import { WalletWrapper } from '@/lib/wrappers/wallet/wrapper';
import Providers from './providers';
import { UserWalletProvider } from '@/lib/wrappers/wallet/userWalletProvider';
import { Toaster } from '@/components/ui/toaster';
import ThemeSwitch from './_layout/theme-switch';
import { cn } from '@/lib/utils';
import NavbarPage from './_layout/navbar';

import { Rethink_Sans } from 'next/font/google';

const rethinkSans = Rethink_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-rethink-sans',
});

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en" className={cn('dark relative bg-[#060607] md:h-full', rethinkSans.className)}>
      <Providers>
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
            <Toaster />
            <ThemeSwitch />
          </body>
        </WalletWrapper>
      </Providers>
    </html>
  );
};

export default RootLayout;
