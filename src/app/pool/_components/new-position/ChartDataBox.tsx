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
    <div className="bg-box-border-gradient h-[188px] w-[210px] rounded-[35px] p-0.5 backdrop-blur-[30px]">
      <div className="bg-box-background-secondary flex h-full w-full flex-col justify-between rounded-[35px] px-6 py-4 font-semibold">
        <p className="text-[21px] text-[#FFFFFFB8]">{label}</p>
        <div className="flex flex-col gap-2">
          <p className="text-[27px]">{price.toFixed(2)}</p>
          <p className="text-sm text-[#FFFFFF7A]">{underPriceText}</p>
        </div>
      </div>
    </div>
  );
};

export default ChartDataBox;
