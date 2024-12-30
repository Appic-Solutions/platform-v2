'use client';
import { usePathname } from 'next/navigation';
import { PropsWithChildren, useRef, useEffect, createContext } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// previous pathname provider
export const PreviousPathnameContext = createContext<string | undefined>(undefined);

function PreviousPathnameProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const ref = useRef<string>();

  useEffect(() => {
    ref.current = pathname;
  }, [pathname]);

  return <PreviousPathnameContext.Provider value={ref.current}>{children}</PreviousPathnameContext.Provider>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <PreviousPathnameProvider>{children}</PreviousPathnameProvider>
    </QueryClientProvider>
  );
}
