"use client";
import { chains } from "@/blockchain_api/lists/chains";
import { tokens } from "@/blockchain_api/lists/sampleToken";
import { Chain } from "@/blockchain_api/types/chains";
import { EvmToken, IcpToken } from "@/blockchain_api/types/tokens";
import { LinkIcon } from "@/components/icons";
import Box from "@/components/ui/box";
import PageHeader from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";

interface TokenListPageProps {
  prevStepHandler: () => void;
  setTokenHandler: (token: EvmToken | IcpToken) => void;
  selectedType: "from" | "to";
  fromToken: EvmToken | IcpToken | null;
  toToken: EvmToken | IcpToken | null;
}

const ChainSelector = ({
  selectedChainId,
  onChainSelect,
}: {
  selectedChainId: Chain["chainId"];
  onChainSelect: (chainId: Chain["chainId"]) => void;
}) => (
  <div className="grid grid-cols-5 gap-5 place-items-center w-full select-none md:px-4 mb-7">
    {chains.map((chain, idx) => (
      <div
        key={idx}
        className={cn(
          "flex items-center justify-center rounded-round cursor-pointer w-12 h-12 md:w-14 md:h-14",
          selectedChainId === chain.chainId && "ring-4 ring-primary-buttons",
          chain.disabled && "opacity-50 cursor-not-allowed select-none"
        )}
        onClick={() => {
          if (!chain.disabled) {
            onChainSelect(chain.chainId);
          }
        }}
      >
        <Image src={chain.logo} alt={chain.name} width={54} height={54} />
      </div>
    ))}
  </div>
);

const TokenCard = ({
  token,
  onClick,
  isSelected,
}: {
  token: EvmToken | IcpToken;
  onClick: () => void;
  isSelected: boolean;
}) => (
  <div
    className={cn(
      "flex items-center gap-x-5 cursor-pointer group duration-200 rounded-sm p-2",
      "hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A]",
      isSelected && "bg-[#F5F5F5] dark:bg-[#2A2A2A]"
    )}
    onClick={onClick}
  >
    <Image
      src={token.logo}
      alt={token.name}
      width={50}
      height={50}
      className="rounded-round"
    />
    <div className="flex flex-col flex-1 min-w-0">
      <p className="text-xl font-bold text-black dark:text-white truncate">
        {token.name}
      </p>
      <div className="overflow-hidden h-5">
        <div className="flex flex-col transition-transform duration-300 group-hover:-translate-y-5">
          <p className="text-sm font-semibold text-[#6E6E6E] dark:text-[#B5B3B3] truncate">
            {token.symbol}
          </p>
          <p className="text-sm font-semibold text-[#6E6E6E] dark:text-[#B5B3B3] truncate flex items-center gap-x-2">
            {token?.contractAddress?.slice(0, 14) ||
              token?.canisterId?.slice(0, 14)}
            <Link
              href={
                token.chainTypes === "EVM"
                  ? `https://etherscan.io/token/${token.contractAddress}`
                  : `https://dashboard.internetcomputer.org/canister/${token.canisterId}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm p-0.5 hover:bg-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <LinkIcon width={18} height={18} />
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
);

const TokenListPage = ({
  prevStepHandler,
  setTokenHandler,
  selectedType,
  fromToken,
  toToken,
}: TokenListPageProps) => {
  const [query, setQuery] = useState("");
  const [selectedChainId, setSelectedChainId] = useState<Chain["chainId"]>(0);

  useEffect(() => {
    // Set initial chain based on selected token
    const tokenToCheck = selectedType === "from" ? fromToken : toToken;
    if (tokenToCheck) {
      setSelectedChainId(tokenToCheck.chainId);
    } else {
      setSelectedChainId(chains[0].chainId); // Default to first chain if no token selected
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
      <PageHeader title="Select Bridge Option" onBack={prevStepHandler} />

      <ChainSelector
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
          "border-[#1C68F8] dark:border-[#000000] rounded-sm py-2 px-3 md:mt-7 mb-6",
          "bg-white/50 dark:bg-white/30 text-black dark:text-white",
          "placeholder:text-black/50 dark:placeholder:text-white/50",
          "w-full"
        )}
      />

      <div
        className="w-full flex flex-col gap-y-5 overflow-y-auto"
        style={{ scrollbarColor: "#FFFFFF80 transparent" }}
      >
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
