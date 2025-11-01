'use client';
import React from 'react';
import { ExpandLeftIcon } from '@/components/icons';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    const referrer = document.referrer;
    const currentHost = window.location.hostname;
    const referrerHost = referrer ? new URL(referrer).hostname : '';
    if (window.history.length <= 1 || (referrerHost && referrerHost !== currentHost)) {
      router.push('/swap');
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className="absolute left-4 flex items-center justify-center gap-x-1 font-semibold md:left-8"
    >
      <ExpandLeftIcon width={18} height={18} className="min-h-[18px] min-w-[18px]" />
      Back
    </button>
  );
}
