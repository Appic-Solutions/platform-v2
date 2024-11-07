import BlockChainIcon from "@/components/icons/blockchain"
import LockIcon from "@/components/icons/lock"
import ParkOutlineBridgeIcon from "@/components/icons/park-outline-bridge"
import TransformDataIcon from "@/components/icons/transform-data"
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
    Icon: BlockChainIcon,
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
