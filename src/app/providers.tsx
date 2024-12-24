'use client';

import { usePathname } from 'next/navigation';

import { PropsWithChildren, useRef, useEffect, createContext } from 'react';

import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

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

// react query provider
let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) return makeQueryClient();
  else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <PreviousPathnameProvider>{children}</PreviousPathnameProvider>
    </QueryClientProvider>
  );
}
