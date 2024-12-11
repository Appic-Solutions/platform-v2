import {
  ArrowsUpDownIcon,
  BlockchainIcon,
  LockIcon,
  ParkOutlineBridgeIcon,
} from "@/components/icons";

export interface NavbarItem {
  label: string;
  href: string;
  tooltip?: string;
  Icon: React.ReactNode;
  active: boolean;
}

export const NAVBAR_ITEMS: NavbarItem[] = [
  {
    label: "Bridge",
    href: "/",
    tooltip: "Bridge",
    Icon: (
      <ParkOutlineBridgeIcon
        width={24}
        height={24}
        className="min-w-5 min-h-5"
      />
    ),
    active: true,
  },
  {
    label: "Swap",
    href: "/swap",
    tooltip: "Coming Soon",
    Icon: <BlockchainIcon width={24} height={24} className="min-w-5 min-h-5" />,
    active: false,
  },
  {
    label: "Auto Invest",
    href: "/auto-invest",
    tooltip: "Coming Soon",
    Icon: (
      <ArrowsUpDownIcon width={24} height={24} className="min-w-5 min-h-5" />
    ),
    active: false,
  },
  {
    label: "Advanced",
    href: "/advanced",
    tooltip: "Coming Soon",
    Icon: <LockIcon width={24} height={24} className="min-w-5 min-h-5" />,
    active: true,
  },
];
