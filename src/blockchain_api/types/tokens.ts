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
  canisterId?: never; // Address of the token's canister id if the token is an ICP token
  fee?: never;
  tokenType?: never;
};

export type IcpToken = Token & {
  canisterId: string; // Address of the token's canister id if the token is an ICP token
  fee?: string; // Token transfer fee on icp network
  tokenType: string;
  contractAddress?: never; // Address of the token's contract if the token is an EVm token
};

export const get_bridge_pairs_for_token = (
  bridge_tokens: (EvmToken | IcpToken)[],
  token_id: string,
  chain_id: number,
): (EvmToken | IcpToken)[] => {
  // Find the base token by matching `token_id` with `canisterId` or `contractAddress`
  const base_token = bridge_tokens.find((token) => token.canisterId === token_id || token.contractAddress === token_id);

  if (!base_token?.bridgePairs) {
    return []; // Early exit if no base token or bridge pairs exist
  }

  // Filter bridge pairs for the specified chain_id
  const pairs = base_token.bridgePairs.filter((pair) => pair.chain_id === chain_id);

  // Map over pairs and gather matching tokens efficiently
  const filtered_token_pairs = pairs.flatMap((pair) =>
    bridge_tokens.filter(
      (token) =>
        token.canisterId === pair.contract_or_canister_id || token.contractAddress === pair.contract_or_canister_id,
    ),
  );

  return filtered_token_pairs;
};
