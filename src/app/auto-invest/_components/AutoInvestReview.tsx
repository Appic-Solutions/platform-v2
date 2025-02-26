import { EvmToken, IcpToken } from "@/blockchain_api/types/tokens";
import { ExpandLeftIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import React from "react";

const steps = [
  {
    amount: "0.124123 BTC",
    message: "First Swap",
    timestamp: "12/09/2024",
    status: "completed",
  },
  {
    amount: "0.124123 BTC",
    message: "Second Swap",
    timestamp: "19/09/2024",
    status: "completed",
  },
  {
    amount: "0.124123 BTC",
    message: "Second Swap",
    timestamp: "19/09/2024",
    status: "completed",
  },
  {
    amount: "0.124123 BTC",
    message: "Second Swap",
    timestamp: "19/09/2024",
    status: "failed",
  },
  {
    amount: "0.124123 BTC",
    message: "Second Swap",
    timestamp: "19/09/2024",
    status: "pending",
  },
];

interface AutoInvestReviewProps {
  showDetails: boolean;
  setShowDetails: (showDetails: boolean) => void;
  fromToken: IcpToken | EvmToken | null;
  selectedCycle: string;
  investmentPeriod: number;
}

const AutoInvestReview = ({
  setShowDetails,
  fromToken,
  selectedCycle,
  investmentPeriod,
}: AutoInvestReviewProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-y-8 items-start mb-5 max-h-full",
        "lg:w-full md:pr-2",
        "animate-slide-in opacity-0"
      )}
    >
      <div className="flex flex-col gap-y-4 w-full">
        <div
          className={cn(
            "flex items-center justify-center my-6",
            "text-white md:text-black md:dark:text-white lg:hidden"
          )}
        >
          <button
            onClick={() => setShowDetails(false)}
            className={cn(
              "flex items-center justify-center gap-x-1",
              "absolute left-0 font-semibold lg:left-8",
              "lg:hidden"
            )}
          >
            <ExpandLeftIcon width={18} height={18} />
            Back
          </button>
          <p className="text-xl md:text-3xl font-bold">Details</p>
        </div>
        <div className="flex flex-col gap-y-4 text-[15px] w-full md:bg-white/50 md:dark:bg-white/10 rounded-3xl md:p-8">
          <div className="flex justify-between items-center">
            <p className="text-primary">Amount Per Swap</p>
            <p className="text-[#464646] dark:text-white">
              {fromToken?.symbol}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-primary">Buy Cycle</p>
            <p className="text-[#464646] dark:text-white">{selectedCycle}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-primary">Investment Period</p>
            <p className="text-[#464646] dark:text-white">{investmentPeriod}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-primary">Total Amount</p>
            <p className="text-[#464646] dark:text-white">10 BTC</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-4 w-full h-full overflow-y-visible md:overflow-y-auto pr-2">
        <p className="text-[28px] font-bold hidden md:block text-black dark:text-white">
          Timeline
        </p>
        <div className="flex flex-col gap-y-5">
          {steps.map((step, index) => (
            <div
              key={step.message}
              className="flex w-full justify-between items-center gap-x-6"
            >
              <div
                className={cn(
                  "p-2 rounded-full flex items-center justify-center relative",
                  "bg-gray-300 dark:bg-blue-500",
                  index < steps.length - 1 &&
                  "after:content-[''] after:absolute after:w-[2px] after:h-[50px] after:-bottom-12 after:bg-gray-300 dark:after:bg-blue-500"
                )}
              ></div>

              <div className="flex flex-col gap-y-1 items-start text-sm text-secondary text-start w-full">
                <span className="font-thin text-[#333333] dark:text-[#898989]">
                  {step.amount}
                </span>
                <span className="text-primary">{step.message}</span>
              </div>
              <div className="flex flex-col gap-y-1 items-end font-thin text-sm text-secondary text-start">
                <span className="text-[#333333] dark:text-[#898989]">
                  {step.timestamp}
                </span>
                <span
                  className={cn(
                    step.status === "completed" && "text-green-600",
                    step.status === "failed" && "text-red-600"
                  )}
                >
                  {step.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutoInvestReview;
