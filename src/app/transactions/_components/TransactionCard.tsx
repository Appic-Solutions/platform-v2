import { ParkOutlineBridgeIcon } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn, getChainLogo } from "@/lib/utils";

interface TransactionStep {
  status: "completed" | "in_progress" | "failed";
  message: string;
  timestamp: string;
}

interface TransactionCardProps {
  id: string;
  date: string;
  time: string;
  sourceToken: {
    chainId: number;
    amount: string;
    symbol: string;
    logo: string;
    name: string;
  };
  destinationToken: {
    chainId: number;
    amount: string;
    symbol: string;
    logo: string;
    name: string;
  };
  status: "completed" | "in_progress" | "failed";
  bridgeProvider: {
    name: string;
    logo: string;
  };
  fee: string;
  isExpanded?: boolean;
  steps: TransactionStep[];
  className?: string;
  customOnClick?: () => void;
}

export function TransactionCard({
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
  customOnClick,
}: TransactionCardProps) {
  return (
    <Card
      className={cn(
        "max-h-[262px] cursor-pointer flex-col items-start justify-center gap-2",
        className
      )}
      onClick={() => {
        customOnClick?.();
      }}
    >
      <div>
        {/* top section */}
        <div className="flex items-center justify-between">
          <span>{date}</span>
          <span>{time}</span>
        </div>
        <div className="flex items-center justify-between">
          {/* source token avatar */}
          <div className="relative">
            <Avatar className=" w-11 h-11 rounded-full">
              <AvatarImage
                src={sourceToken?.logo || "images/logo/placeholder.png"}
              />
              <AvatarFallback>{sourceToken?.symbol}</AvatarFallback>
            </Avatar>
            <Avatar
              className={cn(
                "absolute -right-1 -bottom-1 w-5 h-5 rounded-full",
                "shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]"
              )}
            >
              <AvatarImage src={getChainLogo(sourceToken?.chainId)} />
              <AvatarFallback>{sourceToken?.symbol}</AvatarFallback>
            </Avatar>
          </div>
          {/* icon */}
          <div>
            <ParkOutlineBridgeIcon
              width={24}
              height={24}
              className="min-w-5 min-h-5"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
