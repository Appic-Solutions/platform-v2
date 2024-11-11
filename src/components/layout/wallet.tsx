"use client";
import { cn } from "@/lib/utils";
import { useIdentityKit } from "@nfid/identitykit/react";
import { useAppKit } from "@reown/appkit/react";
import { useState } from "react";
import Image from "next/image";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const WalletPage = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const {
    identity,
    connect: connectIcp,
  } = useIdentityKit();

  const {
    open: openEvmModal,
    isConnected: isEvmConnected,
    address,
  } = useAppKit();

  const isConnected = Boolean(identity) || isEvmConnected;

  const handleIcpConnect = async () => {
    try {
      await connectIcp();
      setIsPopoverOpen(false);
    } catch (error) {
      console.error("Failed to connect ICP wallet:", error);
    }
  };

  const handleEvmConnect = () => {
    openEvmModal();
    setIsPopoverOpen(false);
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
            "bg-[#FAF7FD80]/50 border border-[#ECE6F5]",
            "hover:bg-[#FAF7FD80]/70"
          )}
        >
          {isConnected ? (
            <>
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                <Image
                  src="/images/wallet-icon.png"
                  alt="Wallet"
                  width={16}
                  height={16}
                />
              </div>
              <span>{address ? truncateAddress(address) : "Connected"}</span>
            </>
          ) : (
            "Connect Wallet"
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          "bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg",
          "flex flex-col gap-3 min-w-[200px]",
          "animate-in fade-in-0 zoom-in-95"
        )}
      >
        <button
          onClick={handleIcpConnect}
          className={cn(
            "flex items-center gap-2 p-2 rounded",
            "hover:bg-gray-100 dark:hover:bg-gray-700",
            "transition-colors"
          )}
        >
          <Image
            src="/images/icp-logo.png"
            alt="ICP"
            width={24}
            height={24}
          />
          Connect ICP Wallet
        </button>

        <button
          onClick={handleEvmConnect}
          className={cn(
            "flex items-center gap-2 p-2 rounded",
            "hover:bg-gray-100 dark:hover:bg-gray-700",
            "transition-colors"
          )}
        >
          <Image
            src="/images/evm-logo.png"
            alt="EVM"
            width={24}
            height={24}
          />
          Connect EVM Wallet
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default WalletPage;
