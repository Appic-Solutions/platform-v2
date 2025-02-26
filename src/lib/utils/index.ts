import { chains } from '@/blockchain_api/lists/chains';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BigNumber } from 'bignumber.js';

/** Combines and merges Tailwind CSS classes */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get Chain Logo Helper Function
export const getChainLogo = (chainId: bigint | string | number | undefined): string => {
  return chains.find((chain) => chain.chainId == Number(chainId))?.logo || '';
};

// Get Chain Name Helper Function
export const getChainName = (chainId: bigint | string | number | undefined): string => {
  return chains.find((chain) => chain.chainId == Number(chainId))?.name || '';
};

// Get Chain Symbol Helper Function
export const getChainSymbol = (chainId: bigint | string | number | undefined): string => {
  return chains.find((chain) => chain.chainId == Number(chainId))?.nativeTokenSymbol || '';
};

// Format number to show only counted items (e.g. 1.23456 -> 1.23)
export const getCountedNumber = (price: number, decimals: number = 2): string => {
  if (!price || typeof price !== 'number') return '0';
  const formattedNumber = Number(price).toFixed(decimals);
  return formattedNumber === 'NaN' ? '0' : formattedNumber;
};

// Format wallet address to show first 6 and last 6 characters
export const getFormattedWalletAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

// Copy text to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

// Format crypto values to show only 4 significant decimals digits
export const formatToSignificantFigures = (number: string, significantDecimals: number = 5): string => {
  /**
   * Formats a number such that integers remain unchanged, and decimal numbers
   * are trimmed to the specified number of significant decimals without rounding.
   *
   * @param number - The number to format.
   * @param significantDecimals - The number of significant decimals to retain.
   * @returns The formatted number as a string.
   */

  if (BigNumber(number).isInteger()) {
    return number.toString();
  }

  const bigNum = new BigNumber(number);
  const [integerPart, decimalPart] = bigNum.toFixed().split('.');

  if (!decimalPart) {
    return bigNum.toString();
  }

  const trimmedDecimal = decimalPart.slice(0, significantDecimals);
  return `${integerPart}.${trimmedDecimal}`;
};
