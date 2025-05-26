'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NAVBAR_ITEMS } from '@/lib/constants/layout';

const NavbarPage = () => {
  const path = usePathname();

  return (
    <ul
      className={cn(
        'fixed bottom-3.5 left-6 right-6 z-[99]',
        'rounded-full border-[1.63px] border-white/30 text-white',
        'bg-[radial-gradient(75.61%_136.07%_at_48.06%_0%,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0)_100%)]',
        'grid h-[63px] grid-cols-4 items-center gap-x-1 px-3 py-1.5',
        'sm:h-[78px] sm:px-4 sm:py-2',
        'md:static md:col-span-8 md:mx-auto md:w-full md:max-w-[610px]',
        'xl:max-w-[775px]',
      )}
    >
      {NAVBAR_ITEMS.map((item, idx) =>
        item.active ? (
          <li
            key={idx}
            className={cn(
              'flex h-full w-full items-center justify-center rounded-full',
              path === item.href && 'bg-[linear-gradient(81.4deg,#000000_-15.41%,#1D1D1D_113.98%)]',
              'md:hover:bg-[linear-gradient(81.4deg,rgba(0,0,0,0.2)_-15.41%,rgba(29,29,29,0.2)_113.98%)]',
              '*:flex *:h-full *:w-full *:items-center *:justify-center *:gap-x-1.5',
            )}
          >
            <Link href={item.href}>
              {item.Icon}
              <span className={cn('hidden md:flex', 'lg:text-lg lg:font-bold')}>{item.label}</span>
            </Link>
          </li>
        ) : (
          <TooltipProvider key={idx}>
            <Tooltip>
              <TooltipTrigger
                key={idx}
                className={cn(
                  'flex h-full w-full items-center justify-center gap-x-1.5 rounded-full',
                  'hover:bg-[linear-gradient(81.4deg,rgba(0,0,0,0.2)_-15.41%,rgba(29,29,29,0.2)_113.98%)]',
                )}
              >
                {item.Icon}
                <span className={cn('hidden md:flex', 'lg:text-lg lg:font-bold')}>
                  {item.label}
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom">{item.tooltip}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
      )}
    </ul>
  );
};

export default NavbarPage;
