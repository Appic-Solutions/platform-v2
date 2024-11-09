import {
  ArrowsUpDownIcon,
  blockchainIcon,
  LockIcon,
  ParkOutlineBridgeIcon,
} from "@/components/icons"
import { ElementType } from "react"

export interface NavbarItem {
  label: string
  href: string
  tooltip?: string
  Icon: ElementType
  active: boolean
}

export const NAVBAR_ITEMS: NavbarItem[] = [
  {
    label: "Bridge",
    href: "/",
    tooltip: "Bridge",
    Icon: ParkOutlineBridgeIcon,
    active: true,
  },
  {
    label: "Swap",
    href: "/swap",
    tooltip: "Swap",
    Icon: blockchainIcon,
    active: false,
  },
  {
    label: "Auto Invest",
    href: "/auto-invest",
    tooltip: "Auto Invest",
    Icon: ArrowsUpDownIcon,
    active: false,
  },
  {
    label: "Advanced",
    href: "/advanced",
    tooltip: "Advanced",
    Icon: LockIcon,
    active: false,
  },
]
