interface TransactionStep {
  status?: "completed" | "in_progress" | "failed";
  amount?: string;
  message: string;
  timestamp: string;
}

export interface Transaction {
  id: string;
  date: string;
  time: string;
  type: "bridge" | "auto-invest" | "advanced" | "swap";
  sourceToken: {
    chainId: number;
    amount: string;
    symbol: string;
    logo: string;
    name: string;
  };
  destinationToken: {
    chainId: number;
    amount: string;
    symbol: string;
    logo: string;
    name: string;
  };
  status: "completed" | "in_progress" | "failed";
  bridgeProvider: {
    name: string;
    logo: string;
  };
  fee: string;
  isExpanded?: boolean;
  steps: TransactionStep[];
}

export const sampleTransactions: Transaction[] = [
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
    status: "in_progress",
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
        status: "in_progress",
        message: "Bridge in progress",
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
    status: "failed",
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
  {
    id: "QW424533",
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
    status: "in_progress",
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
        status: "in_progress",
        message: "Middle step connected",
        timestamp: "6:41am",
      },
      {
        status: "in_progress",
        message: "Bridge Pending",
        timestamp: "-",
      },
    ],
  },
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
    status: "in_progress",
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
        status: "in_progress",
        message: "Middle step connected",
        timestamp: "6:41am",
      },
      {
        status: "in_progress",
        message: "Bridge Pending",
        timestamp: "-",
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
      },
      {
        amount: "0.124123 BTC",
        message: "Second Swap",
        timestamp: "19/09/2024",
      },
      {
        amount: "0.124123 BTC",
        message: "Third Swap",
        timestamp: "26/09/2024",
      },
      {
        amount: "0.124123 BTC",
        message: "Fourth Swap",
        timestamp: "03/10/2024",
      },
      {
        amount: "0.124123 BTC",
        message: "Fifth Swap",
        timestamp: "10/10/2024",
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
      },
      {
        amount: "0.124123 BTC",
        message: "Second Swap",
        timestamp: "19/09/2024",
      },
      {
        amount: "0.124123 BTC",
        message: "Third Swap",
        timestamp: "26/09/2024",
      },
      {
        amount: "0.124123 BTC",
        message: "Fourth Swap Pending",
        timestamp: "10/10/2024",
      },
      {
        amount: "0.124123 BTC",
        message: "Fifth Swap Pending",
        timestamp: "10/10/2024",
      },
    ],
  },
];
