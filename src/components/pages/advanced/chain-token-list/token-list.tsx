"use client";
import { tokens } from "@/blockchain_api/lists/sampleToken";
import { Chain } from "@/blockchain_api/types/chains";
import { EvmToken, IcpToken } from "@/blockchain_api/types/tokens";
import Box from "@/components/ui/box";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import ChainBoxPage from "./chain-box";
import TokenCard from "./token-card";
import BoxHeader from "@/components/ui/box-header";

interface TokenListProps {
  prevStepHandler: () => void;
  setTokenHandler: (token: EvmToken | IcpToken) => void;
  selectedToken: EvmToken | IcpToken | null;
}

export default function TokenListPage({
  prevStepHandler,
  setTokenHandler,
  selectedToken
}: TokenListProps) {
  const [query, setQuery] = useState("");
  const [selectedChainId, setSelectedChainId] = useState<Chain["chainId"]>(0);

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
    return (
      selectedToken?.contractAddress === token.contractAddress &&
      selectedToken?.chainId === token.chainId
    );
  };

  return (
    <Box
      className={cn(
        "justify-normal animate-slide-in opacity-0",
        "md:max-w-[612px] md:h-[607px] md:px-9 md:py-8",
      )}
    >
      <BoxHeader title="Bridge From" onBack={prevStepHandler} />
      <ChainBoxPage
        selectedChainId={selectedChainId}
        onChainSelect={setSelectedChainId}
      />
      <hr className="bg-white dark:bg-[#636363]/25 w-[calc(100%-52px)] max-md:hidden" />
      <input
        type="text"
        placeholder="Search token"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cn(
          "border-[#1C68F8] dark:border-[#000000] rounded-md py-2 px-3 md:mt-7 mb-6",
          "bg-white/50 dark:bg-white/30 text-black dark:text-white",
          "placeholder:text-black/50 dark:placeholder:text-white/50",
          "w-full"
        )}
      />
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
}
