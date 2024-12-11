import {
  ChevronDownIcon,
  CloseIcon,
  CopyIcon,
  FireIcon,
  LinkIcon,
  ParkOutlineBridgeIcon,
} from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn, copyToClipboard, getChainLogo, getChainName } from "@/lib/utils";
import { Transaction } from "../sampleTransactions";
import { useState } from "react";
import CheckIcon from "@/components/icons/check";
import Spinner from "@/components/ui/spinner";
import Link from "next/link";

const BridgeTransactionCard = ({
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
  completedStep,
}: Transaction & {
  className?: string;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <Card
      className={cn(
        "cursor-pointer flex-col items-start justify-center gap-2 md:py-5 px-5 py-5 rounded-2xl md:rounded-[36px]",
        className
      )}
    >
      {/* main content */}
      <div className="flex flex-col gap-y-5 w-full">
        {/* top section */}
        <div className="flex items-center justify-between w-full text-xs md:text-sm text-secondary">
          <span>{date}</span>
          <span>{time}</span>
        </div>
        {/* second section */}
        <div className="flex items-center justify-between w-full">
          {/* source token avatar */}
          <div className="relative">
            <Avatar
              className={cn(
                "w-[58px] h-[58px] rounded-full",
                "md:w-[72px] md:h-[72px]"
              )}
            >
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
            <div
              className={cn(
                "h-[3px] flex-1 border-t-[3px] border-black",
                completedStep === 0 && "border-dashed",
                completedStep > 1 && "border-solid"
              )}
            />
            <div
              className={cn(
                "rounded-full p-3 z-10 relative",
                "bg-[linear-gradient(81.4deg,_#000000_-15.41%,_#1D1D1D_113.98%)]",
                status === "failed" && "border-2 border-solid border-red-500",
                status === "pending" &&
                  "before:absolute before:inset-0 before:rounded-full before:content-[''] before:border-2 before:border-green-500 before:border-t-transparent before:animate-spin"
              )}
            >
              <ParkOutlineBridgeIcon className="w-5 md:w-6 h-5 md:h-6 text-white" />
            </div>
            <div
              className={cn(
                "h-[3px] flex-1 border-t-[3px]  border-black",
                completedStep === 0 && "border-dashed",
                completedStep > 1 && "border-solid",
                status === "failed" && "border-red-500"
              )}
            />
          </div>
          {/* destination token avatar */}
          <div className="relative">
            <Avatar
              className={cn(
                "w-[58px] h-[58px] rounded-full",
                "md:w-[72px] md:h-[72px]"
              )}
            >
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
            <div className="flex items-center gap-x-1 text-secondary text-xs md:text-sm">
              <span>{sourceToken.symbol}</span>
              <span>on</span>
              <span>{getChainName(sourceToken.chainId)}</span>
            </div>
            <span className="text-primary text-xl md:text-2xl">
              {sourceToken.amount}
            </span>
          </div>
          <div className="hidden md:flex flex-col text-secondary text-sm items-center">
            <span>{type} Transaction</span>
            <span>{status}</span>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-x-1 text-secondary text-xs md:text-sm">
              <span>{destinationToken.symbol}</span>
              <span>on</span>
              <span>{getChainName(destinationToken.chainId)}</span>
            </div>
            <span className="text-primary text-xl md:text-2xl">
              {destinationToken.amount}
            </span>
          </div>
        </div>
        <div className="flex flex-col w-full">
          {/* details section */}
          <div
            className={cn(
              "transition-all duration-200 transform",
              showDetails
                ? "opacity-100 mb-4 translate-y-0"
                : "opacity-0 h-0 overflow-hidden -translate-y-2"
            )}
          >
            <div className="flex items-center gap-x-2 mb-3">
              <p className="text-secondary text-sm">Transaction ID: {id}</p>
              <button onClick={() => copyToClipboard(id)}>
                <CopyIcon width={20} height={20} />
              </button>
            </div>
            <div className="flex flex-col gap-y-6 pr-2">
              {steps.map((step, index) => (
                <div
                  key={step.message}
                  className="flex w-full justify-between items-center gap-x-6 group/step"
                >
                  <div
                    className={cn(
                      "p-3 rounded-full flex items-center justify-center relative",
                      "bg-opacity-20",
                      step.status === "completed" && "bg-[#12B76A33]",
                      step.status === "pending" && "bg-[#12B76A33]",
                      step.status === "failed" && "bg-[#31201a73]",
                      index < steps.length - 1 &&
                        "after:content-[''] after:absolute after:w-[2px] after:h-[24px] after:-bottom-6 after:bg-[#12B76A33] after:bg-opacity-20"
                    )}
                  >
                    {step.status === "completed" && (
                      <CheckIcon
                        width={24}
                        height={24}
                        className="text-[#0D9857]"
                      />
                    )}
                    {step.status === "pending" && (
                      <Spinner className="fill-[#0D9857]" />
                    )}
                    {step.status === "failed" && (
                      <CloseIcon
                        width={24}
                        height={24}
                        className="text-[#FF5630]"
                      />
                    )}
                  </div>
                  <div className="overflow-hidden h-5 text-start w-full">
                    <div
                      className={cn(
                        "flex flex-col transition-transform duration-300 group-hover/step:-translate-y-5",
                        "text-sm md:text-[16px] text-secondary text-start"
                      )}
                    >
                      <span className="w-full">{step.message}</span>
                      <p className="flex items-center gap-x-2">
                        Details
                        <Link
                          href={"google.com"}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-md p-0.5 hover:bg-white/10"
                        >
                          <LinkIcon width={16} height={16} />
                        </Link>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs md:text-[16px] text-secondary text-start">
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
              <span className="text-sm text-secondary px-1">
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
      </div>
    </Card>
  );
};

export default BridgeTransactionCard;
