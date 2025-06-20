import React from 'react';

const ChartDataBox = ({
  price,
  label,
  underPriceText,
}: {
  price: number;
  label: string;
  underPriceText: string;
}) => {
  return (
    <div className="h-[148px] w-[166px] rounded-[20px] bg-box-border-gradient p-0.5 backdrop-blur-[30px] lg:h-[188px] lg:w-[210px] lg:rounded-[35px]">
      <div className="flex h-full w-full flex-col justify-between rounded-[20px] bg-box-background-secondary px-6 py-4 font-semibold lg:rounded-[35px]">
        <p className="text-base text-[#FFFFFFB8] lg:text-[21px]">{label}</p>
        <div className="flex flex-col gap-2">
          <p className="text-[22px] lg:text-[27px]">{price.toFixed(2)}</p>
          <p className="text-xs text-[#FFFFFF7A] lg:text-sm">{underPriceText}</p>
        </div>
      </div>
    </div>
  );
};

export default ChartDataBox;
