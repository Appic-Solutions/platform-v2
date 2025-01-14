import { ArrowsUpDownIcon, BlockchainIcon, LockIcon, ParkOutlineBridgeIcon } from "@/common/components/icons";
import { ReactNode } from "react";
import BridgeContent from "../_components/bridge-content";
import AutoInvestContent from "../_components/auto-invest-content";
import SwapContent from "../_components/swap-content";
import AdvancedContent from "../_components/advanced-content";

export interface PageParamsItem {
  name: string
  icon: ReactNode
  component: () => JSX.Element
}

export const PAGE_PARAMS_DATA: PageParamsItem[] = [
  {
    name: 'bridge',
    icon: <ParkOutlineBridgeIcon width={24} height={24} className="min-w-5 min-h-5" />,
    component: BridgeContent
  },
  {
    name: 'auto-invest',
    icon: <BlockchainIcon width={24} height={24} className="min-w-5 min-h-5" />,
    component: AutoInvestContent
  },
  {
    name: 'swap',
    icon: <ArrowsUpDownIcon width={24} height={24} className="min-w-5 min-h-5" />,
    component: SwapContent
  },
  {
    name: 'advanced',
    icon: <LockIcon width={24} height={24} className="min-w-5 min-h-5" />,
    component: AdvancedContent
  }
]

export interface SampleTransaction {
  title: string
  status: string
  time: string
  href: string
}

export const SAMPLE_TRANSACTIONS: SampleTransaction[] = [
  {
    title: "Middle step connected",
    status: "Pending",
    time: "6:32am",
    href: "",
  },
  {
    title: "Middle step connected",
    status: "Completed",
    time: "6:32am",
    href: "/test",
  },
  {
    title: "Middle step connected",
    status: "Failed",
    time: "6:32am",
    href: "",
  },
]

interface TransactionStep {
  status?: "completed" | "pending" | "failed";
  amount?: string;
  message: string;
  timestamp: string;
}

interface TokenInfo {
  chainId: number;
  amount: string;
  symbol: string;
  logo: string;
  name: string;
}

// New interfaces for twin token specific data
interface TwinTokenInfo {
  name?: string;
  symbol?: string;
  fee?: string;
}

export interface Transaction {
  id: string;
  date: string;
  time: string;
  type: "bridge" | "auto-invest" | "advanced" | "swap" | "twin";
  sourceToken: TokenInfo;
  destinationToken: TokenInfo;
  status: "completed" | "pending" | "failed";
  completedStep: 0 | 1 | 2;
  bridgeProvider: {
    name: string;
    logo: string;
  };
  fee: string;
  isExpanded?: boolean;
  steps: TransactionStep[];
  // Additional fields for twin token transactions
  value?: number;
  originalToken?: {
    name: string;
    symbol: string;
    blockchain: string;
  };
  twinToken?: TwinTokenInfo;
}

