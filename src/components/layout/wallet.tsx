"use client";
import { cn } from "@/lib/utils";
import { ConnectWallet, useAgent, useIdentityKit } from "@nfid/identitykit/react";
import { useAppKit } from "@reown/appkit/react";

const WalletPage = () => {
  const {
    // isInitializing,
    user,
    isUserConnecting,
    // icpBalance,
    // signer,
    // identity,
    // delegationType,
    // accounts,
    // connect,
    // disconnect,
    // fetchIcpBalance,
  } = useIdentityKit();
  const {
    open,
    // close
  } = useAppKit();

  return (
    <>
      <div
        className="bg-[#FAF7FD80]/50 rounded-round border border-[#ECE6F5] py-2 px-4 hidden lg:flex"
        onClick={() => {
          open();
        }}
      >
        User Wallet
        <ConnectWallet></ConnectWallet>
      </div>

      <div className={cn(
        "flex items-center justify-center gap-x-2",
      )}></div>
    </>
  );
};

export default WalletPage;
