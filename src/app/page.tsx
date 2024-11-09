"use client";
import { EvmToken, IcpToken } from "@/blockchain_api/types/tokens";
import SelectOptionPage from "@/components/pages/bridge/select-return";
import SelectTokenPage from "@/components/pages/bridge/select-token";
import TokenListPage from "@/components/pages/bridge/token-list";
import { useState } from "react";

type TokenType = EvmToken | IcpToken | null;
type SelectionType = "from" | "to";

const BridgeHome = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedType, setSelectedType] = useState<SelectionType>("from");
  const [fromToken, setFromToken] = useState<TokenType>(null);
  const [toToken, setToToken] = useState<TokenType>(null);

  const handleStepChange = (direction: "next" | "prev" | number) => {
    setActiveStep(prev => {
      const newStep = typeof direction === "number" ? direction : prev + (direction === "next" ? 1 : -1);
      return Math.min(Math.max(newStep, 1), 4);
    });
  };

  const handleTokenSelection = (token: EvmToken | IcpToken) => {
    const setToken = selectedType === "from" ? setFromToken : setToToken;
    setToken(token);
  };

  const swapTokensHandler = () => {
    if (!fromToken || !toToken) return;
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  }

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <SelectTokenPage
            stepHandler={handleStepChange}
            setSelectedType={setSelectedType}
            fromToken={fromToken}
            toToken={toToken}
            swapTokensHandler={swapTokensHandler}
          />
        );
      case 2:
        return (
          <TokenListPage
            prevStepHandler={() => handleStepChange("prev")}
            setTokenHandler={handleTokenSelection}
            selectedType={selectedType}
            fromToken={fromToken}
            toToken={toToken}
          />
        );
      case 3:
        return (
          <SelectOptionPage
            nextStepHandler={() => handleStepChange("next")}
          />
        );
      default:
        return null;
    }
  };

  return renderStep();
};

export default BridgeHome;
