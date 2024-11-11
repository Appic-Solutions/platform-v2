import { EvmToken, IcpToken } from "@/blockchain_api/types/tokens";
import { LinkIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

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
              onClick={(e) => e.stopPropagation()}
              className="rounded-sm p-0.5 hover:bg-white/10"
            >
              <LinkIcon width={18} height={18} />
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default TokenCard;
