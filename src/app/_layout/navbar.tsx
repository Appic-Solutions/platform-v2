'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NAVBAR_ITEMS } from '@/lib/constants/layout';

export default function NavbarPage() {
  const path = usePathname();

  return (
    <div
      className={cn('fixed bottom-0 z-[99] w-full pb-5 xl:pb-0', 'xl:absolute xl:top-8 xl:mx-auto')}
    >
      <ul
        className={cn(
          'flex items-center justify-center gap-x-6 xs:gap-x-8 lg:gap-x-1',
          'bg-[radial-gradient(75.61%_136.07%_at_48.06%_0%,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0)_100%)]',
          'rounded-full border-2 border-white/30 text-white backdrop-blur-sm',
          'px-[4%] py-2 sm:px-3',
          'mx-auto w-full max-w-[90%] md:max-w-[840px]',
        )}
      >
        {NAVBAR_ITEMS.map((item, idx) =>
          item.active ? (
            <li
              key={idx}
              className={cn(
                path === item.href &&
                  'bg-[linear-gradient(81.4deg,#000000_-15.41%,#1D1D1D_113.98%)]',
                path !== item.href &&
                  'lg:hover:bg-[linear-gradient(81.4deg,rgba(0,0,0,0.2)_-15.41%,rgba(29,29,29,0.2)_113.98%)]',
                'flex-1 rounded-full',
              )}
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center justify-center gap-x-1 md:gap-x-1.5',
                  path === item.href && 'max-md:px-4 max-sm:py-2.5',
                  'sm:py-2.5 md:px-4 md:py-4',
                )}
              >
                {item.Icon}
                <span
                  className={cn(
                    path === item.href ? 'inline-flex' : 'hidden',
                    'md:inline-flex',
                    'whitespace-nowrap lg:text-lg lg:font-bold',
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          ) : (
            <TooltipProvider key={idx}>
              <Tooltip>
                <TooltipTrigger
                  key={idx}
                  className={cn(
                    path === item.href &&
                      'bg-[linear-gradient(81.4deg,#000000_-15.41%,#1D1D1D_113.98%)]',
                    path !== item.href &&
                      'lg:hover:bg-[linear-gradient(81.4deg,rgba(0,0,0,0.2)_-15.41%,rgba(29,29,29,0.2)_113.98%)]',
                    'flex-1 rounded-full',
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center gap-x-1 md:gap-x-1.5',
                      path === item.href && 'max-md:px-4 max-sm:py-2.5',
                      'sm:py-2.5 md:px-4 md:py-4',
                    )}
                  >
                    {item.Icon}
                    <span
                      className={cn(
                        path === item.href ? 'inline-flex' : 'hidden',
                        'md:inline-flex',
                        'whitespace-nowrap lg:text-lg lg:font-bold',
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">{item.tooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ),
        )}
      </ul>
    </div>
  );
}
