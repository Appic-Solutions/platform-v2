import React from 'react';

const ChartDataBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[148px] w-[166px] rounded-[20px] bg-box-border-gradient p-0.5 backdrop-blur-[30px] lg:h-[188px] lg:w-[210px] lg:rounded-[35px]">
      <div className="flex h-full w-full flex-col justify-between rounded-[20px] bg-box-background-secondary px-6 py-4 font-semibold lg:rounded-[35px]">
        {children}
      </div>
    </div>
  );
};

export default ChartDataBox;
