'use client';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { FAQ_ITEMS } from '../constants';
import { ArrowRightIcon, ChevronDownIcon } from '../../_components/icon';

export default function Faq() {
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeFaqItem, setActiveFaqItem] = useState(0);

  return (
    <section
      id="FAQ"
      className={cn(
        'mx-auto my-20 mt-32 w-full max-w-[1240px] scroll-mt-24 px-6',
        'flex flex-col gap-x-14 gap-y-16 overflow-hidden',
        'md:mb-48 md:mt-36 lg:mt-64 lg:scroll-mt-64 lg:flex-row lg:items-end xl:px-0',
      )}
    >
      <div
        data-aos="fade-up-right"
        className="flex flex-col gap-y-10 overflow-hidden lg:max-h-fit lg:gap-y-20 xl:min-w-[480px]"
      >
        <div
          className={cn(
            'flex w-full flex-col justify-center gap-y-3',
            'md:gap-y-3 xl:items-start xl:gap-y-4 xl:text-left',
          )}
        >
          <div
            className={cn(
              '*:max-w-fit *:bg-clip-text *:text-[28px] *:leading-[30px] *:text-transparent',
              '*:bg-[linear-gradient(90deg,#6E6E6E_0%,#FFFFFF_34.45%,#FFFFFF_51.67%,#6E6E6E_86.12%)]',
              '*:md:text-[34px] *:md:leading-[37px] *:xl:mx-0 *:xl:text-[49px] *:xl:leading-[54px]',
            )}
          >
            <p>FAQ</p>
          </div>
          <p
            className={cn(
              'max-w-[293px] text-sm leading-[18px] text-white',
              'md:max-w-[375px] md:text-[18px] md:leading-[22px]',
              'xl:text-[26px] xl:leading-[31px]',
            )}
          >
            Get answers to your questions about Appic’s innovative cross-chain solutions.
          </p>
        </div>

        {/* faq titles */}
        <div className="flex flex-1 flex-col gap-6 md:flex-row md:justify-between lg:flex-col">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                'flex cursor-pointer items-center justify-between gap-x-4 rounded-[24px] px-8 py-6 text-black',
                'bg-[linear-gradient(90deg,rgba(217,217,217,_0.7)_0%,rgba(115,115,115,_0.9)_100%)]',
                'xl:text-[24px] xl:font-semibold xl:leading-[31px]',
                activeFaq === idx &&
                  'bg-[linear-gradient(159.81deg,_#1343A0_-34.87%,rgba(19,67,160,_0.5)_151.64%)] font-bold text-white',
              )}
              onClick={() => {
                setActiveFaq(idx);
                setActiveFaqItem(0);
              }}
            >
              {item.title}
              <ArrowRightIcon width={24} height={24} className="lg:min-h-8 lg:min-w-8" />
            </div>
          ))}
        </div>
      </div>

      {/* faq contents */}
      <div data-aos="fade-up-left" className="flex flex-1 flex-col gap-y-10 overflow-hidden">
        {FAQ_ITEMS[activeFaq].items.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              'flex flex-col gap-y-5 rounded-[10px] bg-[#42424280] px-6 py-6',
              'cursor-pointer leading-[31px] text-white duration-200',
              'overflow-hidden md:text-[20px]',
              activeFaqItem === idx &&
                'bg-[#1343A0] drop-shadow-[0_3px_20px_5px_#651FFF33] backdrop-blur-[27px]',
            )}
            onClick={() => setActiveFaqItem(idx)}
          >
            <div className="flex h-8 min-h-fit items-center justify-between gap-x-1">
              {item.label}
              <ChevronDownIcon
                className={cn('duration-200', activeFaqItem === idx ? 'rotate-180' : 'rotate-0')}
              />
            </div>
            {activeFaqItem === idx && <div>{item.content}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
