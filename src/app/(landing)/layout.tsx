import type { Metadata } from 'next';
import { ReactNode } from 'react';
import HeaderSection from './_layout/components/header';
import FooterSection from './_layout/components/footer';

export const metadata: Metadata = {
  title: 'Appic Dao',
  description: 'Appic cross-chain swap built on ICP',
  icons: '/favicon.ico',
};

export default function LandingLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="relative mx-auto max-w-[1920px]">
      <HeaderSection />
      {children}
      <FooterSection />
    </main>
  );
}
