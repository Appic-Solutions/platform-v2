'use client';
import Image from 'next/image';
import Wallet from './wallet';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function HeaderPage() {
  return (
    <header className={cn('flex w-full items-center justify-between', 'mb-5 xl:mt-4')}>
      <Link href="/" className="relative h-[34px] w-[42px] md:h-[42px] md:w-[52px]">
        <Image src={'/images/landing/logo/swapic-logo.svg'} alt="Logo" fill />
      </Link>
      <Wallet />
    </header>
  );
}
