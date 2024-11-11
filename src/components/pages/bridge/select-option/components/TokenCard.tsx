import { IcpToken } from "@/blockchain_api/types/tokens";

import { EvmToken } from "@/blockchain_api/types/tokens";

import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface TokenCardProps {
  type: "from" | "to";
  token: EvmToken | IcpToken;
  amount?: string;
  usdPrice?: string;
  onAmountChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TokenCard = ({
  type,
  token,
  amount,
  usdPrice,
  onAmountChange,
}: TokenCardProps) => {
  return (
    <Card
      className={cn(
        "max-h-[133px] px-4",
        "md:max-h-[174px] md:px-10 md:py-20",
        "sm:px-6"
      )}
    >
      <p className="absolute top-3 text-muted text-sm font-semibold">
        {type === "from" ? "From" : "To"}
      </p>
      <div className="flex items-center justify-between w-full">
        {/* left section */}
        <div className="flex items-center gap-x-3 max-w-[40%]">
          <div className=" border-2 border-primary rounded-round p-3">
            <div className="relative w-8 h-8 md:w-11 md:h-11">
              <Image
                src={token.logo}
                alt={token.name}
                className="object-contain"
                fill
              />
            </div>
          </div>
          <div>
            <p className="text-xl md:text-3xl">{token.symbol}</p>
            <p className="text-sm md:text-base font-semibold text-muted">
              {token.name}
            </p>
          </div>
        </div>
        {/* right section */}
        <div className="flex flex-col gap-y-2 items-end">
          {type === "from" && (
            <p className="text-muted text-xs md:text-sm font-semibold">
              Available: 0.334 ETH
            </p>
          )}
          {type === "from" && (
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
          )}
          <div
            className={cn(
              "flex items-center gap-2",
              amount && amount.length > 8
                ? "flex-col items-end"
                : "flex-col md:flex-row"
            )}
          >
            {type === "to" && (
              <span className="text-primary text-xl md:text-2xl">
                {amount} {token.symbol}
              </span>
            )}
            {type === "from" && (
              <>
                <span className="text-muted text-xs md:text-sm">
                  $ {usdPrice}
                </span>
                <span className="px-4 cursor-pointer py-1 text-xs md:text-sm text-black bg-gradient-to-r from-white to-white/35 rounded-ml">
                  max
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TokenCard;
