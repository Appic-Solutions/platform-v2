import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ReactNode } from 'react';

type MinimizeProgressBarWidgetProps = {
  icon: ReactNode;
};

export default function MinimizeProgressBarWidget({ icon }: MinimizeProgressBarWidgetProps) {
  return (
    <Link
      href={'/transactions-history/bridge'}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full',
        'fixed bottom-6 right-6 isolate z-50',
        'before:absolute before:inset-0 before:animate-spin before:rounded-full before:border-2 before:border-green-500 before:border-t-transparent',
      )}
    >
      {icon}
    </Link>
  );
}
