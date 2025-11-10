import type { Metadata } from 'next';
import HeaderPage from '@/app/(panel)/_layout/header';
import ShapesPage from '@/app/(panel)/_layout/shapes';
import { cn } from '@/lib/utils';
import NavbarPage from './_layout/navbar';

export const metadata: Metadata = {
  title: 'Appic Dao',
  description: 'Appic cross-chain swap built on ICP',
  icons: '/favicon.ico',
};

export default function PanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main
      className={cn(
        '!pointer-events-auto relative isolate !select-auto',
        'flex flex-col items-center justify-center',
        'min-h-screen !px-6 !py-3.5 md:!py-8',
      )}
    >
      <HeaderPage />
      <ShapesPage />
      <div className="mb-28 flex w-full flex-1 md:items-center md:justify-center xl:mb-0">
        {children}
      </div>
      <NavbarPage />
    </main>
  );
}
