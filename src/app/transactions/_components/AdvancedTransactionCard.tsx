import {
  ChevronDownIcon,
  CopyIcon,
  FireIcon,
  ParkOutlineBridgeIcon,
} from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn, copyToClipboard, getChainLogo, getChainName } from "@/lib/utils";
import { Transaction } from "../sampleTransactions";
import { useState } from "react";
import CheckIcon from "@/components/icons/check";

const AdvancedTransactionCard = ({
  bridgeProvider,
  date,
  destinationToken,
  fee,
  id,
  sourceToken,
  status,
  steps,
  time,
  className,
  type,
}: Transaction & {
  className?: string;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <Card
      className={cn(
        "cursor-pointer flex-col items-start justify-center gap-2 md:py-5",
        className
      )}
    >
      {/* main content */}
      <div className="flex flex-col gap-y-5 w-full">
        {/* top section */}
        <div className="flex items-center justify-between w-full text-sm text-secondary">
          <span>{date}</span>
          <span>{time}</span>
        </div>
        {/* second section */}
        <div className="flex items-center justify-between w-full">
          {/* source token avatar */}
          <div className="relative">
            <Avatar className="w-[72px] h-[72px] rounded-full">
              <AvatarImage
                src={sourceToken?.logo || "images/logo/placeholder.png"}
              />
              <AvatarFallback>{sourceToken?.symbol}</AvatarFallback>
            </Avatar>
            <Avatar
              className={cn(
                "absolute -right-1 -bottom-1 w-6 h-6 rounded-full",
                "shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]"
              )}
            >
              <AvatarImage src={getChainLogo(sourceToken?.chainId)} />
              <AvatarFallback>{sourceToken?.symbol}</AvatarFallback>
            </Avatar>
          </div>
          {/* connecting line and bridge icon */}
          <div className="flex items-center justify-center w-full">
            <div className="h-[3px] flex-1 bg-black" />
            <div
              className={cn(
                "rounded-full p-3 z-10 relative",
                "bg-[linear-gradient(81.4deg,_#000000_-15.41%,_#1D1D1D_113.98%)]",
                status === "failed" && "border-2 border-solid border-red-500",
                status === "in_progress" &&
                  "before:absolute before:inset-0 before:rounded-full before:content-[''] before:border-2 before:border-green-500 before:border-t-transparent before:animate-spin"
              )}
            >
              <ParkOutlineBridgeIcon
                width={26}
                height={26}
                className="min-w-5 min-h-5 text-white"
              />
            </div>
            <div
              className={cn(
                "h-[3px] flex-1 border-t-[3px]",
                status === "in_progress" && "border-dashed border-black",
                status === "completed" && "border-solid border-black",
                status === "failed" && "border-solid border-red-500"
              )}
            />
          </div>
          {/* destination token avatar */}
          <div className="relative">
            <Avatar className=" w-[72px] h-[72px] rounded-full">
              <AvatarImage
                src={destinationToken?.logo || "images/logo/placeholder.png"}
              />
              <AvatarFallback>{destinationToken?.symbol}</AvatarFallback>
            </Avatar>
            <Avatar
              className={cn(
                "absolute -right-1 -bottom-1 w-6 h-6 rounded-full",
                "shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]"
              )}
            >
              <AvatarImage src={getChainLogo(destinationToken?.chainId)} />
              <AvatarFallback>{destinationToken?.symbol}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        {/* bottom section */}
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-x-1 text-secondary text-sm">
              <span>{sourceToken.symbol}</span>
              <span>on</span>
              <span>{getChainName(destinationToken.chainId)}</span>
            </div>
            <span className="text-primary text-2xl">{sourceToken.amount}</span>
          </div>
          <div className="flex flex-col text-secondary text-sm items-center">
            <span>{type} Transaction</span>
            <span>{status}</span>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-x-1 text-secondary text-sm">
              <span>{destinationToken.symbol}</span>
              <span>on</span>
              <span>{getChainName(destinationToken.chainId)}</span>
            </div>
            <span className="text-primary text-2xl">
              {destinationToken.amount}
            </span>
          </div>
        </div>
        {/* details section */}
        <div
          className={cn(
            "overflow-hidden transition-[height] duration-300 ease-in-out",
            showDetails ? "h-[230px]" : "h-0"
          )}
        >
          <div className="flex items-center gap-x-2 mb-3">
            <p className="text-secondary text-sm">Transaction ID: {id}</p>
            <button onClick={() => copyToClipboard(id)}>
              <CopyIcon width={20} height={20} />
            </button>
          </div>
          <div className="flex flex-col gap-y-6">
            {steps.map((step, index) => (
              <div
                key={step.message}
                className="flex w-full justify-between items-center gap-x-6"
              >
                {step.status === "completed" && (
                  <div
                    className={cn(
                      "p-3 rounded-full flex items-center justify-center relative",
                      "bg-[#12B76A33] bg-opacity-20",
                      index < steps.length - 1 &&
                        "after:content-[''] after:absolute after:w-[2px] after:h-[24px] after:-bottom-6 after:bg-[#12B76A33] after:bg-opacity-20"
                    )}
                  >
                    <CheckIcon
                      width={24}
                      height={24}
                      className="text-[#0D9857]"
                    />
                  </div>
                )}
                <span className="text-[16px] w-full text-secondary text-start">
                  {step.message}
                </span>
                <span className="text-[16px] text-secondary text-start">
                  {step.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* end section */}
        <div className="flex items-center justify-between w-full">
          {/* bridge provider */}
          <div
            className={cn(
              "px-4 py-1 rounded-2xl w-max flex items-center gap-x-1",
              "bg-white opacity-60"
            )}
          >
            <span className="text-xs lg:text-sm text-black">
              via {bridgeProvider.name}
            </span>
          </div>
          {/* details button */}
          <button
            onClick={() => setShowDetails((prev) => !prev)}
            className="flex items-center gap-x-1 hover:bg-white hover:bg-opacity-10 rounded-lg p-1"
          >
            <span className="text-sm text-secondary">
              {showDetails ? "Hide" : "View"} Details
            </span>
            <div className="p-1 rounded-full bg-black bg-opacity-10 w-min transition-all">
              <ChevronDownIcon
                width={8}
                height={8}
                className={cn(showDetails && "rotate-180")}
              />
            </div>
          </button>
          {/* time and fee */}
          <span className="flex items-center gap-x-1 w-max">
            <p className="text-xs font-thin text-primary">{fee}</p>
            <FireIcon width={19} height={19} className="text-primary" />
          </span>
        </div>
      </div>
    </Card>
  );
};

export default AdvancedTransactionCard;
