import type { Metadata } from 'next';
import { ReactNode } from 'react';
import '@/style/globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Appic Dao',
  description: 'Appic cross-chain swap built on ICP',
  icons: '/favicon.ico',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="font-rethink-sans relative bg-[#060607] md:h-full">
      {children}
      <Toaster toasterId="notification" />
      <Toaster toasterId="transactionNotification" />
    </html>
  );
}
