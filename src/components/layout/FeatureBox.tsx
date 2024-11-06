import React, { ReactNode } from "react";

type FeatureBoxProps = {
  children: ReactNode;
};

const FeatureBox: React.FC<FeatureBoxProps> = ({ children }) => {
  return (
    <div className=" w-full md:w-[38rem] md:bg-white bg-opacity-0 md:bg-opacity-25 rounded-xl backdrop-blur-sm">
      <div className="rounded-lg px md:px-16 py-8 md:bg-input-fields md:dark:bg-background-dark h-full flex flex-col gap-4 items-center w-full">
        {children}
      </div>
    </div>
  );
};

export default FeatureBox;
