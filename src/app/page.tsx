"use client";
import { Chain } from "@/blockchain_api/types/chains";
import SelectTokenPage from "@/components/pages/bridge/select-token";
import TokenListPage from "@/components/pages/bridge/token-list";
import { useState } from "react";

const BridgeHome = () => {
  // States
  const [activeStep, setActiveStep] = useState(1)
  const [selectedChain, setSelectedChain] = useState<Chain["chainId"] | null>(null)


  // Step Handlers
  const nextStepHandler = () => {
    setActiveStep(prev => prev + 1)
  }
  const prevStepHandler = () => {
    setActiveStep(prev => prev - 1)
  }

  // Select Chain
  const selectChainHandler = (chainId: Chain["chainId"]) => {
    setSelectedChain(chainId)
  }

  switch (activeStep) {
    case 1:
      return <SelectTokenPage nextStepHandler={nextStepHandler} />
    case 2:
      return <TokenListPage
        prevStepHandler={prevStepHandler}
        selectedChain={selectedChain}
        selectChainHandler={selectChainHandler}
      />
    default:
      return <></>
  }

};

export default BridgeHome;
