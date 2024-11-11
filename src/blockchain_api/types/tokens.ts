import { ChainType } from "./chains";

interface Token {
  name: string; // Name of the token (e.g., "Ethereum")
  symbol: string; // Token symbol (e.g., "ETH")
  logo: string; // URL for the token's logo image
  usdPrice: string; // Current price of the token in USD
  decimals: number; // Number of decimals
  chainId: number; // ID of the blockchain (e.g., 1 for Ethereum mainnet) if the blockchain is icp the token id is 0
  balance?: string; // Optional: Amount the user holds of this token
  balanceRawInteger?: string;
  usdBalance?: string; // Optional: Value in USD of the user's holdings
  chainTypes: ChainType;
  disabled?: boolean; // Optional: Whether the token is disabled
}

export type EvmToken = Token & {
  contractAddress: string; // Address of the token's contract if the token is an EVm token
  canisterId?: never; // Address of the token's cansiter id if the token is an ICP token
};

export type IcpToken = Token & {
  canisterId: string; // Address of the token's cansiter id if the token is an ICP token
  contractAddress?: never; // Address of the token's contract if the token is an EVm token
};
