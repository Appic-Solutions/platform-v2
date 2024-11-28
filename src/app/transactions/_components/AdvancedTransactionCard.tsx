import { ChevronDownIcon, CopyIcon } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn, copyToClipboard, getChainLogo, getChainName } from "@/lib/utils";
import { Transaction } from "../sampleTransactions";
import { useState } from "react";
import TwinTokenIcon from "@/components/icons/twin-token";

const AdvancedTransactionCard = ({
  date,
  destinationToken,
  fee,
  id,
  sourceToken,
  time,
  className,
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
          {/* token avatar */}
          <div className="flex justify-start items-center gap-4 w-full">
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
            <div className="flex flex-col items-start">
              <div
                className={cn(
                  "flex flex-col items-start md:flex-row md:items-center gap-x-1",
                  showDetails
                    ? "text-secondary text-xs md:text-sm"
                    : "text-primary text-lg md:text-2xl"
                )}
              >
                <span>{sourceToken.symbol}</span>
                <span>on</span>
                <span>{getChainName(destinationToken.chainId)}</span>
              </div>
              {showDetails && (
                <span className="text-primary text-xl md:text-2xl">
                  {sourceToken.amount}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-x-1 bg-black text-white rounded-full px-2 md:px-6 py-2">
            <TwinTokenIcon className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-xs md:text-sm text-nowrap">Twin Token</span>
          </div>
        </div>
        {/* end section */}
        <div className="flex flex-col w-full items-center">
          {/* details section */}
          <div
            className={cn(
              "overflow-hidden transition-[height] duration-300 ease-in-out w-full",
              showDetails ? "h-[250px]" : "h-0"
            )}
          >
            <div className="flex items-center gap-x-2 mb-3">
              <p className="text-secondary text-sm">Transaction ID: {id}</p>
              <button onClick={() => copyToClipboard(id)}>
                <CopyIcon width={20} height={20} />
              </button>
            </div>
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center text-xs md:text-sm w-full justify-between">
                <span className="text-primary">Original Token Name:</span>
                <span className="text-secondary text-right">
                  {sourceToken.name}
                </span>
              </div>

              <div className="flex items-center text-xs md:text-sm w-full justify-between">
                <span className="text-primary">Original Token Symbol:</span>
                <span className="text-secondary text-right">
                  {sourceToken.symbol}
                </span>
              </div>

              <div className="flex items-center text-xs md:text-sm w-full justify-between">
                <span className="text-primary">Blockchain:</span>
                <span className="text-secondary text-right">
                  {getChainName(sourceToken.chainId)}
                </span>
              </div>

              <hr className="w-full border-t border-secondary" />

              <div className="flex items-center text-xs md:text-sm w-full justify-between">
                <span className="text-primary">Twin Token Name:</span>
                <span className="text-secondary text-right">
                  {destinationToken.name}
                </span>
              </div>

              <div className="flex items-center text-xs md:text-sm w-full justify-between">
                <span className="text-primary">Twin Token Symbol:</span>
                <span className="text-secondary text-right">
                  {destinationToken.symbol}
                </span>
              </div>

              <div className="flex items-center text-xs md:text-sm w-full justify-between">
                <span className="text-primary">Twin Token Fee:</span>
                <span className="text-[#12B76A] text-right">
                  {fee} {sourceToken.symbol}
                </span>
              </div>
            </div>
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
        </div>
      </div>
    </Card>
  );
};

export default AdvancedTransactionCard;
