"use client";

import { usePathname } from "next/navigation";

import { PropsWithChildren, useRef, useEffect, createContext } from "react";

// previous pathname provider
export const PreviousPathnameContext = createContext<string | undefined>(
  undefined
);

function PreviousPathnameProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const ref = useRef<string>();

  useEffect(() => {
    ref.current = pathname;
  }, [pathname]);

  return (
    <PreviousPathnameContext.Provider value={ref.current}>
      {children}
    </PreviousPathnameContext.Provider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return <PreviousPathnameProvider>{children}</PreviousPathnameProvider>;
}
