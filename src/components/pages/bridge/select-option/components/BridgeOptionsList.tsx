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
  selectedOption: number | null;
  expandedOption: number | null;
  handleOptionSelect: (optionId: number) => void;
  handleExpand: (optionId: number) => void;
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
        "lg:max-w-[45%] md:pr-2"
      )}
    >
      {/* Desktop view - show all options */}
      <div className="w-full hidden lg:flex lg:flex-col gap-4 h-full overflow-y-scroll pr-4 hide-scrollbar">
        {options.map((option) => (
          <BridgeOption
            key={option.id}
            option={option}
            isSelected={selectedOption === option.id}
            isExpanded={expandedOption === option.id}
            onSelect={handleOptionSelect}
            onExpand={handleExpand}
          />
        ))}
      </div>

      {/* Mobile view - show only best return */}
      <div className="lg:hidden w-full">
        {options
          .filter((item) => item.isBest)
          .map((option) => (
            <BridgeOption
              key={option.id}
              option={option}
              isSelected={selectedOption === option.id}
              isExpanded={expandedOption === option.id}
              onSelect={handleOptionSelect}
              onExpand={handleExpand}
              className="sm:py-4 md:py-4"
            />
          ))}
        <button
          onClick={() => {
            /* Add handler to show all options component */
          }}
          className="w-full mt-4 py-2 px-4 bg-primary-buttons text-white rounded-ml"
        >
          View All Options
        </button>
      </div>
    </div>
  );
};

export default BridgeOptionsList;
