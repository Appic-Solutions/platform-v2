"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { ArrowDownIcon } from "@/components/icons";
import Box from "@/components/ui/box";
import { EvmToken, IcpToken } from "@/blockchain_api/types/tokens";
import BridgeOptionsList, {
  BridgeOptionType,
} from "./components/BridgeOptionsList";
import ActionButton from "./components/ActionButton";
import BoxHeader from "@/components/ui/box-header";
import FromTokenCard from "./components/FromTokenCard";
import ToTokenCard from "./components/ToTokenCard";
import { useAppKitAccount } from "@reown/appkit/react";
import { useIdentityKit } from "@nfid/identitykit/react";

const SelectOptionPage = ({
  fromToken,
  toToken,
  prevStepHandler,
  swapTokensHandler,
}: {
  nextStepHandler: () => void;
  prevStepHandler: () => void;
  swapTokensHandler: () => void;
  fromToken: EvmToken | IcpToken;
  toToken: EvmToken | IcpToken;
}) => {
  const [amount, setAmount] = useState("");
  const [usdPrice, setUsdPrice] = useState("0");
  const [toAmount, setToAmount] = useState("0");
  const [expandedOption, setExpandedOption] = useState<BridgeOptionType | null>(
    null
  );
  const [selectedOption, setSelectedOption] = useState<BridgeOptionType | null>(
    null
  );
  const [toWalletAddress, setToWalletAddress] = useState("");
  const [toWalletValidationError, setToWalletValidationError] = useState<
    string | null
  >(null);
  const { isConnected: isEvmConnected } = useAppKitAccount();
  const { identity: icpIdentity } = useIdentityKit();

  const handleOptionSelect = (option: BridgeOptionType) => {
    if (option.isActive) {
      setSelectedOption(option);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const usdPrice = Number(value) * Number(fromToken?.usdPrice ?? 0);
    setUsdPrice(usdPrice.toFixed(2));
    setAmount(e.target.value);
    setToAmount((usdPrice / Number(toToken?.usdPrice ?? 0)).toFixed(2));
  };

  const handleExpand = (option: BridgeOptionType) => {
    if (expandedOption === option) {
      setExpandedOption(null);
    } else {
      setExpandedOption(option);
    }
  };

  return (
    <Box
      className={cn(
        "flex flex-col overflow-y-scroll",
        "lg:px-14 md:overflow-auto md:max-h-[607px] md:max-w-[617px]",
        "lg:max-w-[1060px] lg:h-[607px] lg:pb-10"
      )}
    >
      {/* BACK BUTTON AND TITLE */}
      <BoxHeader title="Select Bridge Option" onBack={prevStepHandler} />
      {/* BOX CONTENT */}
      <div
        className={cn(
          "flex flex-col gap-10 w-full flex-1",
          "lg:flex-row lg:overflow-hidden",
          "animate-slide-in opacity-0"
        )}
      >
        {/* SELECTED TOKENS */}
        <div
          className={cn(
            "flex flex-col items-center w-full justify-between",
            "lg:max-w-[55%]"
          )}
        >
          <div className="relative flex flex-col gap-y-2 w-full justify-between">
            <FromTokenCard
              token={fromToken}
              amount={amount}
              usdPrice={usdPrice}
              onAmountChange={handleAmountChange}
            />
            <div
              className={cn(
                "absolute rounded-full inset-0 w-14 h-14 m-auto z-20 cursor-pointer group",
                "flex items-center justify-center",
                "-translate-x-1/2 left-1/2 top-28",
                "bg-[#C0C0C0] text-black dark:bg-[#0B0B0B] dark:text-white",
                "border-2 border-white dark:border-white/30",
                "transition-transform duration-300 hover:rotate-180 hover:scale-110"
              )}
              onClick={swapTokensHandler}
            >
              <ArrowDownIcon width={24} height={24} />
            </div >
            <ToTokenCard
              token={toToken}
              amount={toAmount}
              usdPrice={usdPrice}
              walletAddress={toWalletAddress}
              isWalletConnected={(() => {
                if (toToken.chainTypes === "EVM" && isEvmConnected) return true;
                if (toToken.chainTypes === "ICP" && icpIdentity) return true;
                return false;
              })()}
              onWalletAddressChange={(e) => {
                setToWalletAddress(e.target.value);
              }}
              onValidationError={setToWalletValidationError}
              toWalletValidationError={toWalletValidationError}
            />
          </div >
          <ActionButton
            isDisabled={(() => {
              if (!selectedOption || !Number(amount)) return true;

              const isSourceWalletDisconnected =
                (fromToken.chainTypes === "EVM" && !isEvmConnected) ||
                (fromToken.chainTypes === "ICP" && !icpIdentity);
              if (isSourceWalletDisconnected) return true;

              return !toWalletAddress || !!toWalletValidationError;
            })()}
            onClick={(e) => e.preventDefault()}
            isMobile={false}
          >
            {(() => {
              if (!selectedOption || !Number(amount)) {
                return "Fill Required Fields";
              }

              const isSourceWalletDisconnected =
                (fromToken.chainTypes === "EVM" && !isEvmConnected) ||
                (fromToken.chainTypes === "ICP" && !icpIdentity);
              if (isSourceWalletDisconnected) {
                return "Connect Wallet";
              }

              return !toWalletAddress || toWalletValidationError
                ? "Connect Wallet"
                : "Confirm";
            })()}
          </ActionButton>
        </div >

        {/* BRIDGE OPTIONS */}
        < BridgeOptionsList
          selectedOption={selectedOption}
          expandedOption={expandedOption}
          handleOptionSelect={handleOptionSelect}
          handleExpand={handleExpand}
        />
      </div >
    </Box >
  );
};

export default SelectOptionPage;
