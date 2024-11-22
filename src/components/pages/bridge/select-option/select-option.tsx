"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { ArrowsUpDownIcon } from "@/components/icons";
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
import WalletIcon from "@/components/icons/wallet";

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
  const [showWalletAddress, setShowWalletAddress] = useState(false);
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
        "lg:h-[607px] lg:pb-10",
        amount &&
          "lg:max-w-[1060px] transition-[max-width] duration-100 ease-in-out"
      )}
    >
      {/* BACK BUTTON AND TITLE */}
      <BoxHeader title="Receive" onBack={prevStepHandler} />
      {/* BOX CONTENT */}
      <div
        className={cn(
          "flex flex-col gap-10 w-full flex-1 justify-between",
          "lg:flex-row lg:overflow-hidden",
          "animate-slide-in opacity-0"
        )}
      >
        {/* SELECTED TOKENS */}
        <div
          className={cn(
            "flex flex-col items-center w-full justify-between",
            amount && "lg:max-w-[55%]"
          )}
        >
          <div className="relative flex flex-col gap-y-2 w-full justify-between">
            <FromTokenCard
              token={fromToken}
              amount={amount}
              usdPrice={usdPrice}
              onAmountChange={handleAmountChange}
              isWalletConnected={false}
              // isWalletConnected={(() => {
              //   if (fromToken.chainTypes === "EVM" && isEvmConnected) return true;
              //   if (fromToken.chainTypes === "ICP" && icpIdentity) return true;
              //   return false;
              // })()}
            />
            <div
              className={cn(
                "absolute rounded-full inset-0 w-12 h-12 z-20 cursor-pointer group",
                "flex items-center justify-center",
                "-translate-x-1/2 left-1/2 top-[6.3rem]",
                "bg-[#C0C0C0] text-black dark:bg-[#0B0B0B] dark:text-white",
                "border-2 border-white dark:border-white/30",
                "transition-transform duration-300 hover:rotate-180 hover:scale-110",
                "md:w-14 md:h-14",
                "lg:top-28"
              )}
              onClick={swapTokensHandler}
            >
              <ArrowsUpDownIcon width={24} height={24} />
            </div>
            <ToTokenCard
              token={toToken}
              amount={toAmount}
              usdPrice={usdPrice}
              walletAddress={toWalletAddress}
              showWalletAddress={showWalletAddress}
              onWalletAddressChange={(e) => {
                setToWalletAddress(e.target.value);
              }}
              onValidationError={setToWalletValidationError}
              toWalletValidationError={toWalletValidationError}
            />
          </div>
          {/* DESKTOP ACTION BUTTONS */}
          <div
            className={cn("flex items-center gap-x-2 w-full", "max-lg:hidden")}
          >
            <ActionButton
              isDisabled={(() => {
                if (!selectedOption || !Number(amount)) return true;

                const isSourceWalletDisconnected =
                  (fromToken.chainTypes === "EVM" && !isEvmConnected) ||
                  (fromToken.chainTypes === "ICP" && !icpIdentity);
                if (isSourceWalletDisconnected) return true;

                if (showWalletAddress) {
                  return !toWalletAddress || !!toWalletValidationError;
                }

                const isDestWalletDisconnected =
                  (toToken.chainTypes === "EVM" && !isEvmConnected) ||
                  (toToken.chainTypes === "ICP" && !icpIdentity);
                if (isDestWalletDisconnected) return true;

                return false;
              })()}
              onClick={(e) => e.preventDefault()}
            >
              {(() => {
                if (!selectedOption || !Number(amount)) {
                  return "Fill Required Fields";
                }

                const isSourceWalletDisconnected =
                  (fromToken.chainTypes === "EVM" && !isEvmConnected) ||
                  (fromToken.chainTypes === "ICP" && !icpIdentity);
                if (isSourceWalletDisconnected) {
                  return "Connect Source Wallet";
                }

                if (showWalletAddress) {
                  return !toWalletAddress || toWalletValidationError
                    ? "Enter Valid Address"
                    : "Confirm";
                }

                const isDestWalletDisconnected =
                  (toToken.chainTypes === "EVM" && !isEvmConnected) ||
                  (toToken.chainTypes === "ICP" && !icpIdentity);
                return isDestWalletDisconnected
                  ? "Connect Destination Wallet"
                  : "Confirm";
              })()}
            </ActionButton>
            <div
              onClick={() => setShowWalletAddress(!showWalletAddress)}
              className={cn(
                "rounded-full bg-primary-buttons flex items-center justify-center px-4 h-full",
                "transition-colors duration-300 cursor-pointer"
              )}
            >
              <WalletIcon className="text-white" />
            </div>
          </div>
        </div>

        {/* BRIDGE OPTIONS */}
        {amount && (
          <BridgeOptionsList
            selectedOption={selectedOption}
            expandedOption={expandedOption}
            handleOptionSelect={handleOptionSelect}
            handleExpand={handleExpand}
          />
        )}

        {/* MOBILE ACTION BUTTONS */}
        <div className={cn("flex items-center gap-x-2 w-full", "lg:hidden")}>
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
          <div
            onClick={() => setShowWalletAddress(!showWalletAddress)}
            className={cn(
              "rounded-full bg-primary-buttons flex items-center justify-center px-4 h-full",
              "transition-colors duration-300 cursor-pointer"
            )}
          >
            <WalletIcon className="text-white" />
          </div>
        </div>
      </div>
    </Box>
  );
};

export default SelectOptionPage;