export const sampleTransactions: Transaction[] = [
  // bridge transactions
  {
    id: "QW4245232",
    date: "January 11, 2024",
    time: "6:32am",
    type: "bridge",
    completedStep: 0,
    sourceToken: {
      chainId: 137,
      amount: "0.1241235",
      symbol: "ETH",
      logo: "/images/logo/chains-logos/polygon.svg",
      name: "ETH on Polygon",
    },
    destinationToken: {
      chainId: 1,
      amount: "0.1241235",
      symbol: "ETH",
      logo: "/images/logo/chains-logos/ethereum.svg",
      name: "ETH on Ethereum",
    },
    status: "pending",
    bridgeProvider: {
      name: "Li.FI",
      logo: "/images/logo/bridge-providers/lifi.svg",
    },
    fee: "$1.24",
    steps: [
      {
        status: "completed",
        message: "Middle step connected",
        timestamp: "6:32am",
      },
      {
        status: "pending",
        message: "Bridge in progress",
        timestamp: "6:36am",
      },
    ],
  },
  {
    id: "QW42S45232",
    date: "January 11, 2024",
    time: "6:32am",
    type: "bridge",
    sourceToken: {
      chainId: 137,
      amount: "0.1241235",
      symbol: "ETH",
      logo: "/images/logo/chains-logos/polygon.svg",
      name: "ETH on Polygon",
    },
    destinationToken: {
      chainId: 1,
      amount: "0.1241235",
      symbol: "ETH",
      logo: "/images/logo/chains-logos/ethereum.svg",
      name: "ETH on Ethereum",
    },
    status: "failed",
    completedStep: 1,
    bridgeProvider: {
      name: "Li.FI",
      logo: "/images/logo/bridge-providers/lifi.svg",
    },
    fee: "$1.24",
    steps: [
      {
        status: "completed",
        message: "Bridge transaction submitted",
        timestamp: "6:30am",
      },
      {
        status: "completed",
        message: "Bridge transaction confirmed",
        timestamp: "6:31am",
      },
      {
        status: "completed",
        message: "Middle step connected",
        timestamp: "6:32am",
      },
      {
        status: "failed",
        message: "Bridge failed",
        timestamp: "6:36am",
      },
    ],
  },
  {
    id: "QW424532",
    date: "January 11, 2024",
    time: "6:32am",
    type: "bridge",
    sourceToken: {
      chainId: 137,
      amount: "0.1241235",
      symbol: "ETH",
      logo: "/images/logo/chains-logos/polygon.svg",
      name: "ETH on Polygon",
    },
    destinationToken: {
      chainId: 1,
      amount: "0.1241235",
      symbol: "ETH",
      logo: "/images/logo/chains-logos/ethereum.svg",
      name: "ETH on Ethereum",
    },
    status: "completed",
    completedStep: 2,
    bridgeProvider: {
      name: "Li.FI",
      logo: "/images/logo/bridge-providers/lifi.svg",
    },
    fee: "$1.24",
    steps: [
      {
        status: "completed",
        message: "Bridge transaction confirmed",
        timestamp: "6:31am",
      },
      {
        status: "completed",
        message: "Middle step connected",
        timestamp: "6:32am",
      },
      {
        status: "completed",
        message: "Bridge Completed",
        timestamp: "6:36am",
      },
    ],
  },
  // advanced transactions
  {
    id: "QW424S533",
    date: "January 11, 2024",
    time: "6:40am",
    type: "advanced",
    sourceToken: {
      chainId: 42161,
      amount: "0.5000000",
      symbol: "ETH",
      logo: "/images/logo/chains-logos/arbitrum.svg",
      name: "ETH on Arbitrum",
    },
    destinationToken: {
      chainId: 10,
      amount: "0.4995000",
      symbol: "ETH",
      logo: "/images/logo/chains-logos/optimism.svg",
      name: "ETH on Optimism",
    },
    status: "pending",
    completedStep: 0,
    bridgeProvider: {
      name: "Li.FI",
      logo: "/images/logo/bridge-providers/lifi.svg",
    },
    fee: "$2.15",
    steps: [
      {
        status: "completed",
        message: "Bridge transaction confirmed",
        timestamp: "6:40am",
      },
      {
        status: "pending",
        message: "Middle step connected",
        timestamp: "6:41am",
      },
      {
        status: "pending",
        message: "Bridge Pending",
        timestamp: "-",
      },
    ],
  },
  {
    id: "TW424537",
    date: "January 11, 2024",
    time: "6:32am",
    type: "advanced",
    sourceToken: {
      chainId: 1,
      amount: "4642.42",
      symbol: "ETH",
      logo: "/images/logo/chains-logos/ethereum.svg",
      name: "ETH on Ethereum",
    },
    destinationToken: {
      chainId: 1,
      amount: "4642.42",
      symbol: "ETH",
      logo: "/images/logo/chains-logos/solana.svg",
      name: "ETH on Solana",
    },
    status: "completed",
    completedStep: 2,
    bridgeProvider: {
      name: "Twin Token",
      logo: "/images/logo/bridge-providers/twin.svg",
    },
    fee: "0.01 ICP",
    steps: [
      {
        status: "completed",
        message: "Twin token created",
        timestamp: "6:32am",
      },
    ],
    // Twin token specific fields
    value: 4642.42,
    originalToken: {
      name: "Acme Coin",
      symbol: "ACM",
      blockchain: "Internet Computer (ICP)",
    },
    twinToken: {
      name: "Acme Twin",
      symbol: "ACMT",
      fee: "0.01 ICP",
    },
  },
  // auto-invest transactions
  {
    id: "QW424533",
    date: "January 11, 2024",
    time: "6:40am",
    type: "auto-invest",
    sourceToken: {
      chainId: 42161,
      amount: "0.5000000",
      symbol: "ETH",
      logo: "/images/logo/chains-logos/arbitrum.svg",
      name: "ETH on Arbitrum",
    },
    destinationToken: {
      chainId: 10,
      amount: "0.4995000",
      symbol: "ETH",
      logo: "/images/logo/chains-logos/optimism.svg",
      name: "ETH on Optimism",
    },
    status: "pending",
    completedStep: 1,
    bridgeProvider: {
      name: "Li.FI",
      logo: "/images/logo/bridge-providers/lifi.svg",
    },
    fee: "$2.15",
    steps: [
      {
        amount: "0.124123 BTC",
        message: "First Swap",
        timestamp: "12/09/2024",
        status: "completed",
      },
      {
        amount: "0.124123 BTC",
        message: "Second Swap",
        timestamp: "19/09/2024",
        status: "completed",
      },
    ],
  },
  {
    id: "AI424535",
    date: "January 12, 2024",
    time: "6:32am",
    type: "auto-invest",
    sourceToken: {
      chainId: 137,
      amount: "0.1241235",
      symbol: "ETH",
      logo: "/images/logo/chains-logos/polygon.svg",
      name: "ETH on Polygon",
    },
    destinationToken: {
      chainId: 1,
      amount: "0.1241235",
      symbol: "ETH",
      logo: "/images/logo/chains-logos/solana.svg",
      name: "ETH on Solana",
    },
    status: "completed",
    completedStep: 2,
    bridgeProvider: {
      name: "Li.FI",
      logo: "/images/logo/bridge-providers/lifi.svg",
    },
    fee: "$1.24",
    steps: [
      {
        amount: "0.124123 BTC",
        message: "First Swap",
        timestamp: "12/09/2024",
        status: "completed",
      },
      {
        amount: "0.124123 BTC",
        message: "Second Swap",
        timestamp: "19/09/2024",
        status: "completed",
      },
      {
        amount: "0.124123 BTC",
        message: "Third Swap",
        timestamp: "26/09/2024",
        status: "failed",
      },
      {
        amount: "0.124123 BTC",
        message: "Fourth Swap",
        timestamp: "03/10/2024",
        status: "failed",
      },
      {
        amount: "0.124123 BTC",
        message: "Fifth Swap",
        timestamp: "10/10/2024",
        status: "failed",
      },
    ],
  },
  {
    id: "AI424536",
    date: "January 12, 2024",
    time: "6:32am",
    type: "auto-invest",
    sourceToken: {
      chainId: 1,
      amount: "0.5000000",
      symbol: "ETH",
      logo: "/images/logo/chains-logos/ethereum.svg",
      name: "ETH on Ethereum",
    },
    destinationToken: {
      chainId: 42161,
      amount: "0.4995000",
      symbol: "ETH",
      logo: "/images/logo/chains-logos/arbitrum.svg",
      name: "ETH on Arbitrum",
    },
    status: "failed",
    completedStep: 0,
    bridgeProvider: {
      name: "Li.FI",
      logo: "/images/logo/bridge-providers/lifi.svg",
    },
    fee: "$2.15",
    steps: [
      {
        amount: "0.124123 BTC",
        message: "First Swap",
        timestamp: "12/09/2024",
        status: "completed",
      },
      {
        amount: "0.124123 BTC",
        message: "Second Swap",
        timestamp: "19/09/2024",
        status: "completed",
      },
      {
        amount: "0.124123 BTC",
        message: "Third Swap",
        timestamp: "26/09/2024",
        status: "failed",
      },
      {
        amount: "0.124123 BTC",
        message: "Fourth Swap",
        timestamp: "03/10/2024",
        status: "failed",
      },
      {
        amount: "0.124123 BTC",
        message: "Fifth Swap",
        timestamp: "10/10/2024",
        status: "failed",
      },
    ],
  },
];
