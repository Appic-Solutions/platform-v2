interface EvmToken {
  name: string; // Name of the token (e.g., "Ethereum")
  symbol: string; // Token symbol (e.g., "ETH")
  logo: string; // URL for the token's logo image
  contractAddress: string; // Address of the token's contract
  usdPrice: number; // Current price of the token in USD
  decimals: number; // Number of decimals
  chainId: number; // ID of the blockchain (e.g., 1 for Ethereum mainnet)
  holdingAmount?: number; // Optional: Amount the user holds of this token
  usdHoldingAmount?: number; // Optional: Value in USD of the user's holdings
}

interface IcpToken {
  name: string; // Name of the token (e.g., "Ethereum")
  symbol: string; // Token symbol (e.g., "ETH")
  logo: string; // URL for the token's logo image
  canisterId: string; // Address of the token's contract
  usdPrice: number; // Current price of the token in USD
  decimals: number; // Number of decimals
  holdingAmount?: number; // Optional: Amount the user holds of this token
  usdHoldingAmount?: number; // Optional: Value in USD of the user's holdings
}
