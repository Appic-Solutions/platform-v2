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
    label: "Swap",
    href: "/",
    tooltip: "Swap",
    Icon: ParkOutlineBridgeIcon,
  },
  {
    label: "Cross chain",
    href: "/cross-chain",
    tooltip: "Swap",
    Icon: BlockChainIcon,
  },
  {
    label: "Auto invest",
    href: "/auto-invest",
    tooltip: "Auto invest",
    Icon: TransformDataIcon,
  },
  {
    label: "Advanced",
    href: "/advanced",
    tooltip: "Swap",
    Icon: LockIcon,
  },
]
