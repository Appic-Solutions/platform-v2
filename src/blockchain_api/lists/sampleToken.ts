import { EvmToken, IcpToken } from "../types/tokens";

export const tokens: (EvmToken | IcpToken)[] = [
  {
    name: "Ethereum",
    symbol: "ETH",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    contractAddress: "0x0000000000000000000000000000000000000000",
    canisterId: undefined,
    usdPrice: "2000", // Placeholder value
    decimals: 18,
    chainId: 1,
    balance: undefined,
    balanceRawInteger: "345354235234523",
    usdBalance: undefined,
    chainTypes: "EVM",
  },
  {
    name: "Sepolia",
    symbol: "ETH",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    contractAddress: "0x0000000000000000000000000000000000000000",
    canisterId: undefined,
    usdPrice: "2000", // Placeholder value
    decimals: 18,
    chainId: 11155111,
    balance: undefined,
    balanceRawInteger: "345354235234523",

    usdBalance: undefined,
    chainTypes: "EVM",
  },
  {
    name: "Arbitrum One",
    symbol: "ETH",
    logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
    contractAddress: "0x0000000000000000000000000000000000000000",
    canisterId: undefined,
    usdPrice: "2000", // Placeholder value
    decimals: 18,
    chainId: 42161,
    balance: undefined,
    balanceRawInteger: "345354235234523",

    usdBalance: undefined,
    chainTypes: "EVM",
  },
  {
    name: "Binance Smart Chain",
    symbol: "BNB",
    logo: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
    contractAddress: "0x0000000000000000000000000000000000000000",
    canisterId: undefined,
    usdPrice: "250", // Placeholder value
    decimals: 18,
    chainId: 56,
    balance: undefined,
    balanceRawInteger: "345354235234523",

    usdBalance: undefined,
    chainTypes: "EVM",
  },
  {
    name: "Binance Smart Chain(Testnet)",
    symbol: "BNB",
    logo: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
    contractAddress: "0x0000000000000000000000000000000000000000",
    canisterId: undefined,
    usdPrice: "250", // Placeholder value
    decimals: 18,
    chainId: 97,
    balance: undefined,
    usdBalance: undefined,
    balanceRawInteger: "345354235234523",

    chainTypes: "EVM",
  },
  {
    name: "Polygon",
    symbol: "MATIC",
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
    contractAddress: "0x0000000000000000000000000000000000000000",
    canisterId: undefined,
    usdPrice: "1.5", // Placeholder value
    decimals: 18,
    chainId: 137,
    balance: undefined,
    usdBalance: undefined,
    balanceRawInteger: "345354235234523",
    chainTypes: "EVM",
  },
  {
    name: "Optimism",
    symbol: "ETH",
    logo: "https://cryptologos.cc/logos/optimism-op-logo.png",
    contractAddress: "0x0000000000000000000000000000000000000000",
    canisterId: undefined,
    usdPrice: "2000", // Placeholder value
    decimals: 18,
    chainId: 10,
    balance: undefined,
    usdBalance: undefined,
    balanceRawInteger: "345354235234523",
    chainTypes: "EVM",
  },
  {
    name: "Base",
    symbol: "ETH",
    logo: "https://cryptologos.cc/logos/base-logo.png",
    contractAddress: "0x0000000000000000000000000000000000000000",
    canisterId: undefined,
    usdPrice: "2000", // Placeholder value
    decimals: 18,
    chainId: 8453,
    balance: undefined,
    balanceRawInteger: "345354235234523",
    usdBalance: undefined,
    chainTypes: "EVM",
  },
  {
    name: "Avalanche",
    symbol: "AVAX",
    logo: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
    contractAddress: "0x0000000000000000000000000000000000000000",
    canisterId: undefined,
    usdPrice: "15", // Placeholder value
    decimals: 18,
    chainId: 43114,
    balance: undefined,
    balanceRawInteger: "345354235234523",
    usdBalance: undefined,
    chainTypes: "EVM",
  },
  {
    name: "Fantom",
    symbol: "FTM",
    logo: "https://cryptologos.cc/logos/fantom-ftm-logo.png",
    contractAddress: "0x0000000000000000000000000000000000000000",
    canisterId: undefined,
    usdPrice: "0.5", // Placeholder value
    decimals: 18,
    chainId: 250,
    balance: undefined,
    balanceRawInteger: "345354235234523",
    usdBalance: undefined,
    chainTypes: "EVM",
  },
  {
    name: "Internet Computer",
    symbol: "ICP",
    logo: "https://cryptologos.cc/logos/internet-computer-icp-logo.png",
    contractAddress: undefined,
    canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    usdPrice: "533", // Placeholder value
    decimals: 8,
    chainId: 0,
    balanceRawInteger: "345354235234523",
    balance: undefined,
    usdBalance: undefined,
    chainTypes: "ICP",
    disabled: true,
  },
];

export function filterTokensByChainId(chainId: number): (EvmToken | IcpToken)[] {
  return tokens.filter((token) => token.chainId === chainId);
}
