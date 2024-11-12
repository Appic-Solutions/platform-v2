"use client";
import { cn } from "@/lib/utils";
import { useIdentityKit } from "@nfid/identitykit/react";
import { useAppKit, useAppKitAccount, useDisconnect, useAppKitNetwork } from "@reown/appkit/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "../ui/popover";
import { CloseIcon } from "../icons";
import { chains } from "@/blockchain_api/lists/chains";
import { get_all_icp_tokens } from "@/blockchain_api/functions/icp/get_all_icp_tokens";
import { useUnAuthenticatedAgent } from "@/hooks/useUnauthenticatedAgent";
import { useAuthenticatedAgent } from "@/hooks/useAuthenticatedAgent";
import { get_icp_wallet_tokens_balances } from "@/blockchain_api/functions/icp/get_icp_balances";
import { get_evm_wallet_tokens_balances } from "@/blockchain_api/functions/evm/get_evm_balances";

const WalletPage = () => {
  // States Management
  const [showPopover, setShowPopover] = useState(false);
  const [showEvmPopover, setShowEvmPopover] = useState(false);
  const [showIcpPopover, setShowIcpPopover] = useState(false);

  // Get Unauthenticated Agent
  const unauthenticatedAgent = useUnAuthenticatedAgent();
  const authenticatedAgent = useAuthenticatedAgent();
  // ICP Wallet Hooks
  const { identity: icpIdentity, connect: connectIcp, disconnect: disconnectIcp } = useIdentityKit();

  // Fetch All ICP Tokens
  const fetchIcpBalance = async () => {
    if (unauthenticatedAgent && authenticatedAgent && icpIdentity) {
      // Get all tokens
      const all_tokens = await get_all_icp_tokens(unauthenticatedAgent);

      // Get user balance
      const user_balance = await get_icp_wallet_tokens_balances(icpIdentity.getPrincipal().toString(), all_tokens, unauthenticatedAgent);
      console.log("res => ", user_balance);
    }
  };

  useEffect(() => {
    if (unauthenticatedAgent) {
      fetchIcpBalance();
    }
  }, [unauthenticatedAgent, authenticatedAgent, icpIdentity]);

  // EVM Wallet Hooks
  const { open: openEvmModal } = useAppKit();
  const { isConnected: isEvmConnected, address: evmAddress } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const { disconnect: disconnectEvm } = useDisconnect();

  // Fetch All ICP Tokens
  const fetchEvmBalance = async () => {
    if (evmAddress) {
      // Get user balance
      const user_balance = await get_evm_wallet_tokens_balances(evmAddress);
      console.log("res => ", user_balance);
    }
  };

  useEffect(() => {
    if (evmAddress) {
      fetchEvmBalance();
    }
  }, [evmAddress]);

  const getChainLogo = (chainId: string | number | undefined): string => {
    return chains.find((chain) => chain.chainId == Number(chainId))?.logo || "/images/logo/chains/ethereum.svg";
  };

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
                  <Image src="/images/logo/wallet_logos/icp.svg" alt="ICP Wallet" width={24} height={24} />
                  Connect ICP Wallet
                </div>
              )}
              {!isEvmConnected && (
                <div onClick={() => openEvmModal()} className="hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A]">
                  <Image src={getChainLogo(chainId)} alt="EVM Wallet" width={24} height={24} />
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
            <Image src="/images/logo/wallet_logos/icp.svg" alt="ICP Wallet" width={24} height={24} />
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
            <Image src={getChainLogo(chainId)} alt="ICP Wallet" width={24} height={24} />
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
