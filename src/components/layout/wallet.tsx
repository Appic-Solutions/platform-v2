"use client";
import { cn } from "@/lib/utils";
import { useIdentityKit } from "@nfid/identitykit/react";
import { useAppKit, useAppKitAccount, useDisconnect } from "@reown/appkit/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "../ui/popover";
import { CloseIcon } from "../icons";
// import { get_all_icp_tokens } from "@/blockchain_api/functions/icp/get_all_icp_tokens";
// import { useUnAuthenticatedAgent } from "@/hooks/useUnauthenticatedAgent";

const WalletPage = () => {
  // States Management
  const [showPopover, setShowPopover] = useState(false);
  const [showEvmPopover, setShowEvmPopover] = useState(false);
  const [showIcpPopover, setShowIcpPopover] = useState(false);

  // Get Unauthenticated Agent
  // const unauthenticatedAgent = useUnAuthenticatedAgent();

  // ICP Wallet Hooks
  const { identity: icpIdentity, connect: connectIcp, disconnect: disconnectIcp } = useIdentityKit();

  // Fetch All ICP Tokens
  // const fetchIcpBalance = async () => {
  //   if (unauthenticatedAgent) {
  //     const res = await get_all_icp_tokens(unauthenticatedAgent);
  //     console.log("res => ", res);
  //   }
  // }

  // useEffect(() => {
  //   if (unauthenticatedAgent) {
  //     fetchIcpBalance();
  //   }
  // }, [unauthenticatedAgent]);

  useEffect(() => {}, []);

  // EVM Wallet Hooks
  const { open: openEvmModal } = useAppKit();
  const { isConnected: isEvmConnected, address: evmAddress } = useAppKitAccount();
  const { disconnect: disconnectEvm } = useDisconnect();

  useEffect(() => {
    console.log("evmAddress > ", evmAddress);
  }, [evmAddress]);

  return (
    <div className={cn("hidden lg:flex items-center justify-evenly gap-2 relative min-w-fit w-[165px] h-[42px]", "rounded-round bg-[#faf7fd]/50 border border-[#ECE6F5]", (icpIdentity || isEvmConnected) && "px-3", "*:rounded-round")}>
      {(!icpIdentity || !isEvmConnected) && (
        <Popover open={showPopover} onOpenChange={setShowPopover}>
          <PopoverTrigger className="w-full text-black font-medium text-sm dark:text-white py-2 px-3">+ Add Wallet</PopoverTrigger>
          <PopoverContent className="w-72 translate-y-4 flex flex-col gap-y-4" align="end">
            <div className="flex items-center justify-center text-black font-medium dark:text-white">
              <PopoverClose className="absolute top-4 right-4">
                <CloseIcon width={20} height={20} />
              </PopoverClose>
              Select Wallet
            </div>
            <div className={cn("flex flex-col  gap-4 text-black font-medium text-sm dark:text-white", "*:flex *:items-center *:gap-2 *:cursor-pointer *:p-2 *:rounded-sm *:duration-200")}>
              {!icpIdentity && (
                <div onClick={() => connectIcp()} className="hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A]">
                  <Image src="/images/logo/icp-logo.png" alt="ICP Wallet" width={24} height={24} />
                  Connect ICP Wallet
                </div>
              )}
              {!isEvmConnected && (
                <div onClick={() => openEvmModal()} className="hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A]">
                  <Image src="/images/logo/icp-logo.png" alt="EVM Wallet" width={24} height={24} />
                  Connect EVM Wallet
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}
      {icpIdentity && (
        <Popover open={showIcpPopover} onOpenChange={setShowIcpPopover}>
          <PopoverTrigger>
            <Image src="/images/logo/icp-logo.png" alt="ICP Wallet" width={24} height={24} />
          </PopoverTrigger>
          <PopoverContent className="w-72 translate-y-4 flex flex-col gap-y-4" align="end">
            <div className="flex items-center justify-center text-black font-medium dark:text-white">
              <PopoverClose className="absolute top-4 right-4">
                <CloseIcon width={20} height={20} />
              </PopoverClose>
              Your ICP Wallet
            </div>
            <button onClick={() => disconnectIcp()} className="text-sm font-semibold text-fail px-4 py-2 rounded-m duration-200 hover:bg-fail hover:text-white">
              Disconnect
            </button>
          </PopoverContent>
        </Popover>
      )}
      {isEvmConnected && (
        <Popover open={showEvmPopover} onOpenChange={setShowEvmPopover}>
          <PopoverTrigger>
            <Image src="/images/logo/icp-logo.png" alt="ICP Wallet" width={24} height={24} />
          </PopoverTrigger>
          <PopoverContent className="w-72 translate-y-4 flex flex-col gap-y-4" align="end">
            <div className="flex items-center justify-center text-black font-medium dark:text-white">
              <PopoverClose className="absolute top-4 right-4">
                <CloseIcon width={20} height={20} />
              </PopoverClose>
              Your EVM Wallet
            </div>
            <div className="flex flex-col gap-4 text-black font-medium text-sm dark:text-white">EVM DATA</div>
            <button onClick={() => disconnectEvm()} className="text-sm font-semibold text-fail px-4 py-2 rounded-m duration-200 hover:bg-fail hover:text-white">
              Disconnect
            </button>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default WalletPage;
