import { IcpToken } from "@/blockchain_api/types/tokens";

import { EvmToken } from "@/blockchain_api/types/tokens";

import Card from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
        "py-2 px-4 rounded-lg flex-col justify-center gap-1",
        "md:px-10 md:py-2 md:rounded-lg",
        "sm:px-6",
        "lg:rounded-lg lg:py-4"
      )}
    >
      <p className="absolute top-3 left-6 text-muted text-sm font-semibold">
        From
      </p>
      <div className="flex items-center justify-between w-full">
        {/* left section */}
        <div className="flex items-center gap-x-3 max-w-[40%]">
          <div
            className={cn("relative flex flex-col gap-y-2", "*:rounded-round")}
          >
            <Image
              src={token.logo ?? "images/logo/placeholder.png"}
              alt={token.name}
              width={44}
              height={44}
            />
            <Image
              src={token.logo ?? "images/logo/placeholder.png"}
              alt="token-logo"
              width={20}
              height={20}
              className="w-5 h-5 absolute -right-1 -bottom-2 border-[2.5px] border-black dark:border-white"
            />
          </div>
          <div>
            <p className="text-xl md:text-3xl">{token.symbol}</p>
            <p className="text-sm md:text-base font-semibold text-muted">
              {token.name}
            </p>
          </div>
        </div>
        {/* right section */}
        <div className="flex flex-col w-1/2 gap-y-2 items-end">
          <p className="text-muted text-xs md:text-sm font-semibold">
            Available: {isWalletConnected ? "0.334 ETH" : "0"}
          </p>
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
              "border-[#1C68F8] dark:border-[#000000] rounded-m py-1 px-3 outline-none",
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

            <span className="px-4 cursor-pointer py-1 text-xs md:text-sm text-black bg-gradient-to-r from-white to-white/35 rounded-ml">
              max
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FromTokenCard;
