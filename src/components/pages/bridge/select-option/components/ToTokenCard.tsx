import { IcpToken, EvmToken } from "@/blockchain_api/types/tokens";

import { isValidEvmAddress } from "@/lib/validation";

import Card from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ToTokenCardProps {
  token: EvmToken | IcpToken;
  amount?: string;
  usdPrice?: string;
  onWalletAddressChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  walletAddress?: string;
  isWalletConnected?: boolean;
  onValidationError?: (error: string | null) => void;
  toWalletValidationError?: string | null;
}

const ToTokenCard = ({
  token,
  amount,
  onWalletAddressChange,
  walletAddress,
  isWalletConnected,
  onValidationError,
  toWalletValidationError,
}: ToTokenCardProps) => {
  const validateWalletAddress = (address: string) => {
    if (!address) {
      onValidationError?.("Wallet Address cannot be empty");
      return false;
    }

    if (token.chainTypes === "ICP") {
      const icpAddressRegex = /^[a-z0-9]{64}$/i;
      const isValid = icpAddressRegex.test(address);
      if (!isValid) {
        onValidationError?.("ICP Wallet Address is not valid");
        return false;
      }
    } else {
      const isValid = isValidEvmAddress(address);
      if (!isValid) {
        onValidationError?.("EVM Wallet Address is not valid");
        return false;
      }
    }

    onValidationError?.(null);
    return true;
  };

  return (
    <Card
      className={cn(
        "py-2 px-4 rounded-lg flex-col justify-center gap-4 relative",
        "md:px-10 md:py-2 md:rounded-lg",
        "sm:px-6",
        "lg:rounded-lg lg:py-2",
        "!h-28",
        !isWalletConnected && "!h-52",
        "transition-all duration-200 ease-out"
      )}
    >
      <p className="absolute top-3 left-6 text-muted text-sm font-semibold">
        To
      </p>
      <div className="absolute top-8 left-0 right-0 px-4 md:px-10">
        <div className="flex items-center justify-between w-full">
          {/* left section */}
          <div className="flex items-center gap-x-3 max-w-[40%]">
            <div
              className={cn(
                "relative flex flex-col gap-y-2",
                "*:rounded-round"
              )}
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
          <div className="flex flex-col gap-y-2 items-end">
            <div className="flex gap-2 flex-col items-end">
              <div className="text-primary text-xl md:text-2xl flex items-center gap-x-2">
                <span>{amount}</span>
                <span>{token.symbol}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "absolute left-0 right-0 px-4 md:px-10 transition-all duration-200",
          isWalletConnected ? "opacity-0 top-32" : "opacity-100 top-28"
        )}
      >
        {!isWalletConnected && (
          <div className="flex flex-col gap-y-1 items-start w-full">
            <label className="text-muted text-xs md:text-sm font-semibold">
              Send To Wallet
            </label>
            <input
              type="text"
              maxLength={token.chainTypes === "ICP" ? 64 : 42}
              placeholder="Enter Wallet Address"
              value={walletAddress}
              onChange={(e) => {
                const newValue = e.target.value;
                validateWalletAddress(newValue);
                onWalletAddressChange?.(e);
              }}
              className={cn(
                "border-[#1C68F8] dark:border-[#000000] rounded-m py-1 px-3 outline-none",
                "bg-white/50 dark:bg-white/30 text-black dark:text-white",
                "placeholder:text-black/50 dark:placeholder:text-white/50",
                "text-lg md:text-xl w-full",
                "font-semibold",
                "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              )}
            />
            {toWalletValidationError && (
              <p className="text-yellow-500 text-xs">
                {toWalletValidationError}
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ToTokenCard;
