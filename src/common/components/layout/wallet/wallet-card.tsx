import { cn } from "@/common/helpers/utils";
import { Avatar } from "@/components/common/ui/avatar";

interface WalletCardProps {
  connectWallet: () => void,
  walletLogo: string,
  walletTitle: string,
}

export default function WalletCard({
  connectWallet,
  walletLogo,
  walletTitle, }: WalletCardProps) {
  return (
    <div
      onClick={() => connectWallet()}
      className={cn(
        "flex items-center gap-2 cursor-pointer p-2 rounded-md duration-200",
        "hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A]"
      )}>
      <Avatar
        src={walletLogo}
        className='w-[51px] h-[51px]'
      />
      <span className="text-lg font-bold text-white">{walletTitle}</span>
    </div>
  )
}