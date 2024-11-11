"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";

import { ArrowDownIcon } from "@/components/icons";
import Box from "@/components/ui/box";
import { EvmToken, IcpToken } from "@/blockchain_api/types/tokens";
import PageHeader from "@/components/ui/PageHeader";
import TokenCard from "./components/TokenCard";
import BridgeOptionsList from "./components/BridgeOptionsList";
import ActionButton from "./components/ActionButton";

const SelectOptionPage = ({
  fromToken,
  toToken,
  prevStepHandler,
}: {
  nextStepHandler: () => void;
  prevStepHandler: () => void;
  fromToken: EvmToken | IcpToken;
  toToken: EvmToken | IcpToken;
}) => {
  const [amount, setAmount] = useState("");
  const [usdPrice, setUsdPrice] = useState("0");
  const [toAmount, setToAmount] = useState("0");
  const [expandedOption, setExpandedOption] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleOptionSelect = (optionId: number) => {
    setSelectedOption(optionId);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const usdPrice = Number(value) * (fromToken?.usdPrice ?? 0);
    setAmount(e.target.value);
    setUsdPrice(usdPrice.toFixed(2));
    setToAmount((usdPrice * (toToken?.usdPrice ?? 0)).toFixed(2));
  };

  const handleExpand = (optionId: number) => {
    if (expandedOption === optionId) {
      setExpandedOption(null);
    } else {
      setExpandedOption(optionId);
    }
  };

  return (
    <Box
      className={cn(
        "flex flex-col overflow-y-scroll ",
        "lg:px-14 md:overflow-auto md:max-h-[607px] md:max-w-[617px]",
        "lg:max-w-[1060px] lg:h-[607px] lg:pb-10"
      )}
    >
      {/* BACK BUTTON AND TITLE */}
      <PageHeader title="Select Bridge Option" onBack={prevStepHandler} />
      {/* BOX CONTENT */}
      <div
        className={cn(
          "flex flex-col gap-10 w-full flex-1",
          "lg:flex-row lg:overflow-hidden"
        )}
      >
        {/* SELECTED TOKENS */}
        <div
          className={cn(
            "flex flex-col items-center w-full justify-between",
            "lg:max-w-[55%]"
          )}
        >
          <div className="relative flex flex-col gap-y-4 w-full justify-between">
            <TokenCard
              type="from"
              token={fromToken}
              amount={amount}
              usdPrice={usdPrice}
              onAmountChange={handleAmountChange}
            />
            <div
              className={cn(
                "absolute rounded-round inset-0 top-3 w-14 h-14 m-auto z-20",
                "flex items-center justify-center",
                "bg-[#C0C0C0] text-black dark:bg-[#0B0B0B] dark:text-white",
                "border-2 border-white dark:border-white/30"
              )}
            >
              <ArrowDownIcon width={24} height={24} />
            </div>
            <TokenCard
              type="to"
              token={toToken}
              amount={toAmount}
              usdPrice={usdPrice}
            />
          </div>
          {/* SELECT OPTION BUTTON: DESKTOP */}
          <ActionButton
            isDisabled={!selectedOption || !Number(amount)}
            onClick={(e) => e.preventDefault()}
            isMobile={false}
          >
            Select Option
          </ActionButton>
        </div>
        {/* BRIDGE OPTIONS */}
        <BridgeOptionsList
          selectedOption={selectedOption}
          expandedOption={expandedOption}
          handleOptionSelect={handleOptionSelect}
          handleExpand={handleExpand}
        />
      </div>
      {/* SELECT OPTION BUTTON: MOBILE */}
      <ActionButton
        isDisabled={!selectedOption || !Number(amount)}
        onClick={(e) => e.preventDefault()}
        isMobile={true}
      >
        Select Return
      </ActionButton>
    </Box>
  );
};

export default SelectOptionPage;
