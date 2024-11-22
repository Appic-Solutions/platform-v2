import { IcpToken } from "@/blockchain_api/types/tokens";
import { EvmToken } from "@/blockchain_api/types/tokens";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Card } from "@/components/ui/card";
import { cn, getChainLogo } from "@/lib/utils";

interface FromTokenCardProps {
  token: EvmToken | IcpToken;
  amount?: string;
  usdPrice?: string;
  onAmountChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isWalletConnected?: boolean;
}

const FromTokenCard = ({
  token,
  amount,
  usdPrice,
  onAmountChange,
  isWalletConnected,
}: FromTokenCardProps) => {
  return (
    <Card
      className={cn(
        "py-3 px-6 flex-col justify-center gap-1",
        "md:px-10 md:py-2",
        "sm:px-6",
        "lg:py-4"
      )}
    >
      <div className="flex items-center justify-between w-full">
        {/* left section */}
        <div className="flex flex-col gap-y-2">
          <p className="text-muted text-sm font-semibold">from</p>
          <div className="flex items-center gap-x-4">
            <div className="relative flex flex-col gap-y-2">
              <Avatar className="w-11 h-11 rounded-full">
                <AvatarImage
                  src={token?.logo || "images/logo/placeholder.png"}
                />
                <AvatarFallback>{token?.symbol}</AvatarFallback>
              </Avatar>
              <Avatar
                className={cn(
                  "absolute -right-1 -bottom-1 w-5 h-5 rounded-full",
                  "shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]"
                )}
              >
                <AvatarImage src={getChainLogo(token?.chainId)} />
                <AvatarFallback>{token?.symbol}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col gap-y-1">
              <p>{token.symbol}</p>
              <p className="text-sm md:text-base font-semibold text-muted">
                {token.name}
              </p>
            </div>
          </div>
        </div>
        {/* right section */}
        <div
          className={cn(
            "flex flex-col w-1/2 gap-y-3 items-end",
            !isWalletConnected && "my-5"
          )}
        >
          {isWalletConnected && (
            <p className="text-muted text-xs md:text-sm font-semibold">
              Available: 0.334 ETH
            </p>
          )}
          <input
            type="number"
            maxLength={15}
            placeholder="0"
            value={amount}
            onChange={(e) => {
              if (e.target.value.length <= 15) {
                onAmountChange?.(e);
              }
            }}
            className={cn(
              "border-[#1C68F8] dark:border-[#000000] rounded-md py-1 px-3 outline-none",
              "bg-white/50 dark:bg-white/30 text-black dark:text-white",
              "placeholder:text-black/50 dark:placeholder:text-white/50",
              amount && amount.length > 8
                ? "text-sm md:text-sm w-3/4"
                : "text-sm md:text-xl w-1/2",
              "font-semibold",
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            )}
          />
          <div
            className={cn(
              "flex items-center gap-2",
              amount && amount.length > 8
                ? "flex-col items-end"
                : "flex-col md:flex-row"
            )}
          >
            <span className="text-muted text-xs md:text-sm">$ {usdPrice}</span>
            {isWalletConnected && (
              <span
                className={cn(
                  "px-4 cursor-pointer py-1 text-xs md:text-sm text-black rounded-md",
                  "bg-gradient-to-r from-white to-white/35",
                  "hover:bg-white/35 transition-all duration-300"
                )}
              >
                max
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FromTokenCard;
