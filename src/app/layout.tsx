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

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en" className="dark relative bg-[#060607] md:h-full">
      <Providers>
        <WalletWrapper>
          <UserWalletProvider />
          <body
            className={cn(
              '!pointer-events-auto relative isolate !select-auto',
              'flex flex-col items-center justify-center',
              'px-6 py-3.5 md:py-8',
            )}
          >
            <HeaderPage />
            <ShapesPage />
            <main className="flex w-full flex-1 items-center justify-center">{children}</main>
            <NavbarPage />
            <Toaster />
          </body>
        </WalletWrapper>
      </Providers>
      <ThemeSwitch />
    </html>
  );
};

export default RootLayout;
