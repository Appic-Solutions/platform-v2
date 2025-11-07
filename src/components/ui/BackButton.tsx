'use client';
import React from 'react';
import { ExpandLeftIcon } from '@/components/icons';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    const referrer = document.referrer;
    const currentHost = window.location.hostname;
    let referrerHost = '';

    if (referrer) {
      try {
        referrerHost = new URL(referrer).hostname;
      } catch {}
    }

    const isExternal = !referrer || referrerHost !== currentHost;
    const canGoBack =
      window.history.length > 1 || (window.history.state && window.history.state.idx > 0);

    if (isExternal) return router.push('/');

    if (canGoBack) {
      router.back();
      setTimeout(() => {
        if (window.history.state?.idx === 0) router.push('/');
      }, 500);
    } else {
      router.push('/');
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
