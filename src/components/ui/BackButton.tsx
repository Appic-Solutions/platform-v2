'use client';
import React from 'react';
import { ExpandLeftIcon } from '@/components/icons';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="absolute left-4 flex items-center justify-center gap-x-1 font-semibold md:left-8"
    >
      <ExpandLeftIcon width={18} height={18} className="min-h-[18px] min-w-[18px]" />
      Back
    </button>
  );
}
