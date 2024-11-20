"use client";
import { cn, getChainLogo } from "@/lib/utils";
import { useIdentityKit } from "@nfid/identitykit/react";
import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
  useAppKitNetwork,
} from "@reown/appkit/react";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "../ui/popover";
import { CloseIcon } from "../icons";
import { useUnAuthenticatedAgent } from "@/hooks/useUnauthenticatedAgent";
import { useAuthenticatedAgent } from "@/hooks/useAuthenticatedAgent";
import { get_icp_wallet_tokens_balances } from "@/blockchain_api/functions/icp/get_icp_balances";
import {
  EvmTokensBalances,
  get_evm_wallet_tokens_balances,
} from "@/blockchain_api/functions/evm/get_evm_balances";
import { IcpToken } from "@/blockchain_api/types/tokens";
import WalletCard from "./wallet/wallet-card";
import { WalletPop } from "./wallet/wallet-pop";
import { getStorageItem } from "@/lib/localstorage";

const WalletPage = () => {
  // States Management
  const [showPopover, setShowPopover] = useState(false);
  const [showEvmPopover, setShowEvmPopover] = useState(false);
  const [showIcpPopover, setShowIcpPopover] = useState(false);
  const [icpBalance, setIcpBalance] = useState<{
    tokens: IcpToken[];
    totalBalanceUsd: string;
  }>();
  const [evmBalance, setEvmBalance] = useState<EvmTokensBalances>();

  const [icpLoading, setIcpLoading] = useState(false);
  const [evmLoading, setEvmLoading] = useState(false);

  // Get Agents
  const unauthenticatedAgent = useUnAuthenticatedAgent();
  const authenticatedAgent = useAuthenticatedAgent();

  // ICP Wallet Hooks
  const {
    identity: icpIdentity,
    connect: connectIcp,
    disconnect: disconnectIcp,
  } = useIdentityKit();

  // EVM Wallet Hooks
  const { open: openEvmModal } = useAppKit();
  const { isConnected: isEvmConnected, address: evmAddress } =
    useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const { disconnect: disconnectEvm } = useDisconnect();

  const fetchIcpBalances = async () => {
    try {
      setIcpLoading(true);
      if (unauthenticatedAgent && authenticatedAgent && icpIdentity) {
        const all_tokens = getStorageItem("icpTokens");
        const icp_balance = await get_icp_wallet_tokens_balances(
          icpIdentity.getPrincipal().toString(),
          JSON.parse(all_tokens || "[]"),
          unauthenticatedAgent
        );
        setIcpBalance(icp_balance);
      }
      setIcpLoading(false);
    } catch (error) {
      console.log("Line 70 Get Balance Error => ", error);
    }
  };
  const fetchEvmBalances = async () => {
    try {
      setEvmLoading(true);
      if (evmAddress) {
        const evm_balance = await get_evm_wallet_tokens_balances(evmAddress);
        setEvmBalance(evm_balance);
      }
      setEvmLoading(false);
    } catch (error) {
      console.log("Line 70 Get Balance Error => ", error);
    }
  };

  useEffect(() => {
    fetchEvmBalances();
    fetchIcpBalances();
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
    <div
      className={cn(
        "flex items-center justify-evenly gap-2 relative min-w-fit lg:h-[42px]",
        "rounded-full bg-[#faf7fd]/50 border border-[#ECE6F5]",
        (icpIdentity || isEvmConnected) && "px-3",
        "*:rounded-full"
      )}
    >
      {!icpIdentity || !isEvmConnected ? (
        <Popover open={showPopover} onOpenChange={setShowPopover}>
          <PopoverTrigger className="w-full font-medium text-sm text-white py-2 px-3">
            + Add Wallet
          </PopoverTrigger>
          <PopoverContent
            className="w-72 translate-y-4 flex flex-col gap-y-4"
            align="end"
          >
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
        <div className="text-black dark:text-white text-sm py-2 px-3">
          <span className="hidden md:inline-block">Connected</span>{" "}
          <span>Wallets</span>
        </div>
      )}

      {icpBalance && (
        <WalletPop
          open={showIcpPopover}
          openOnChange={setShowIcpPopover}
          logo="/images/logo/wallet_logos/icp.svg"
          title="Your ICP Wallet"
          balance={icpBalance}
          disconnect={handleDisconnectIcp}
          isLoading={icpLoading}
          address={icpIdentity?.getPrincipal().toString() || ""}
        />
      )}

      {evmBalance && (
        <WalletPop
          open={showEvmPopover}
          openOnChange={setShowEvmPopover}
          logo={getChainLogo(chainId)}
          title="Your EVM Wallet"
          balance={evmBalance}
          disconnect={handleDisconnectEvm}
          isLoading={evmLoading}
          address={evmAddress || ""}
        />
      )}
    </div>
  );
};

export default WalletPage;
