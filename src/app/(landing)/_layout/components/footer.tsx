import Image from 'next/image';
import Link from 'next/link';
import { FOOTER_NAV_ITEMS, SOCIAL_ITEMS } from '../constants';
import { cn } from '@/lib/utils';

export default function FooterSection() {
  return (
    <footer
      className={cn(
        'mx-auto w-full max-w-[1200px] px-6 pb-28 pt-14',
        'grid gap-x-10 gap-y-6',
        'md:grid-cols-2 lg:grid-cols-3 lg:pb-14 xl:px-0',
      )}
    >
      <div className="flex flex-col gap-y-6 xl:max-w-[285px]">
        <Image src={'/images/landing/logo/logo.png'} alt="" width={52} height={43} />
        <p className="flex max-w-80 items-center gap-x-2 text-sm text-white">
          <Image src="/images/landing/ornaments/icp.svg" alt="" width={200} height={40} />
        </p>
        <div className="flex items-center gap-x-4">
          {SOCIAL_ITEMS.map((item, idx) => (
            <Link key={idx} href={item.href} className="rounded-full bg-[#424242] p-2">
              {item.icon}
            </Link>
          ))}
        </div>
      </div>
      {FOOTER_NAV_ITEMS.map((item, idx) => (
        <div key={idx} className="grid gap-y-[18px]">
          <p className="text-[18px] font-bold text-[#3870DA]">{item.title}</p>
          <ul className="flex flex-col gap-y-4 text-white">
            {item.items.map((link, ids) => (
              <li key={ids}>
                {link.href ? (
                  <Link href={link.href} className="duration-150 hover:opacity-80">
                    {link.label}
                  </Link>
                ) : (
                  link.label
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </footer>
  );
}
