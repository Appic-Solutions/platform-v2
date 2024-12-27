import { cn } from "@/common/helpers/utils";
import React, { useState } from "react";
import BridgeOption from "./BridgeOption";
import BridgeOptionSkeleton from "./BridgeOptionSkeleton";

// TODO: This is a temporary code for testing purposes only

export type BridgeOptionType = {
  id: number;
  amount: number;
  via: string;
  time: number;
  usdPrice: number;
  isBest: boolean;
  isActive: boolean;
};

const options: BridgeOptionType[] = [
  {
    id: 1,
    amount: 1.154844,
    via: "ICP",
    time: 10,
    usdPrice: 1.84,
    isBest: true,
    isActive: true,
  },
  {
    id: 2,
    amount: 1.222,
    via: "ICP",
    time: 10,
    usdPrice: 1.24,
    isBest: false,
    isActive: true,
  },
  {
    id: 3,
    amount: 1.363154,
    via: "ICP",
    time: 10,
    usdPrice: 1.51,
    isBest: false,
    isActive: false,
  },
  {
    id: 4,
    amount: 1.154844,
    via: "ICP",
    time: 10,
    usdPrice: 1.24,
    isBest: false,
    isActive: true,
  },
];

interface BridgeOptionsListProps {
  handleOptionSelect: (option: BridgeOptionType) => void;
  selectedOption: BridgeOptionType | null;
}

const BridgeOptionsList = ({
  selectedOption,
  handleOptionSelect,
}: BridgeOptionsListProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOption, setExpandedOption] = useState<BridgeOptionType | null>(
    null
  );

  setTimeout(() => {
    setIsLoading(false);
  }, 1000);

  const handleExpand = (option: BridgeOptionType) => {
    if (expandedOption === option) {
      setExpandedOption(null);
    } else {
      setExpandedOption(option);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-start mb-5",
        "lg:w-full md:pr-2",
        "animate-slide-in opacity-0"
      )}
    >
      <div
        className={cn(
          "flex lg:flex-col gap-4 w-full",
          "lg:h-full",
          "overflow-x-auto lg:overflow-y-auto",
          "pr-4 hide-scrollbar"
        )}
      >
        {!isLoading ? (
          options.map((item) => (
            <div key={item.id} className="flex-shrink-1 h-fit">
              <BridgeOption
                option={item}
                isSelected={selectedOption?.id === item.id}
                isExpanded={expandedOption?.id === item.id}
                handleOptionSelect={(option) => handleOptionSelect(option)}
                onExpand={handleExpand}
              />
            </div>
          ))
        ) : (
          <>
            <BridgeOptionSkeleton />
            <BridgeOptionSkeleton />
            <BridgeOptionSkeleton />
            <BridgeOptionSkeleton />
          </>
        )}
      </div>
    </div>
  );
};

export default BridgeOptionsList;
