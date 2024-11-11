import { chains } from "@/blockchain_api/lists/chains";
import { Chain } from "@/blockchain_api/types/chains";
import Tooltip from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";

const ChainBoxPage = ({
  selectedChainId,
  onChainSelect,
}: {
  selectedChainId: Chain["chainId"];
  onChainSelect: (chainId: Chain["chainId"]) => void;
}) => {
  return (
    <div className="grid grid-cols-5 gap-5 place-items-center w-full select-none md:px-4 mb-7">
      {chains.map((chain, idx) => (
        <div className="relative group" key={idx}>
          <div
            className={cn(
              "flex items-center justify-center rounded-round cursor-pointer w-12 h-12 md:w-14 md:h-14",
              selectedChainId === chain.chainId && "ring-4 ring-primary-buttons",
              chain.disabled && "opacity-50 cursor-not-allowed select-none"
            )}
            onClick={() => {
              if (!chain.disabled) {
                onChainSelect(chain.chainId);
              }
            }}>
            <Image src={chain.logo} alt={chain.name} width={54} height={54} />
          </div>
          <Tooltip>{chain.name}</Tooltip>
        </div>
      ))}
    </div>
  );
};

export default ChainBoxPage;
