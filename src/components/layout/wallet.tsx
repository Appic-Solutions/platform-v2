"use client";
import { cn } from "@/lib/utils";
import { useIdentityKit } from "@nfid/identitykit/react";
import { useAppKit } from "@reown/appkit/react";
import Image from "next/image";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "../ui/popover";
import { CloseIcon } from "../icons";

const WalletPage = () => {
  // States Management
  const [showPopover, setShowPopover] = useState(false);
  const [showEvmPopover, setShowEvmPopover] = useState(false);
  const [showIcpPopover, setShowIcpPopover] = useState(false);

  const {
    identity,
    connect: connectIcp,
  } = useIdentityKit();

  const {
    open: openEvmModal,
    isConnected: isEvmConnected,
    address,
  } = useAppKit();

  const isConnected = Boolean(identity) && isEvmConnected;

  const handleIcpConnect = async () => {
    try {
      await connectIcp();
    } catch (error) {
      console.error("Failed to connect ICP wallet:", error);
    }
  };

  const handleEvmConnect = () => {
    openEvmModal();
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className={cn(
      "hidden lg:flex items-center justify-evenly gap-2 relative min-w-fit w-[165px] h-[42px]",
      "rounded-round bg-[#faf7fd]/50 border border-[#ECE6F5]",
      isConnected && "px-3",
      "*:rounded-round"
    )}>
      {!isConnected && (
        <Popover open={showPopover} onOpenChange={setShowPopover}>
          <PopoverTrigger className="w-full text-black font-medium text-sm dark:text-white py-2 px-3">
            + Add Wallet
          </PopoverTrigger>
          <PopoverContent className="w-72 translate-y-4 flex flex-col gap-y-4" align="end">
            <div className="flex items-center justify-center text-black font-medium dark:text-white">
              <PopoverClose className="absolute top-4 right-4">
                <CloseIcon width={20} height={20} />
              </PopoverClose>
              Select Wallet
            </div>
            <div className={cn(
              "flex flex-col  gap-4 text-black font-medium text-sm dark:text-white",
              "*:flex *:items-center *:gap-2 *:cursor-pointer *:p-2 *:rounded-sm *:duration-200"
            )}>
              {!isEvmConnected && (
                <div onClick={handleEvmConnect} className="hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A]">
                  <Image
                    src="/images/logo/icp-logo.png"
                    alt="EVM Wallet"
                    width={24}
                    height={24}
                  />
                  Connect EVM Wallet
                </div>
              )}
              {!identity && (
                <div onClick={handleIcpConnect} className="hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A]">
                  <Image
                    src="/images/logo/icp-logo.png"
                    alt="ICP Wallet"
                    width={24}
                    height={24}
                  />
                  Connect ICP Wallet
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}
      {isEvmConnected && (
        <Popover open={showEvmPopover} onOpenChange={setShowEvmPopover}>
          <PopoverTrigger>
            <Image
              src="/images/logo/icp-logo.png"
              alt="ICP Wallet"
              width={24}
              height={24}
            />
          </PopoverTrigger>
          <PopoverContent className="w-72 translate-y-4 flex flex-col gap-y-4" align="end">
            <div className="flex items-center justify-center text-black font-medium dark:text-white">
              <PopoverClose className="absolute top-4 right-4">
                <CloseIcon width={20} height={20} />
              </PopoverClose>
              Your EVM Wallet
            </div>
            <div className="flex flex-col gap-4 text-black font-medium text-sm dark:text-white">
              EVM DATA
            </div>
          </PopoverContent>
        </Popover>
      )}
      {identity && (
        <Popover open={showIcpPopover} onOpenChange={setShowIcpPopover}>
          <PopoverTrigger>
            <Image
              src="/images/logo/icp-logo.png"
              alt="ICP Wallet"
              width={24}
              height={24}
            />
          </PopoverTrigger>
          <PopoverContent className="w-72 translate-y-4 flex flex-col gap-y-4" align="end">
            <div className="flex items-center justify-center text-black font-medium dark:text-white">
              <PopoverClose className="absolute top-4 right-4">
                <CloseIcon width={20} height={20} />
              </PopoverClose>
              Your ICP Wallet
            </div>
            <div className="flex flex-col gap-4 text-black font-medium text-sm dark:text-white">
              ICP DATA
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div >
  );
};

export default WalletPage;
