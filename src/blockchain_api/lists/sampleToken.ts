import { EvmToken, IcpToken } from "../types/tokens"

export const tokens: (EvmToken | IcpToken)[] = [
  {
    name: "Ethereum",
    symbol: "ETH",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    contractAddress: "0x0000000000000000000000000000000000000000",
    canisterId: undefined,
    usdPrice: 2000, // Placeholder value
    decimals: 18,
    chainId: 1,
    holdingAmount: undefined,
    usdHoldingAmount: undefined,
    chainTypes: "EVM",
  },
  {
    name: "Sepolia",
    symbol: "ETH",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    contractAddress: "0x0000000000000000000000000000000000000000",
    canisterId: undefined,
    usdPrice: 2000, // Placeholder value
    decimals: 18,
    chainId: 11155111,
    holdingAmount: undefined,
    usdHoldingAmount: undefined,
    chainTypes: "EVM",
  },
  {
    name: "Arbitrum One",
    symbol: "ETH",
    logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
    contractAddress: "0x0000000000000000000000000000000000000000",
    canisterId: undefined,
    usdPrice: 2000, // Placeholder value
    decimals: 18,
    chainId: 42161,
    holdingAmount: undefined,
    usdHoldingAmount: undefined,
    chainTypes: "EVM",
  },
  {
    name: "Binance Smart Chain",
    symbol: "BNB",
    logo: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
    contractAddress: "0x0000000000000000000000000000000000000000",
    canisterId: undefined,
    usdPrice: 250, // Placeholder value
    decimals: 18,
    chainId: 56,
    holdingAmount: undefined,
    usdHoldingAmount: undefined,
    chainTypes: "EVM",
  },
  {
    name: "Binance Smart Chain(Testnet)",
    symbol: "BNB",
    logo: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
    contractAddress: "0x0000000000000000000000000000000000000000",
    canisterId: undefined,
    usdPrice: 250, // Placeholder value
    decimals: 18,
    chainId: 97,
    holdingAmount: undefined,
    usdHoldingAmount: undefined,
    chainTypes: "EVM",
  },
  {
    name: "Polygon",
    symbol: "MATIC",
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
    contractAddress: "0x0000000000000000000000000000000000000000",
    canisterId: undefined,
    usdPrice: 1.5, // Placeholder value
    decimals: 18,
    chainId: 137,
    holdingAmount: undefined,
    usdHoldingAmount: undefined,
    chainTypes: "EVM",
  },
  {
    name: "Optimism",
    symbol: "ETH",
    logo: "https://cryptologos.cc/logos/optimism-op-logo.png",
    contractAddress: "0x0000000000000000000000000000000000000000",
    canisterId: undefined,
    usdPrice: 2000, // Placeholder value
    decimals: 18,
    chainId: 10,
    holdingAmount: undefined,
    usdHoldingAmount: undefined,
    chainTypes: "EVM",
  },
  {
    name: "Base",
    symbol: "ETH",
    logo: "https://cryptologos.cc/logos/base-logo.png",
    contractAddress: "0x0000000000000000000000000000000000000000",
    canisterId: undefined,
    usdPrice: 2000, // Placeholder value
    decimals: 18,
    chainId: 8453,
    holdingAmount: undefined,
    usdHoldingAmount: undefined,
    chainTypes: "EVM",
  },
  {
    name: "Avalanche",
    symbol: "AVAX",
    logo: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
    contractAddress: "0x0000000000000000000000000000000000000000",
    canisterId: undefined,
    usdPrice: 15, // Placeholder value
    decimals: 18,
    chainId: 43114,
    holdingAmount: undefined,
    usdHoldingAmount: undefined,
    chainTypes: "EVM",
  },
  {
    name: "Fantom",
    symbol: "FTM",
    logo: "https://cryptologos.cc/logos/fantom-ftm-logo.png",
    contractAddress: "0x0000000000000000000000000000000000000000",
    canisterId: undefined,
    usdPrice: 0.5, // Placeholder value
    decimals: 18,
    chainId: 250,
    holdingAmount: undefined,
    usdHoldingAmount: undefined,
    chainTypes: "EVM",
  },
  {
    name: "Internet Computer",
    symbol: "ICP",
    logo: "https://cryptologos.cc/logos/internet-computer-icp-logo.png",
    contractAddress: undefined,
    canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    usdPrice: 5, // Placeholder value
    decimals: 8,
    chainId: 0,
    holdingAmount: undefined,
    usdHoldingAmount: undefined,
    chainTypes: "ICP",
    disabled: true,
  },
]

export function filterTokensByChainId(
  chainId: number
): (EvmToken | IcpToken)[] {
  return tokens.filter((token) => token.chainId === chainId)
}
