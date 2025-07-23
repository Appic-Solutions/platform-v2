import React from 'react';
import { CreatePositionProvider } from './_context/CreatePositionContext';

const CreatePositionLayout = ({ children }: { children: React.ReactNode }) => {
  return <CreatePositionProvider>{children}</CreatePositionProvider>;
};

export default CreatePositionLayout;
