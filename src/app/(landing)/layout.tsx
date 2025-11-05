import { ReactNode } from 'react';
import HeaderSection from './_layout/components/header';
import FooterSection from './_layout/components/footer';
import AOSWrapper from '@/lib/wrappers/aos';

export default function LandingLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <body className="relative mx-auto max-w-[1920px]">
      <HeaderSection />
      <AOSWrapper>{children}</AOSWrapper>
      <FooterSection />
    </body>
  );
}
