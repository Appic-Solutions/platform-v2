import { ArrowsUpDownIcon, BlockchainIcon, LockIcon, ParkOutlineBridgeIcon } from '@/components/icons';

export interface NavbarItem {
  label: string;
  href: string;
  tooltip?: string;
  Icon: React.ReactNode;
  active: boolean;
}

export const NAVBAR_ITEMS: NavbarItem[] = [
  {
    label: 'Bridge',
    href: '/bridge',
    tooltip: 'Bridge',
    Icon: <ParkOutlineBridgeIcon width={24} height={24} className="min-w-5 min-h-5" />,
    active: true,
  },
  {
    label: 'Swap',
    href: '/swap',
    tooltip: 'Coming Soon',
    Icon: <BlockchainIcon width={24} height={24} className="min-w-5 min-h-5" />,
    active: false,
  },
  {
    label: 'Auto Invest',
    href: '/auto-invest',
    tooltip: 'Coming Soon',
    Icon: <ArrowsUpDownIcon width={24} height={24} className="min-w-5 min-h-5" />,
    active: false,
  },
  {
    label: 'Advanced',
    href: '/advanced',
    tooltip: 'Coming Soon',
    Icon: <LockIcon width={24} height={24} className="min-w-5 min-h-5" />,
    active: true,
  },
];

export interface ShapeSize {
  width: string
  height: string
  positionTop?: string
  positionBottom?: string
  positionRight?: string
  positionLeft?: string
}

export const SHAPE_SIZES: ShapeSize[] = [
  // left_top
  {
    width: "101px",
    height: "101px",
    positionTop: "25%",
    positionLeft: "5%",
  },
  // left_bottom
  {
    width: "131px",
    height: "131px",
    positionLeft: "8%",
    positionBottom: "20%",
  },
  // left_center
  {
    positionLeft: "30%",
    positionTop: "35%",
    width: "68px",
    height: "68px",
  },
  // right_top
  {
    positionRight: "29%",
    positionTop: "22%",
    width: "101px",
    height: "101px",
  },
  // right_center-first
  {
    positionRight: "0%",
    positionBottom: "25%",
    width: "239px",
    height: "239px",
  },
  // right_center-second
  {
    positionRight: "35%",
    positionBottom: "50%",
    width: "65px",
    height: "65px",
  },
  // right_bottom
  {
    positionRight: "30%",
    positionBottom: "15%",
    width: "101px",
    height: "101px",
  },
]

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
