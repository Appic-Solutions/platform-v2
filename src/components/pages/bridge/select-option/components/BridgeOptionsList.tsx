import { cn } from "@/lib/utils";
import React from "react";
import BridgeOption from "./BridgeOption";

// TODO: This is a temporary code for testing purposes only
const options = [
  {
    id: 1,
    amount: 1.154844,
    via: "ICP",
    time: 10,
    usdPrice: 1.24,
    isBest: true,
    isActive: true,
  },
  {
    id: 2,
    amount: 1.154844,
    via: "ICP",
    time: 10,
    usdPrice: 1.24,
    isBest: false,
    isActive: true,
  },
  {
    id: 3,
    amount: 1.154844,
    via: "ICP",
    time: 10,
    usdPrice: 1.24,
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

export type BridgeOptionType = (typeof options)[number];

interface BridgeOptionsListProps {
  selectedOption: BridgeOptionType | null;
  expandedOption: BridgeOptionType | null;
  handleOptionSelect: (option: BridgeOptionType) => void;
  handleExpand: (option: BridgeOptionType) => void;
}

const BridgeOptionsList = ({
  selectedOption,
  expandedOption,
  handleOptionSelect,
  handleExpand,
}: BridgeOptionsListProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-start w-full",
        "lg:max-w-[45%] md:pr-2",
        "animate-slide-in opacity-0 delay-300"
      )}
    >
      <div className="w-full flex lg:flex-col gap-4 h-full overflow-x-scroll lg:overflow-y-scroll pr-4 hide-scrollbar">
        {options.map((item) => (
          <div key={item.id} className="flex-shrink-0 h-fit">
            <BridgeOption
              option={item}
              isSelected={selectedOption?.id === item.id}
              isExpanded={expandedOption?.id === item.id}
              onSelect={handleOptionSelect}
              onExpand={handleExpand}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BridgeOptionsList;
