import { cn } from "@/lib/utils";
import React from "react";
import BridgeOption from "./BridgeOption";
import ActionButton from "./ActionButton";
import { motion, AnimatePresence } from "framer-motion";

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
  amount: string;
  showAllOptions: boolean;
  setShowAllOptions: (show: boolean) => void;
  handleOptionSelect: (option: BridgeOptionType) => void;
  handleExpand: (option: BridgeOptionType) => void;
}

// OPTIONS LIST: DESKTOP
const OptionsList = React.memo(
  ({
    options,
    selectedOption,
    expandedOption,
    handleOptionSelect,
    handleExpand,
    className,
  }: {
    options: BridgeOptionType[];
    selectedOption: BridgeOptionType | null;
    expandedOption: BridgeOptionType | null;
    handleOptionSelect: (option: BridgeOptionType) => void;
    handleExpand: (option: BridgeOptionType) => void;
    className?: string;
  }) => (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      {options.map((option) => (
        <BridgeOption
          key={option.id}
          option={option}
          isSelected={selectedOption === option}
          isExpanded={expandedOption === option}
          onSelect={handleOptionSelect}
          onExpand={handleExpand}
          className="lg:py-4"
        />
      ))}
    </div>
  )
);
OptionsList.displayName = "OptionsList";

// OPTIONS LIST: MOBILE
const MobileView = React.memo(
  ({
    selectedOption,
    expandedOption,
    showAllOptions,
    setShowAllOptions,
    handleOptionSelect,
    handleExpand,
    amount,
  }: Omit<BridgeOptionsListProps, "className">) => (
    <div className="lg:hidden h-full w-full flex flex-col justify-between">
      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={showAllOptions ? "all" : "single"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {showAllOptions ? (
              <OptionsList
                options={options}
                selectedOption={selectedOption}
                expandedOption={expandedOption}
                handleOptionSelect={handleOptionSelect}
                handleExpand={handleExpand}
                className="sm:py-4 md:py-4"
              />
            ) : (
              <div className="w-full">
                {selectedOption ? (
                  <BridgeOption
                    key={selectedOption.id}
                    option={selectedOption}
                    isSelected={true}
                    isExpanded={expandedOption === selectedOption}
                    onSelect={handleOptionSelect}
                    onExpand={handleExpand}
                    className="sm:py-4 md:py-4"
                  />
                ) : (
                  <OptionsList
                    options={options.filter((item) => item.isBest)}
                    selectedOption={selectedOption}
                    expandedOption={expandedOption}
                    handleOptionSelect={handleOptionSelect}
                    handleExpand={handleExpand}
                    className="sm:py-4 md:py-4"
                  />
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.button
          onClick={() => setShowAllOptions(!showAllOptions)}
          className="w-full mt-4 py-2 px-4 bg-white bg-opacity-15 text-white rounded-ml mb-4"
          whileTap={{ scale: 0.95 }}
        >
          {showAllOptions ? "Hide Options" : "View All Options"}
        </motion.button>
      </div>

      <ActionButton
        isDisabled={!selectedOption || !Number(amount)}
        onClick={(e) => e.preventDefault()}
        isMobile={true}
      >
        Confirm
      </ActionButton>
    </div>
  )
);
MobileView.displayName = "MobileView";

// BRIDGE OPTIONS LIST
const BridgeOptionsList = (props: BridgeOptionsListProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-start w-full h-full",
        "lg:max-w-[45%] md:pr-2"
      )}
    >
      {/* Desktop view */}
      <div className="w-full hidden lg:flex lg:flex-col gap-4 h-full overflow-y-scroll pr-4 hide-scrollbar">
        <OptionsList
          options={options}
          selectedOption={props.selectedOption}
          expandedOption={props.expandedOption}
          handleOptionSelect={props.handleOptionSelect}
          handleExpand={props.handleExpand}
        />
      </div>

      {/* Mobile view */}
      <MobileView {...props} />
    </div>
  );
};
BridgeOptionsList.displayName = "BridgeOptionsList";

export default BridgeOptionsList;
