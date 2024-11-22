import { EvmToken, IcpToken } from "@/blockchain_api/types/tokens";
import { ArrowsUpDownIcon } from "@/components/icons";
import Box from "@/components/ui/box";
import { cn } from "@/lib/utils";
import { TokenCard } from "./_components/TokenCard";
import AmountInput from "./_components/AmountInput";
import { useState } from "react";
import ActionButton from "./_components/ActionButton";
import BridgeOptionsList, {
  BridgeOptionType,
} from "./_components/BridgeOptionsList";
import { useAppKitAccount } from "@reown/appkit/react";
import { useIdentity } from "@nfid/identitykit/react";
import WalletIcon from "@/components/icons/wallet";
import WalletAddressInput from "./_components/WalletAddressInput";

interface SelectTokenProps {
  stepHandler: (value: "next" | "prev" | number) => void;
  setSelectedType: (type: "from" | "to") => void;
  fromToken: EvmToken | IcpToken | null;
  toToken: EvmToken | IcpToken | null;
  swapTokensHandler: () => void;
}

export default function SelectTokenPage({
  stepHandler,
  setSelectedType,
  fromToken,
  toToken,
  swapTokensHandler,
}: SelectTokenProps) {
  const [amount, setAmount] = useState("");
  const [usdPrice, setUsdPrice] = useState("0");
  const [showWalletAddress, setShowWalletAddress] = useState(false);
  const [toWalletAddress, setToWalletAddress] = useState("");
  const [toWalletValidationError, setToWalletValidationError] = useState<
    string | null
  >(null);
  const [selectedOption, setSelectedOption] = useState<BridgeOptionType | null>(
    null
  );

  const { isConnected: isEvmConnected } = useAppKitAccount();
  const icpAgent = useIdentity();

  const disabled = () => {
    if (!fromToken || !toToken) return true;
    if (
      fromToken.contractAddress === toToken.contractAddress &&
      fromToken.chainId === toToken.chainId
    )
      return true;

    if (!selectedOption || !Number(amount)) return true;

    const isSourceWalletConnected =
      fromToken.chainTypes === "EVM" ? isEvmConnected : icpAgent;

    const isDestWalletValid = toWalletAddress && !toWalletValidationError;
    const isDestWalletConnected =
      toToken.chainTypes === "EVM" ? isEvmConnected : icpAgent;

    if (
      !isSourceWalletConnected ||
      !(isDestWalletConnected || isDestWalletValid)
    )
      return true;

    return false;
  };

  const getButtonText = () => {
    if (
      fromToken &&
      toToken &&
      fromToken.contractAddress === toToken.contractAddress &&
      fromToken.chainId === toToken.chainId
    ) {
      return "Please select different tokens";
    }

    if (!selectedOption || !Number(amount)) {
      return "Fill Required Fields";
    }

    const isSourceWalletDisconnected =
      (fromToken?.chainTypes === "EVM" && !isEvmConnected) ||
      (fromToken?.chainTypes === "ICP" && !icpAgent);
    if (isSourceWalletDisconnected) {
      return "Connect Source Wallet";
    }

    if (showWalletAddress) {
      return !toWalletAddress || toWalletValidationError
        ? "Enter Valid Address"
        : "Confirm";
    }

    const isDestWalletValid = toWalletAddress && !toWalletValidationError;
    if (isDestWalletValid) {
      return "Confirm";
    }

    const isDestWalletDisconnected =
      (toToken?.chainTypes === "EVM" && !isEvmConnected) ||
      (toToken?.chainTypes === "ICP" && !icpAgent);
    return isDestWalletDisconnected ? "Connect Destination Wallet" : "Confirm";
  };

  const handleOptionSelect = (option: BridgeOptionType) => {
    if (option.isActive) {
      setSelectedOption(option);
    }
  };

  return (
    <Box
      className={cn(
        "flex flex-col gap-4",
        "lg:px-14 md:max-w-[617px] md:pb-10",
        "h-full overflow-y-scroll md:overflow-hidden",
        "lg:pb-8",
        "transition-[max-height] duration-300 ease-in-out",
        showWalletAddress ? "md:max-h-[750px]" : "md:max-h-[607px]",
        amount && "lg:max-w-[1060px]"
      )}
    >
      <h1
        className={cn(
          "text-white md:text-black md:dark:text-white mr-auto mb-5",
          "text-[26px] leading-7 md:text-[40px] md:leading-10 font-bold"
        )}
      >
        Bridge
      </h1>
      <div
        className={cn(
          "flex flex-col gap-4 w-full flex-1 justify-between",
          "lg:flex-row lg:overflow-hidden"
        )}
      >
        {/* TOKENS AND AMOUNT INPUT */}
        <div className="flex flex-col justify-between h-full items-center gap-y-4 w-full lg:max-w-[482px]">
          <div className="flex flex-col gap-y-4 w-full h-full">
            {/* TOKENS */}
            <div
              className={cn(
                "relative flex w-full",
                fromToken && toToken
                  ? "flex-col gap-y-4 sm:flex-row sm:gap-x-4"
                  : "flex-col gap-y-4"
              )}
            >
              <TokenCard
                token={fromToken}
                customOnClick={() => {
                  setSelectedType("from");
                  stepHandler("next");
                }}
                label="From"
                className={cn(
                  fromToken && "py-8 md:py-8 md:rounded-3xl",
                  fromToken && toToken ? "max-h-min md:max-h-min" : ""
                )}
              />
              <div
                className={cn(
                  "absolute rounded-full inset-0 w-14 h-14 m-auto z-20 cursor-pointer group",
                  "flex items-center justify-center",
                  "bg-[#C0C0C0] text-black dark:bg-[#0B0B0B] dark:text-white",
                  "border-2 border-white dark:border-white/30",
                  "transition-transform duration-300",
                  fromToken && toToken
                    ? "hover:rotate-180 sm:rotate-90 sm:hover:-rotate-90"
                    : "hover:rotate-180"
                )}
                onClick={swapTokensHandler}
              >
                <ArrowsUpDownIcon width={24} height={24} />
              </div>
              <TokenCard
                token={toToken}
                customOnClick={() => {
                  setSelectedType("to");
                  stepHandler("next");
                }}
                label="To"
                className={cn(
                  toToken && "py-8 md:py-8 md:rounded-3xl",
                  fromToken && toToken ? "max-h-min md:max-h-min" : ""
                )}
              />
            </div>
            {/* AMOUNT INPUT */}
            {fromToken && toToken && (
              <AmountInput
                token={fromToken}
                amount={amount}
                setAmount={setAmount}
                usdPrice={usdPrice}
                setUsdPrice={setUsdPrice}
                isWalletConnected={(() => {
                  if (fromToken.chainTypes === "EVM" && isEvmConnected)
                    return true;
                  if (fromToken.chainTypes === "ICP" && icpAgent) return true;
                  return false;
                })()}
              />
            )}
            {/* WALLET ADDRESS INPUT */}
            <WalletAddressInput
              token={toToken}
              address={toWalletAddress}
              setAddress={setToWalletAddress}
              validationError={toWalletValidationError}
              onValidationError={setToWalletValidationError}
              show={showWalletAddress}
            />
          </div>
          {/* DESKTOP ACTION BUTTONS */}
          <div
            className={cn("flex items-center gap-x-2 w-full", "max-lg:hidden")}
          >
            <ActionButton isDisabled={disabled()}>
              {getButtonText()}
            </ActionButton>
            <div
              onClick={() => setShowWalletAddress(!showWalletAddress)}
              className={cn(
                "rounded-full bg-primary-buttons bg-opacity-20 flex items-center justify-center px-4 h-full",
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
            handleOptionSelect={handleOptionSelect}
          />
        )}
      </div>
      {/* MOBILE ACTION BUTTONS */}
      <div className={cn("flex items-center gap-x-2 w-full", "lg:hidden")}>
        <ActionButton isDisabled={disabled()}>{getButtonText()}</ActionButton>
        <div
          onClick={() => setShowWalletAddress(!showWalletAddress)}
          className={cn(
            "rounded-full bg-primary-buttons bg-opacity-20 flex items-center justify-center px-4 h-full",
            "transition-colors duration-300 cursor-pointer"
          )}
        >
          <WalletIcon className="text-white" />
        </div>
      </div>
    </Box>
  );
}
