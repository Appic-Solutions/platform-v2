import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { BridgeOptionType } from "./BridgeOptionsList";
import FireIcon from "@/components/icons/fire";
import ClockIcon from "@/components/icons/clock";
import ChevronDownIcon from "@/components/icons/chevron-down";

interface BridgeOptionProps {
  option: BridgeOptionType;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: (id: number) => void;
  onExpand: (id: number) => void;
  className?: string;
}

const BridgeOption = ({
  isSelected,
  isExpanded,
  onSelect,
  onExpand,
  option,
  className,
}: BridgeOptionProps) => {
  return (
    <Card
      onClick={() => onSelect(option.id)}
      className={cn(
        "py-4 px-4 flex-col gap-3 items-start justify-center",
        "min-w-[300px]",
        "sm:px-6",
        "md:px-6",
        option.isActive && "cursor-pointer",
        option.isBest && "bg-highlighted-card",
        isSelected && "border-2 border-blue-600",
        "min-h-[165px]",
        isExpanded && "min-h-[360px]",
        "transition-all duration-300 ease-in-out",
        "md:rounded-xl",
        className
      )}
      key={option.id}
    >
      {/* top section */}
      <div className="flex items-center justify-between w-full">
        <div className="flex-1">
          {option.isBest && (
            <p
              className={cn(
                "text-muted text-xs font-thin",
                "bg-primary-buttons text-white rounded-m px-2 w-fit py-2",
                !option.isActive && "opacity-50"
              )}
            >
              Best Return
            </p>
          )}
        </div>
        <button
          onClick={() => onExpand(option.id)}
          className={cn(
            "bg-gray-400 bg-opacity-20 rounded-m p-2 flex items-center ml-auto",
            "transition-transform duration-300",
            isExpanded && "rotate-180",
            !option.isActive && "opacity-30"
          )}
        >
          <ChevronDownIcon width={10} height={10} />
        </button>
      </div>
      {/* middle section */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-x-3">
          <div className="border-2 border-primary rounded-round p-3">
            <div className={cn("relative w-6 h-6", "lg:w-10 lg:h-10")}>
              <Image
                src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                alt="btc"
                className="object-contain"
                fill
              />
            </div>
          </div>
          <p
            className={cn(
              "text-base lg:text-xl",
              !option.isActive && "opacity-30"
            )}
          >
            {option.amount}
          </p>
        </div>
        <div className="flex flex-col gap-y-3 items-end">
          <div
            className={cn(
              "px-4 py-1 rounded-ml flex items-center gap-x-1",
              "bg-white",
              !option.isActive && "opacity-30"
            )}
          >
            <span
              className={cn(
                "text-xs lg:text-sm",
                option.isBest ? "text-blue-600" : "text-black"
              )}
            >
              via {option.via}
            </span>
            <Image
              src="images/logo/icp-logo.png"
              alt="logo"
              width={15}
              height={15}
            />
          </div>
        </div>
      </div>
      {/* bottom section */}
      <div
        className={cn(
          "flex items-end w-full justify-end gap-x-4",
          !option.isActive && "opacity-30"
        )}
      >
        <span className="flex items-center gap-x-1 w-max">
          <p className="text-xs font-thin text-primary">$ 1.24</p>
          <FireIcon width={15} height={15} className="text-primary" />
        </span>
        <span className="flex items-center gap-x-1 w-max">
          <p className="text-primary text-xs font-thin">10 Mins</p>
          <ClockIcon width={15} height={15} className="text-primary" />
        </span>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-4 w-full border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="space-y-4">
            <p className="text-sm font-medium">Additional Details:</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Network Fee:</span>
                <span>0.001 ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Estimated Time:</span>
                <span>{option.time} mins</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Route:</span>
                <span>Direct Bridge</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Security:</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default BridgeOption;
