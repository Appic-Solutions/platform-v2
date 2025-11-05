'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { TOKENOMICS_ITEMS } from '../constants';
import CustomCard from '../../_components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from '../../_components/common/chart';
import { Pie, PieChart } from 'recharts';
import { CHART_CONFIG, CHART_DATA } from '../constants';

export default function Tokenomics() {
  return (
    <section
      id="Tokenomics"
      className={cn(
        'mx-auto mb-32 mt-24 w-full max-w-[1200px] scroll-mt-24 overflow-hidden px-6',
        'flex flex-col gap-y-14 xl:gap-y-28',
        'md:my-36 lg:scroll-mt-32 xl:my-44 xl:px-0',
      )}
    >
      {/* top section */}
      <div
        className={cn(
          'grid place-content-center items-center justify-items-center gap-x-12 gap-y-12',
          'md:grid-cols-2 md:items-start md:gap-y-16 xl:justify-items-start xl:gap-y-0',
        )}
      >
        <div data-aos="fade-up-right" className="flex flex-col gap-y-8">
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
              Tokenomics
            </p>
            <p
              className={cn(
                'max-w-[293px] text-sm leading-[18px] text-white',
                'md:max-w-[354px] md:text-[18px] md:leading-[22px]',
                'xl:max-w-[515px] xl:text-[26px] xl:leading-[31px]',
              )}
            >
              Appic token can be staked for rewards, used for voting on Governance, applied to cover
              transaction fees, or to earn liquidity incentives.
            </p>
          </div>
          <div
            className={cn(
              'flex flex-col items-center justify-center gap-y-12',
              'md:items-start md:justify-normal md:gap-y-8',
              'xl:gap-y-12',
            )}
          >
            <p
              className={cn(
                'max-w-[317px] xl:max-w-[461px]',
                'text-center text-lg text-white md:text-start xl:text-[24px] xl:leading-[29px]',
              )}
            >
              Early investors have the opportunity to purchase Appic tokens at a discounted rate. To
              take advantage of this exclusive offer and join the Appic ecosystem, get in touch with
              us using the button below.
            </p>
            <Link
              href="mailto:vibes@appicdao.com"
              className={cn(
                'flex items-center justify-center',
                'h-[60px] w-[238px] rounded-[20px] text-white duration-200',
                'bg-[linear-gradient(90deg,#1C68F8_0%,#1753C5_71.5%,#113D92_100%),linear-gradient(318.8deg,rgba(255,255,255,0)_35.19%,rgba(255,255,255,0.3)_92.55%)]',
                'hover:shadow-[0_0_20px_5px_#113D92] hover:ring-2 hover:ring-[#113D92]',
              )}
            >
              Get in Touch
            </Link>
          </div>
        </div>
        <div
          data-aos="fade-up-left"
          className={cn('grid gap-y-5', 'md:col-span-2 md:grid-cols-2 md:gap-x-9 xl:col-span-1')}
        >
          {TOKENOMICS_ITEMS.map((item, idx) => (
            <CustomCard
              key={idx}
              label={item.label}
              description={item.desc}
              icon={item.icon}
              className={idx === 2 ? 'xl:col-start-2 xl:col-end-3' : ''}
            />
          ))}
        </div>
      </div>
      {/* bottom section */}
      <div
        data-aos="fade-up"
        className={cn(
          'grid place-content-center items-center justify-items-center gap-x-12 gap-y-12',
          'md:grid-cols-2 md:items-start md:gap-y-16 xl:justify-items-start xl:gap-y-0',
        )}
      >
        <div
          className={cn(
            'relative flex items-center justify-center overflow-hidden rounded-[40px] text-white',

            "before:contents-[''] before:absolute before:top-1/2 before:z-0 before:h-[300px] before:w-[100px]",
            'before:origin-top before:translate-x-0 before:translate-y-0 before:animate-border-rotate',
            'before:bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(102,102,102,0.75)_50%,rgba(255,255,255,0)_100%)]',

            "after:contents-[''] after:absolute after:top-1/2 after:z-0 after:h-[300px] after:w-[100px]",
            'after:origin-top after:translate-x-0 after:translate-y-0 after:animate-[border-rotate_6s_linear_forwards_infinite]',
            'after:bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(102,102,102,0.75)_50%,rgba(255,255,255,0)_100%)]',

            'xl:col-span-2 xl:row-start-2 xl:mx-auto xl:gap-y-10',
          )}
        >
          <div
            className={cn(
              'z-10 m-0.5 flex w-full max-w-[399px] flex-col items-center justify-center gap-y-8 rounded-[40px] py-10',
              'bg-[linear-gradient(180deg,rgba(18,18,18,1)_0%,rgba(33,33,33,1)_100%),linear-gradient(0deg,rgba(255,255,255,1),rgba(255,255,255,1))]',
              'px-4 xl:py-12',
            )}
          >
            <div className="flex flex-col items-center sm:px-4 xl:px-12">
              <p className="text-center font-bold">Appic Token Distribution</p>
              <ChartContainer config={CHART_CONFIG} className="mx-auto aspect-square h-[320px]">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    active={true}
                    content={<ChartTooltipContent active={true} className="bg-white text-black" />}
                  />
                  <ChartLegend align="center" verticalAlign="bottom" />
                  <Pie
                    data={CHART_DATA}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    width={380}
                    height={380}
                    cornerRadius={16}
                    paddingAngle={7}
                  />
                </PieChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
