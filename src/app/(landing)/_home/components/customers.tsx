import { cn } from '@/lib/utils';
import Image from 'next/image';
import { CUSTOMERS_IMAGES } from '../constants';

export default function Customers() {
  return (
    <section
      id="Customers"
      className={cn(
        'mx-auto mb-20 mt-24 w-full max-w-[1200px] select-none scroll-mt-24 overflow-clip',
        'md:mb-44 md:grid-cols-3 lg:scroll-mt-32',
      )}
    >
      <div
        className={cn('bg-background overflow-hidden outline')}
        style={{
          mask: 'linear-gradient(90deg, transparent, white 20%, white 80%, transparent)',
          WebkitMask: 'linear-gradient(90deg, transparent, white 20%, white 80%, transparent)',
        }}
      >
        <ul className="flex w-max animate-infinite-scroll flex-nowrap items-center gap-x-20 py-2 grayscale">
          {CUSTOMERS_IMAGES.concat(CUSTOMERS_IMAGES).map((item, idx) => (
            <li
              key={idx}
              className="font-rounded-mplus flex items-center justify-center gap-x-4 text-3xl text-[#B0B0B0]"
            >
              <Image src={item.logo} alt={item.label} width={55} height={55} />
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
