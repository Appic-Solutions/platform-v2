import {
  blockchainIcon,
  LockIcon,
  ParkOutlineBridgeIcon,
  TransformDataIcon,
} from "@/components/icons"
import { ElementType } from "react"

export interface NavbarItem {
  label: string
  href: string
  tooltip?: string
  Icon: ElementType
}

export const NAVBAR_ITEMS: NavbarItem[] = [
  {
    label: "Bridge",
    href: "/",
    tooltip: "Bridge",
    Icon: ParkOutlineBridgeIcon,
  },
  {
    label: "Swap",
    href: "/swap",
    tooltip: "Swap",
    Icon: blockchainIcon,
  },
  {
    label: "Auto Invest",
    href: "/auto-invest",
    tooltip: "Auto Invest",
    Icon: TransformDataIcon,
  },
  {
    label: "Advanced",
    href: "/advanced",
    tooltip: "Advanced",
    Icon: LockIcon,
  },
]
