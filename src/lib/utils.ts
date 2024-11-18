import { chains } from "@/blockchain_api/lists/chains";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combines and merges Tailwind CSS classes */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get Chain Logo Helper Function
export const getChainLogo = (chainId: string | number | undefined): string => {
  return (
    chains.find((chain) => chain.chainId == Number(chainId))?.logo ||
    "/images/logo/chains/ethereum.svg"
  );
};

// Get Chain Name Helper Function
export const getChainName = (chainId: string | number | undefined): string => {
  return chains.find((chain) => chain.chainId == Number(chainId))?.name || "";
};

// Format number to show only counted items (e.g. 1.23456 -> 1.23)
export const getCountedNumber = (price: number | undefined | null, decimals: number = 2): string => {
  if (!price || typeof price !== "number") return "0";
  const formattedNumber = Number(price).toFixed(decimals);
  return formattedNumber === "NaN" ? "0" : formattedNumber;
};