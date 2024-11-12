"use client";
import { chains } from "@/blockchain_api/lists/chains";
import { tokens } from "@/blockchain_api/lists/sampleToken";
import { Chain } from "@/blockchain_api/types/chains";
import { EvmToken, IcpToken } from "@/blockchain_api/types/tokens";
import Box from "@/components/ui/box";
import PageHeader from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";
import { useMemo, useState, useEffect } from "react";
import ChainBoxPage from "./chain-box";
import TokenCard from "./token-card";

const TokenListPage = ({
  prevStepHandler,
  setTokenHandler,
  selectedType,
  fromToken,
  toToken,
}: {
  prevStepHandler: () => void;
  setTokenHandler: (token: EvmToken | IcpToken) => void;
  selectedType: "from" | "to";
  fromToken: EvmToken | IcpToken | null;
  toToken: EvmToken | IcpToken | null;
}) => {
  const [query, setQuery] = useState("");
  const [selectedChainId, setSelectedChainId] = useState<Chain["chainId"]>(0);

  useEffect(() => {
    const tokenToCheck = selectedType === "from" ? fromToken : toToken;
    if (tokenToCheck) {
      setSelectedChainId(tokenToCheck.chainId);
    } else {
      setSelectedChainId(chains[0].chainId);
    }
  }, [selectedType, fromToken, toToken]);

  const filteredTokens = useMemo(() => {
    const searchQuery = query.toLowerCase();
    return tokens
      .filter((token) => token.chainId === selectedChainId)
      .filter(
        (token) =>
          token.name.toLowerCase().includes(searchQuery) ||
          token.symbol.toLowerCase().includes(searchQuery) ||
          token.contractAddress?.toLowerCase().includes(searchQuery) ||
          token.canisterId?.toLowerCase().includes(searchQuery)
      );
  }, [query, selectedChainId]);

  const isTokenSelected = (token: EvmToken | IcpToken) => {
    if (selectedType === "from") {
      return (
        fromToken?.contractAddress === token.contractAddress &&
        fromToken?.chainId === token.chainId
      );
    }
    return (
      toToken?.contractAddress === token.contractAddress &&
      toToken?.chainId === token.chainId
    );
  };

  return (
    <Box className="justify-normal md:max-w-[611px] md:max-h-[716px] md:pt-6">
      <PageHeader title="Bridge From" onBack={prevStepHandler} />

      <ChainBoxPage selectedChainId={selectedChainId} onChainSelect={setSelectedChainId} />

      <hr className="bg-white dark:bg-[#636363]/25 w-[calc(100%-52px)] max-md:hidden" />

      <input
        type="text"
        placeholder="Search token"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cn(
          "border-[#1C68F8] dark:border-[#000000] rounded-sm py-2 px-3 md:mt-7 mb-6",
          "bg-white/50 dark:bg-white/30 text-black dark:text-white",
          "placeholder:text-black/50 dark:placeholder:text-white/50",
          "w-full"
        )} />

      <div className="w-full flex flex-col gap-y-5 overflow-y-auto">
        {filteredTokens.map((token, idx) => (
          <TokenCard
            key={idx}
            token={token}
            onClick={() => {
              setTokenHandler(token);
              prevStepHandler();
            }}
            isSelected={isTokenSelected(token)}
          />
        ))}
      </div>
    </Box>
  );
};

export default TokenListPage;
