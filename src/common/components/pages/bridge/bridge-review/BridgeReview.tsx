import React from "react";
import { Card } from "@/common/components/ui/card";
import { cn } from "@/common/helpers/utils";
import Image from "next/image";
import { ClockIcon, FireIcon } from "@/common/components/icons";
import Box from "@/common/components/ui/box";
import BoxHeader from "@/common/components/ui/box-header";
import { BridgeOptionType } from "../select-token/_components/BridgeOptionsList";
import ActionButton from "../select-token/_components/ActionButton";

interface ReviewProps {
  option: BridgeOptionType | null;
  prevStepHandler: () => void;
}

const BridgeReview = ({ option, prevStepHandler }: ReviewProps) => {
  if (option) {
    return (
      <Box
        className={cn(
          "justify-normal animate-slide-in opacity-0",
          "md:max-w-[612px] md:h-[607px] md:px-9 md:py-8"
        )}
      >
        <BoxHeader title="Bridge Review" onBack={prevStepHandler} />
        <div className="w-full flex flex-col justify-between gap-y-4 h-full">
          <Card
            className={cn(
              "py-2 md:py-2 lg:py-2 flex-col gap-3 items-start justify-center h-[360px] cursor-pointer",
              "min-w-[300px]",
              "px-6",
              "md:px-6",
              "overflow-hidden"
            )}
            key={option.id}
          >
            {/* top section */}
            <div className="flex items-center justify-between w-full">
              <div className="flex-1">
                {option.isBest && (
                  <p
                    className={cn(
                      "text-muted text-xs lg:text-sm font-thin",
                      "bg-primary-buttons text-white rounded-[10px] px-2 w-fit",
                      !option.isActive && "opacity-50"
                    )}
                  >
                    Best Return
                  </p>
                )}
              </div>
            </div>
            {/* middle section */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-x-3">
                <div className="border-2 border-primary rounded-full p-3">
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
                    "px-4 py-1 rounded-2xl flex items-center gap-x-1",
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
                <p className="text-xs font-thin text-primary">1.24</p>
                <FireIcon width={15} height={15} className="text-primary" />
              </span>
              <span className="flex items-center gap-x-1 w-max">
                <p className="text-primary text-xs font-thin">10 Mins</p>
                <ClockIcon width={15} height={15} className="text-primary" />
              </span>
            </div>

            {/* Expanded content */}
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
          </Card>
          <ActionButton isDisabled={false}>Confirm</ActionButton>
        </div>
      </Box>
    );
  }
};

export default BridgeReview;
