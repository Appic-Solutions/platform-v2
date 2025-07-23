'use client';

import { createContext, useContext } from 'react';
import useCreatePositionLogic from '../_logic/useCreatePositionLogic';

type CreatePositionContextType = ReturnType<typeof useCreatePositionLogic>;

const CreatePositionContext = createContext<CreatePositionContextType | undefined>(undefined);

export function CreatePositionProvider({ children }: { children: React.ReactNode }) {
  const poolLogic = useCreatePositionLogic();
  return (
    <CreatePositionContext.Provider value={poolLogic}>{children}</CreatePositionContext.Provider>
  );
}

export function useCreatePosition() {
  const context = useContext(CreatePositionContext);
  if (!context) {
    throw new Error('useCreatePosition must be used within a CreatePositionProvider');
  }
  return context;
}
