interface TransactionStep {
  status: "completed" | "in_progress" | "failed";
  message: string;
  timestamp: string;
}

interface Transaction {
  id: string;
  date: string;
  time: string;
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
];
