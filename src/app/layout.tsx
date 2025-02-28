'use client';
import '../style/globals.css';
import HeaderPage from '@/app/_layout/header';
import ShapesPage from '@/app/_layout/shapes';
import '@nfid/identitykit/react/styles.css';
import Providers from './providers';
import { Toaster } from '@/components/ui/toaster';

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en" className="dark bg-[#060607] relative overflow-hidden h-full">
      <Providers>
        <body className="!pointer-events-auto !select-auto flex flex-col h-full isolate pb-24 sm:pb-28 md:pb-0">
          <HeaderPage />
          <ShapesPage />
          {children}
          <Toaster />
        </body>
      </Providers>
    </html>
  );
};

export default RootLayout;
