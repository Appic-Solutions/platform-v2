import { IcpToken } from "@/blockchain_api/types/tokens";
import { EvmToken } from "@/blockchain_api/types/tokens";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";
import { isValidEvmAddress, isValidIcpAddress } from "@/lib/validation";

interface WalletAddressInputProps {
  token: EvmToken | IcpToken | null;
  address: string;
  setAddress: (address: string) => void;
  validationError: string | null;
  onValidationError: (error: string | null) => void;
  onWalletAddressChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
  avatar: string;
}

const WalletAddressInput = ({ token, address, setAddress, validationError, onValidationError, onWalletAddressChange, show, avatar }: WalletAddressInputProps) => {
  const validateWalletAddress = (address: string) => {
    if (!token) return false;
    if (!address) {
      onValidationError?.("Wallet Address cannot be empty");
      return false;
    }

    if (token?.chainType === "ICP") {
      const isValid = isValidIcpAddress(address);
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

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateWalletAddress(e.target.value);
    setAddress(e.target.value);
    onWalletAddressChange?.(e);
  };

  return (
    <div className={cn("overflow-hidden transition-[max-height] duration-300 ease-in-out", show ? "max-h-[155px] mb-4" : "max-h-0")}>
      <Card className={cn("max-h-[133px] md:max-h-[155px] cursor-pointer flex-col items-start justify-center gap-y-2")}>
        <p className="text-sm font-semibold">Send To Wallet</p>
        <div className="flex items-center gap-4 w-full">
          <div className="relative">
            <Avatar className=" w-11 h-11 rounded-full">
              <AvatarImage src={avatar} />
              <AvatarFallback>{token?.symbol}</AvatarFallback>
            </Avatar>
          </div>
          <div className="w-full">
            <input
              type="text"
              maxLength={token?.chainType === "ICP" ? 64 : 42}
              placeholder={token?.chainType === "ICP" ? "2vxsx-fae..." : "0x0f70e...65A63"}
              value={address}
              onChange={handleAddressChange}
              className={cn(
                "border-[#1C68F8] dark:border-[#000000] rounded-md py-2 outline-none w-full",
                "bg-transparent text-primary",
                "placeholder:text-muted",
                "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                address.length > 30 && "text-lg"
              )}
            />
            {validationError && <p className="text-yellow-500 text-xs">{validationError}</p>}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WalletAddressInput;
