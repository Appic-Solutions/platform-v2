"use client";
import { cn, getChainLogo } from "@/lib/utils";
import { useIdentityKit } from "@nfid/identitykit/react";
import { useAppKit, useAppKitAccount, useDisconnect, useAppKitNetwork } from "@reown/appkit/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "../ui/popover";
import { CloseIcon } from "../icons";
import { get_all_icp_tokens } from "@/blockchain_api/functions/icp/get_all_icp_tokens";
import { useUnAuthenticatedAgent } from "@/hooks/useUnauthenticatedAgent";
import { useAuthenticatedAgent } from "@/hooks/useAuthenticatedAgent";
import { get_icp_wallet_tokens_balances } from "@/blockchain_api/functions/icp/get_icp_balances";
import { get_evm_wallet_tokens_balances } from "@/blockchain_api/functions/evm/get_evm_balances";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { EvmToken, IcpToken } from "@/blockchain_api/types/tokens";

const WalletCard = ({
  connectWallet,
  walletLogo,
  walletTitle,
}: {
  connectWallet: () => void,
  walletLogo: string,
  walletTitle: string,
}) => {
  return (
    <div
      onClick={() => connectWallet()}
      className={cn(
        "flex items-center gap-2 cursor-pointer p-2 rounded-md duration-200",
        "hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A]"
      )}>
      <Avatar className="w-[51px] h-[51px]">
        <AvatarImage src={walletLogo} alt={walletTitle} />
        <AvatarFallback>{walletTitle}</AvatarFallback>
      </Avatar>
      <span className="text-lg font-bold text-white">{walletTitle}</span>
    </div>
  )
}

