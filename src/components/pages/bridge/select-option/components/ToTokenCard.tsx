import { IcpToken, EvmToken } from "@/blockchain_api/types/tokens";

import { isValidEvmAddress } from "@/lib/validation";

import Card from "@/components/ui/card";
import { cn, getChainLogo } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ToTokenCardProps {
  token: EvmToken | IcpToken;
  amount?: string;
  usdPrice?: string;
  onWalletAddressChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  walletAddress?: string;
  onValidationError?: (error: string | null) => void;
  toWalletValidationError?: string | null;
  showWalletAddress?: boolean;
}

const ToTokenCard = ({
  token,
  amount,
  onWalletAddressChange,
  walletAddress,
  onValidationError,
  toWalletValidationError,
  showWalletAddress,
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
        "py-2 px-6 flex-col justify-center gap-4 relative",
        "md:px-10 md:py-2",
        "sm:px-6",
        "lg:py-2",
        showWalletAddress ? "!h-52" : "!h-32",
        "transition-all duration-200 ease-out"
      )}
    >
      <div className="absolute top-5 left-0 right-0 px-6 md:px-10">
        <div className="flex items-center justify-between w-full">
          {/* LEFT SECTION */}
          <div className="flex flex-col gap-y-2">
            <p className="text-muted text-sm font-semibold">to</p>
            <div className="flex items-center gap-x-4">
              {/* <div className="border-2 border-primary rounded-full p-3"> */}
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
              {/* </div> */}
              <div className="flex flex-col gap-y-1">
                <p>{token.symbol}</p>
                <p className="text-sm md:text-base font-semibold text-muted">
                  {token.name}
                </p>
              </div>
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
      {/* WALLET ADDRESS INPUT */}
      <div
        className={cn(
          "absolute left-0 right-0 px-4 md:px-10 transition-all duration-200",
          showWalletAddress ? "opacity-100 top-32" : "opacity-0 top-32"
        )}
      >
        {showWalletAddress && (
          <div className="flex flex-col gap-y-1 items-start w-full">
            <label className="text-xs md:text-sm font-semibold">
              Send To Wallet
            </label>
            <input
              type="text"
              maxLength={token.chainTypes === "ICP" ? 64 : 42}
              placeholder="0x0f70e...65A63"
              value={walletAddress}
              onChange={(e) => {
                const newValue = e.target.value;
                validateWalletAddress(newValue);
                onWalletAddressChange?.(e);
              }}
              className={cn(
                "bg-transparent border-none outline-none",
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
