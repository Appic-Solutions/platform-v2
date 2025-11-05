'use client';

import CustomCard from '../../_components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { KEY_FEATURES } from '../constants';
import { useEffect, useState } from 'react';

export default function Features() {
  const [activeItem, setActiveItem] = useState<number>(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveItem((prev) => {
        if (prev === KEY_FEATURES.length) {
          return 1;
        }

        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [activeItem]);

  return (
    <section
      id="Features"
      className={cn(
        'mx-auto w-full max-w-[1300px] scroll-mt-24 overflow-clip px-6',
        'flex flex-col items-center justify-center gap-x-16 gap-y-28',
        'lg:scroll-mt-32 xl:flex-row xl:items-end xl:px-0',
      )}
    >
      <div className="flex w-full flex-col gap-y-16 md:gap-y-14 xl:gap-y-24">
        <div
          className={cn(
            'flex w-full flex-col items-center justify-center gap-y-2 text-center',
            'md:gap-y-3 xl:items-start xl:gap-y-4 xl:text-left',
          )}
        >
          <p
            className={cn(
              'max-w-fit bg-clip-text text-[28px] leading-[30px] text-transparent',
              'bg-[linear-gradient(90deg,#6E6E6E_0%,#FFFFFF_34.45%,#FFFFFF_51.67%,#6E6E6E_86.12%)]',
              'md:mx-auto md:text-[34px] md:leading-[37px] xl:mx-0 xl:text-[49px] xl:leading-[54px]',
            )}
          >
            Key Features
          </p>
        </div>
        <div className="flex w-full flex-col gap-16 pb-4 md:flex-row">
          {/* boxes */}
          <div
            data-aos="fade-right"
            className="grid h-fit w-full gap-10 overflow-hidden md:col-span-7 md:w-[65%] md:grid-cols-2"
          >
            {KEY_FEATURES.map((item, idx) => (
              <CustomCard
                customOnClick={() => setActiveItem(idx + 1)}
                key={idx}
                label={item.label}
                description={item.desc}
                icon={item.icon}
                isActive={idx + 1 === activeItem}
                className="h-fit cursor-pointer"
              />
            ))}
          </div>
          {/* screenshots */}
          <div className="relative z-10 h-[700px] w-[342px] translate-x-12 rotate-[-4deg] overflow-hidden rounded-[50px] md:translate-x-0 md:rotate-0">
            <Image
              className="absolute z-10"
              src="/images/landing/features/mobile-frame.png"
              alt="mobile-frame"
              fill
            />
            {KEY_FEATURES.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  'absolute left-0 top-0 flex h-full w-full items-center justify-center transition-all duration-500',
                  idx + 1 === activeItem ? 'translate-x-0 opacity-100' : 'translate-x-52 opacity-0',
                )}
              >
                <Image
                  src={item.screenshotPath!}
                  alt={item.label}
                  width={310}
                  height={672}
                  className="rounded-[40px]"
                  quality={100}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
