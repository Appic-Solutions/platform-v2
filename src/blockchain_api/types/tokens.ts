import { ChainType } from './chains';

export interface BridgePair {
  contract_or_canister_id: string;
  chain_id: number;
}

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
  chain_type: ChainType;
  disabled?: boolean; // Optional: Whether the token is disabled
  bridgePairs?: BridgePair[];
  operator?: Operator;
}

export type Operator = 'Appic' | 'Dfinity';

export type EvmToken = Token & {
  contractAddress: string; // Address of the token's contract if the token is an EVm token
  canisterId?: never; // Address of the token's cansiter id if the token is an ICP token
  fee?: never;
  tokenType?: never;
};

export type IcpToken = Token & {
  canisterId: string; // Address of the token's cansiter id if the token is an ICP token
  fee?: string; // Token transfer fee on icp network
  tokenType: string;
  contractAddress?: never; // Address of the token's contract if the token is an EVm token
};
