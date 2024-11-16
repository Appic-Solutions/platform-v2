import { chains } from "@/blockchain_api/lists/chains";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Combines and merges Tailwind CSS classes */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get Chain Logo Helper Function
export const getChainLogo = (chainId: string | number | undefined): string => {
  return chains.find((chain) => chain.chainId == Number(chainId))?.logo || "/images/logo/chains/ethereum.svg";
};