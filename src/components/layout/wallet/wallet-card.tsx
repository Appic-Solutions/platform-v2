import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
      <Avatar className="w-[51px] h-[51px]">
        <AvatarImage src={walletLogo} alt={walletTitle} />
        <AvatarFallback>{walletTitle}</AvatarFallback>
      </Avatar>
      <span className="text-lg font-bold text-white">{walletTitle}</span>
    </div>
  )
}