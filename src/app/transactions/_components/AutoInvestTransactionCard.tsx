import {
  ArrowsUpDownIcon,
  ChevronDownIcon,
  FireIcon,
  ParkOutlineBridgeIcon,
} from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn, getChainLogo, getChainName } from "@/lib/utils";
import { Transaction } from "../sampleTransactions";
import { useState } from "react";

const AutoInvestTransactionCard = ({
  bridgeProvider,
  date,
  destinationToken,
  fee,
  id,
  sourceToken,
  status,
  steps,
  time,
  isExpanded,
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
      <div className="flex flex-col gap-y-7 w-full">
        {/* top section */}
        <div className="flex items-center justify-between w-full text-sm text-secondary">
          <span>{date}</span>
          <span>{time}</span>
        </div>
        {/* second section */}
        <div className="flex items-center justify-between w-full">
          {/* source token avatar */}
          <div className="flex items-center gap-x-4">
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
              <ArrowsUpDownIcon
                width={20}
                height={20}
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
            <div
              className={cn(
                "flex items-center gap-x-1 text-sm",
                showDetails ? "text-secondary" : "text-primary"
              )}
            >
              <span>{sourceToken.symbol}</span>
              <span>on</span>
              <span>{getChainName(sourceToken.chainId)}</span>
            </div>
            {showDetails && (
              <span className="text-primary text-2xl">
                {sourceToken.amount}
              </span>
            )}
          </div>
          <div className="flex flex-col text-secondary text-sm items-center">
            <span>{type} Transaction</span>
            <span>{status}</span>
          </div>
          <div className="flex flex-col items-end">
            <div
              className={cn(
                "flex items-center gap-x-1 text-sm",
                showDetails ? "text-secondary" : "text-primary"
              )}
            >
              <span>{destinationToken.symbol}</span>
              <span>on</span>
              <span>{getChainName(destinationToken.chainId)}</span>
            </div>
            {showDetails && (
              <span className="text-primary text-2xl">
                {destinationToken.amount}
              </span>
            )}
          </div>
        </div>
        {/* end section */}
        <div className="flex items-center justify-between w-full">
          {/* details button */}
          <button
            onClick={() => setShowDetails((prev) => !prev)}
            className="flex items-center gap-x-1 hover:bg-white hover:bg-opacity-10 rounded-lg p-1"
          >
            <span className="text-sm text-secondary">
              {showDetails ? "Hide" : "View"} Transaction Details
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
        {/* details section */}
        <div
          className={cn(
            "overflow-hidden transition-[height] duration-300 ease-in-out",
            showDetails ? "h-[280px]" : "h-0"
          )}
        >
          <p className="text-primary text-xl mb-4">Previous Transactions</p>
          <div className="flex flex-col gap-y-6">
            {steps.map((step) => (
              <div
                key={step.message}
                className="flex w-full justify-between items-center gap-x-6"
              >
                <div
                  className={cn(
                    "p-2 rounded-full flex items-center justify-center relative",
                    "bg-gray-300",
                    "after:content-[''] after:absolute after:w-[2px] after:h-[50px] after:-bottom-10 after:bg-gray-300"
                  )}
                ></div>
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
      </div>
    </Card>
  );
};

export default AutoInvestTransactionCard;