const WalletPage = () => {
  // States Management
  const [showPopover, setShowPopover] = useState(false);
  const [showEvmPopover, setShowEvmPopover] = useState(false);
  const [showIcpPopover, setShowIcpPopover] = useState(false);
  const [icpBalance, setIcpBalance] = useState<{ tokens: IcpToken[], totalBalanceUsd: string }>();
  const [evmBalance, setEvmBalance] = useState<any>();

  // Get Agents
  const unauthenticatedAgent = useUnAuthenticatedAgent();
  const authenticatedAgent = useAuthenticatedAgent();

  // ICP Wallet Hooks
  const { identity: icpIdentity, connect: connectIcp, disconnect: disconnectIcp } = useIdentityKit();

  // EVM Wallet Hooks
  const { open: openEvmModal } = useAppKit();
  const { isConnected: isEvmConnected, address: evmAddress } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const { disconnect: disconnectEvm } = useDisconnect();

  // Fetch Balances
  const fetchBalances = async () => {
    try {
      // Fetch ICP balance
      if (unauthenticatedAgent && authenticatedAgent && icpIdentity) {
        const all_tokens = await get_all_icp_tokens(unauthenticatedAgent);
        const icp_balance = await get_icp_wallet_tokens_balances(
          icpIdentity.getPrincipal().toString(),
          all_tokens,
          unauthenticatedAgent
        );
        setIcpBalance(icp_balance);
      }

      // Fetch EVM balance  
      if (evmAddress) {
        const evm_balance = await get_evm_wallet_tokens_balances(evmAddress);
        setEvmBalance(evm_balance);
      }
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [unauthenticatedAgent, authenticatedAgent, icpIdentity, evmAddress]);

  const handleDisconnectIcp = () => {
    disconnectIcp();
    setIcpBalance(undefined);
  };

  const handleDisconnectEvm = () => {
    disconnectEvm();
    setEvmBalance(undefined);
  };

  return (
    <div className={cn(
      "flex items-center justify-evenly gap-2 relative min-w-fit lg:w-[165px] lg:h-[42px]",
      "rounded-full bg-[#faf7fd]/50 border border-[#ECE6F5]",
      (icpIdentity || isEvmConnected) && "px-3",
      "*:rounded-full"
    )}>

      {(!icpIdentity || !isEvmConnected) ? (
        <Popover open={showPopover} onOpenChange={setShowPopover}>
          <PopoverTrigger className="w-full text-black font-medium text-sm dark:text-white py-2 px-3">+ Add Wallet</PopoverTrigger>
          <PopoverContent className="w-72 translate-y-4 flex flex-col gap-y-4" align="end">
            <div className="flex items-center justify-center font-medium text-white">
              <PopoverClose className="absolute top-4 right-4">
                <CloseIcon width={20} height={20} />
              </PopoverClose>
              Select Wallet
            </div>
            <div className="flex flex-col gap-4">
              {!icpIdentity && (
                <WalletCard
                  connectWallet={() => connectIcp()}
                  walletLogo="/images/logo/wallet_logos/icp.svg"
                  walletTitle="Connect ICP Wallet"
                />
              )}
              {!isEvmConnected && (
                <WalletCard
                  connectWallet={() => openEvmModal()}
                  walletLogo={getChainLogo(chainId)}
                  walletTitle="Connect EVM Wallet"
                />
              )}
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="text-black dark:text-white text-sm">
          Connected Wallets
        </div>
      )}

      {icpIdentity && (
        <Popover open={showIcpPopover} onOpenChange={setShowIcpPopover}>
          <PopoverTrigger>
            <Image src="/images/logo/wallet_logos/icp.svg" alt="ICP Wallet" width={24} height={24} />
          </PopoverTrigger>
          <PopoverContent className="w-72 translate-y-4 flex flex-col gap-y-4 px-10" align="end">
            <div className="flex items-center justify-center text-black font-medium dark:text-white">
              <PopoverClose className="absolute top-4 right-4">
                <CloseIcon width={20} height={20} />
              </PopoverClose>
              Your ICP Wallet
            </div>
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center justify-between text-sm font-semibold text-[#919191]">
                <span>
                  Token
                </span>
                Amount
              </div>
              {icpBalance && icpBalance.tokens.length > 0 ? icpBalance.tokens.map((token, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm font-semibold text-white">
                  <span>{token.symbol}</span>
                  <span>{token.balance}</span>
                </div>
              )) : (
                <div className="flex items-center justify-center text-sm font-semibold text-white">
                  No tokens found
                </div>
              )}
            </div>
            <hr className="bg-[#494949]" />
            {icpBalance && (
              <div className="flex items-center justify-between text-sm font-semibold text-white">
                <span>
                  Total :
                </span>
                ${icpBalance.totalBalanceUsd}
              </div>
            )}
            <button
              onClick={handleDisconnectIcp}
              className="text-sm font-semibold text-fail px-4 py-2 rounded-[10px] duration-200 hover:bg-fail hover:text-white">
              Disconnect
            </button>
          </PopoverContent>
        </Popover>
      )}

      {isEvmConnected && (
        <Popover open={showEvmPopover} onOpenChange={setShowEvmPopover}>
          <PopoverTrigger>
            <Image src={getChainLogo(chainId)} alt="EVM Wallet" width={24} height={24} />
          </PopoverTrigger>
          <PopoverContent className="w-72 translate-y-4 flex flex-col gap-y-4" align="end">
            <div className="flex items-center justify-center text-black font-medium dark:text-white">
              <PopoverClose className="absolute top-4 right-4">
                <CloseIcon width={20} height={20} />
              </PopoverClose>
              Your EVM Wallet
            </div>
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center justify-between text-sm font-semibold text-[#919191]">
                <span>
                  Token
                </span>
                Amount
              </div>
              {evmBalance && evmBalance?.tokens.length > 0 ? evmBalance?.tokens.map((token: EvmToken, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-sm font-semibold text-white">
                  <span>{token.symbol}</span>
                  <span>{token.balance}</span>
                </div>
              )) : (
                <div className="flex items-center justify-center text-sm font-semibold text-white">
                  No tokens found
                </div>
              )}
            </div>
            <hr className="bg-[#494949]" />
            {evmBalance && (
              <div className="flex items-center justify-between text-sm font-semibold text-white">
                <span>
                  Total :
                </span>
                ${evmBalance.totalBalanceUsd}
              </div>
            )}
            <button
              onClick={handleDisconnectEvm}
              className="text-sm font-semibold text-fail px-4 py-2 rounded-[10px] duration-200 hover:bg-fail hover:text-white">
              Disconnect
            </button>
          </PopoverContent>
        </Popover>
      )}

    </div>
  )
};

export default WalletPage;
