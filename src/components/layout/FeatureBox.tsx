import React, { ReactNode } from "react";

type FeatureBoxProps = {
  children: ReactNode;
};

const FeatureBox: React.FC<FeatureBoxProps> = ({ children }) => {
  return (
    <div className="p-2 w-full lg:w-min lg:max-w-[80%] min-w-[40%] lg:bg-white lg:bg-opacity-25 rounded-xl backdrop-blur-sm">
      <div className="rounded-lg lg:px-16 py-8 lg:bg-input-fields lg:dark:bg-background-dark h-full flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
};

export default FeatureBox;
