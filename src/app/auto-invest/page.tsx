"use client";

import { IcpToken } from "@/blockchain_api/types/tokens";
import AutoInvestTokenListPage from "@/components/pages/auto-invest/_components/chain-token-list/AutoInvestTokenListPage";
import AutoInvestSelectToken from "@/components/pages/auto-invest/AutoInvestSelectToken";
import { useState } from "react";

type SelectionType = "buy" | "sell";
type TokenType = IcpToken | null;

const AutoInvestPage = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedType, setSelectedType] = useState<SelectionType>("buy");
  const [fromToken, setFromToken] = useState<TokenType>(null);
  const [toToken, setToToken] = useState<TokenType>(null);

  const handleStepChange = (direction: "next" | "prev" | number) => {
    setActiveStep((prev) => {
      const newStep =
        typeof direction === "number"
          ? direction
          : prev + (direction === "next" ? 1 : -1);
      return Math.min(Math.max(newStep, 1), 4);
    });
  };

  const handleTokenSelection = (token: IcpToken) => {
    const setToken = selectedType === "sell" ? setFromToken : setToToken;
    setToken(token);
  };

  const swapTokensHandler = () => {
    if (!fromToken || !toToken) return;
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <AutoInvestSelectToken
            stepHandler={handleStepChange}
            setSelectedType={setSelectedType}
            fromToken={fromToken}
            toToken={toToken}
            swapTokensHandler={swapTokensHandler}
          />
        );
      case 2:
        return (
          <AutoInvestTokenListPage
            prevStepHandler={() => handleStepChange("prev")}
            setTokenHandler={handleTokenSelection}
            selectedType={selectedType}
            fromToken={fromToken}
            toToken={toToken}
          />
        );
      default:
        return null;
    }
  };

  return renderStep();
};

export default AutoInvestPage;
