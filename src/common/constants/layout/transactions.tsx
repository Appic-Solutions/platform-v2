import {
  ArrowsUpDownIcon,
  LockIcon,
  ParkOutlineBridgeIcon,
} from "@/common/components/icons";

export interface TransactionTabItem {
  label: string;
  value: "bridge" | "auto-invest" | "advanced" | "swap";
  Icon: React.ReactNode;
}

export const TRANSACTION_TAB_ITEMS: TransactionTabItem[] = [
  {
    label: "Bridge",
    value: "bridge",
    Icon: (
      <ParkOutlineBridgeIcon
        width={24}
        height={24}
        className="min-w-5 min-h-5"
      />
    ),
  },
  // {
  //   label: "Swap",
  //   value: "swap",
  //   Icon: <BlockchainIcon width={24} height={24} className="min-w-5 min-h-5" />,
  // },
  {
    label: "Auto Invest",
    value: "auto-invest",
    Icon: (
      <ArrowsUpDownIcon width={24} height={24} className="min-w-5 min-h-5" />
    ),
  },
  {
    label: "Advanced",
    value: "advanced",
    Icon: <LockIcon width={24} height={24} className="min-w-5 min-h-5" />,
  },
];
