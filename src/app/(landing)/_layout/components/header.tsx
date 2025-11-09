'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import Wallet from '@/app/(panel)/_layout/wallet';
import { useEffect, useState } from 'react';
import { NAVBAR_ITEMS } from '../constants';

export default function HeaderSection() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target.id);

        if (visibleSections.includes('HeroBanner') || visibleSections.includes('Customers')) {
          setActiveSection('#HeroBanner');
          history.replaceState(null, '', '#HeroBanner');
        } else if (visibleSections.length > 0) {
          const firstVisible = `#${visibleSections[0]}`;
          setActiveSection(firstVisible);
          history.replaceState(null, '', firstVisible);
        }
      },
      { threshold: 0.6 },
    );

    sections.forEach((section) => observer.observe(section));

    const sectionHash = window.location.hash;
    if (sectionHash) {
      setActiveSection(sectionHash);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 z-50 mx-auto flex max-w-[1920px] items-center justify-between p-6',
        'lg:grid lg:grid-cols-12',
      )}
    >
      {/* Logo */}
      <Link
        href={'#HeroBanner'}
        className="relative h-[34px] w-[42px] md:h-[42px] md:w-[52px] lg:col-span-2"
      >
        <Image src={'/images/landing/logo/logo.png'} alt="Logo" fill />
      </Link>

      {/* Navbar */}
      <ul
        className={cn(
          'fixed bottom-3.5 left-6 right-6 z-[99]',
          'rounded-full border-[1.63px] border-white/30 text-white backdrop-blur-[102px]',
          'bg-[radial-gradient(75.61%_136.07%_at_48.06%_0%,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0)_100%)]',
          'grid h-[62px] grid-cols-4 items-center gap-x-1 px-3 py-1.5',
          'lg:static lg:col-span-8 lg:mx-auto lg:w-full lg:max-w-[596px]',
        )}
      >
        {NAVBAR_ITEMS.map((item, idx) => (
          <li
            key={idx}
            className={cn(
              'flex h-[46px] w-full items-center justify-center rounded-full',
              activeSection === item.href &&
                'bg-[linear-gradient(81.4deg,#000000_-15.41%,#1D1D1D_113.98%)]',
              'hover:bg-[linear-gradient(81.4deg,rgba(0,0,0,0.2)_-15.41%,rgba(29,29,29,0.2)_113.98%)]',
              '*:flex *:h-full *:w-full *:items-center *:justify-center *:gap-x-1.5',
            )}
          >
            <Link
              href={item.href}
              onClick={() => setActiveSection(item.href)}
              className="flex items-center gap-x-1"
            >
              {item.Icon}
              <span className="hidden text-sm lg:flex">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <Wallet />
    </header>
  );
}
