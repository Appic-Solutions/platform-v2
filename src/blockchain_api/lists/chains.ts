import { Chain } from "../types/chains";

export const chains: Chain[] = [
  {
    chainId: 0,
    name: "ICP",
    nativeTokenSymbol: "ICP",
    scannerAddress: "https://dashboard.internetcomupter.org",
    depositHelperAddress: null,
    type: "ICP",
    disabled: false,
    logo: "/images/logo/chains-logos/icp.svg",
    minter_address: undefined,
    ankr_handle: undefined,
  },
  {
    chainId: 1,
    name: "Ethereum",
    nativeTokenSymbol: "ETH",
    scannerAddress: "https://etherscan.io",
    depositHelperAddress: "0xDepositHelperAddressExample1",
    type: "EVM",
    disabled: true,
    logo: "/images/logo/chains-logos/ethereum.svg",
    minter_address: "",
    ankr_handle: "eth",
  },
  {
    chainId: 42161,
    name: "Arbitrum One",
    nativeTokenSymbol: "ETH",
    scannerAddress: "https://arbiscan.io",
    depositHelperAddress: "0xDepositHelperAddressExample3",
    type: "EVM",
    disabled: true,
    logo: "/images/logo/chains-logos/arbitrum.svg",
    minter_address: "",
    ankr_handle: "arbitrum",
  },
  {
    chainId: 56,
    name: "BSC",
    nativeTokenSymbol: "BNB",
    scannerAddress: "https://bscscan.com",
    depositHelperAddress: "0xDepositHelperAddressExample4",
    type: "EVM",
    disabled: true,
    logo: "/images/logo/chains-logos/bsc.svg",
    minter_address: "",
    ankr_handle: "bsc",
  },
  {
    chainId: 97,
    name: "BSC(Testnet)",
    nativeTokenSymbol: "BNB",
    scannerAddress: "https://testnet.bscscan.com",
    depositHelperAddress: "0xDepositHelperAddressExample5",
    type: "EVM",
    disabled: false,
    logo: "/images/logo/chains-logos/bsc.svg",
    minter_address: "",
    ankr_handle: undefined,
  },
  {
    chainId: 137,
    name: "Polygon",
    nativeTokenSymbol: "MATIC",
    scannerAddress: "https://polygonscan.com",
    depositHelperAddress: "0xDepositHelperAddressExample6",
    type: "EVM",
    disabled: true,
    logo: "/images/logo/chains-logos/polygon.svg",
    minter_address: "",
    ankr_handle: "polygon",
  },
  {
    chainId: 10,
    name: "Optimism",
    nativeTokenSymbol: "ETH",
    scannerAddress: "https://optimistic.etherscan.io",
    depositHelperAddress: "0xDepositHelperAddressExample7",
    type: "EVM",
    disabled: true,
    logo: "/images/logo/chains-logos/optimism.svg",
    minter_address: "",
    ankr_handle: "optimism",
  },
  {
    chainId: 8453,
    name: "Base",
    nativeTokenSymbol: "ETH",
    scannerAddress: "https://basescan.org",
    depositHelperAddress: "0xDepositHelperAddressExample8",
    type: "EVM",
    disabled: true,
    logo: "/images/logo/chains-logos/base.svg",
    minter_address: "",
    ankr_handle: "base",
  },
  {
    chainId: 43114,
    name: "Avalanche",
    nativeTokenSymbol: "AVAX",
    scannerAddress: "https://snowtrace.io",
    depositHelperAddress: "0xDepositHelperAddressExample9",
    type: "EVM",
    disabled: true,
    logo: "/images/logo/chains-logos/avalanche.svg",
    minter_address: "",
    ankr_handle: "avalanche",
  },
  {
    chainId: 250,
    name: "Fantom",
    nativeTokenSymbol: "FTM",
    scannerAddress: "https://ftmscan.com",
    depositHelperAddress: "0xDepositHelperAddressExample10",
    type: "EVM",
    disabled: true,
    logo: "/images/logo/chains-logos/fantom.svg",
    minter_address: "",
    ankr_handle: "fantom",
  },
];
