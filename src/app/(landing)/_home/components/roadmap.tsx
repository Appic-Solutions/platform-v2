'use client';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { ROADMAP_ITEMS } from '../constants';

export default function Roadmap() {
  const [activeDot, setActiveDot] = useState<number>(1);

  const [sliderRef, instanceRef] = useKeenSlider({
    mode: 'snap',
    slideChanged(e) {
      setActiveDot(e.track.details.rel);
    },
    initial: 1,
    slides: {
      origin: 'center',
      perView: 2,
      spacing: 15,
    },
  });

  return (
    <section
      id="Roadmap"
      data-aos="fade-up"
      className="flex scroll-mt-24 flex-col gap-y-14 lg:scroll-mt-32 xl:gap-y-40"
    >
      <div
        className={cn(
          'mx-auto w-full max-w-[1200px] px-6',
          'flex flex-col items-center justify-center gap-y-2 text-center',
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
          Roadmap
        </p>
        <p className="max-w-[293px] text-sm leading-[26px] text-white md:max-w-[354px] md:text-base xl:max-w-3xl">
          Swapic’s roadmap builds from an EVM-ICP bridge to a full cross-chain swap layer on ICP,
          targeting late 2025 completion. It includes ICP-to-EVM bridging, a Dex, and a swap router.
        </p>
      </div>

      {/* Desktop */}
      <div className="relative hidden flex-col gap-y-28 md:flex xl:gap-y-44">
        {/* dots */}
        <div
          className={cn(
            'mx-auto w-full max-w-[1100px]',
            'flex items-center justify-between',
            "before:contents-[''] before:absolute before:inset-x-0 before:h-px before:w-full before:bg-white",
          )}
        >
          {ROADMAP_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                'z-10 flex cursor-pointer items-center justify-center gap-y-4 text-[22px] font-bold leading-[28px] text-white',
                item.position === 'top'
                  ? '-translate-y-[22px] flex-col'
                  : 'translate-y-[22px] flex-col-reverse',
              )}
              onClick={() => {
                setActiveDot(idx);
                instanceRef.current?.moveToIdx(idx);
              }}
            >
              {item.label}
              <span
                className={cn(
                  'max-h-6 min-h-6 min-w-6 max-w-6 rounded-full border border-white bg-black',
                  idx < activeDot && 'bg-white',
                  activeDot === idx && 'bg-[#3870DA] shadow-[0_0_20px_0_#2563eb]',
                )}
              />
            </div>
          ))}
        </div>
        {/* cards */}
        <div ref={sliderRef} className="keen-slider">
          {ROADMAP_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                'keen-slider__slide',
                'flex items-center justify-center bg-[linear-gradient(170deg,#4C4C4C_18.37%,rgba(57,57,57,_0.3)_70.34%)] p-0.5',
                'rounded-[20px] text-white xl:col-span-2 xl:row-start-2 xl:mx-auto xl:gap-y-10',
              )}
            >
              <div
                className={cn(
                  'animate-border-move-rotate absolute inset-0 h-[100px] w-[100px] rotate-45',
                  'bg-[radial-gradient(#949494,#949494,_transparent)]',
                )}
                style={{ offsetPath: 'rect(0% auto 100% auto)' }}
              />
              <div
                className={cn(
                  'relative h-full w-full overflow-hidden rounded-[20px] px-6 py-4',
                  'bg-[linear-gradient(180deg,rgba(18,18,18,_1)_0%,rgba(33,33,33,_1)_100%),linear-gradient(0deg,rgba(255,255,255,_1),rgba(255,255,255,_1))]',
                )}
              >
                <div className="mb-2 flex items-center gap-x-4 text-lg font-bold">
                  <span className="text-[#3870DA]">Completed</span>
                  <h3 className="text-white">{item.title}</h3>
                </div>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Version */}
      <div className="flex flex-col gap-y-0 px-6 md:hidden">
        {ROADMAP_ITEMS.map((item, index) => (
          <div key={index} className="flex w-full items-start justify-start gap-x-6">
            <div
              className={cn(
                'relative z-40 flex items-center justify-center rounded-full border border-white p-3',
                index === 0 ? 'bg-blue-600' : 'bg-gray-300',
              )}
            />
            <div
              className={cn(
                'relative flex flex-col gap-4 pb-6',
                "after:absolute after:-left-[38px] after:h-full after:w-[1px] after:bg-gray-300 after:content-['']",
              )}
            >
              <p className="text-[22px] font-bold text-white">{item.label}</p>
              <div
                className={cn(
                  'keen-slider__slide rounded-[20px] text-white xl:col-span-2 xl:row-start-2 xl:mx-auto xl:gap-y-10',
                  'relative flex items-center justify-center overflow-hidden bg-[linear-gradient(170deg,#4C4C4C_18.37%,rgba(57,57,57,_0.3)_70.34%)] p-0.5',
                )}
              >
                <div
                  className={cn(
                    'animate-border-move-rotate absolute inset-0 h-[100px] w-[100px] rotate-45',
                    'bg-[radial-gradient(#fff,#f1f5f9,_transparent)]',
                  )}
                  style={{ offsetPath: 'rect(0% auto 100% auto)' }}
                />
                <div
                  className={cn(
                    'relative w-full overflow-hidden rounded-[20px] px-6 py-4',
                    'bg-[linear-gradient(180deg,rgba(18,18,18,_1)_0%,rgba(33,33,33,_1)_100%),linear-gradient(0deg,rgba(255,255,255,_1),rgba(255,255,255,_1))]',
                  )}
                >
                  <div className="mb-2 flex items-center gap-x-4 text-lg font-bold">
                    <h3 className="text-white">{item.title}</h3>
                  </div>
                  <p className="text-sm font-normal text-white/80">{item.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}