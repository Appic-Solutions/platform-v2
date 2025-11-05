import { Avatar } from '@/components/common/ui/avatar';

interface WalletCardProps {
  connectWallet: () => void;
  walletLogo: string;
  walletTitle: string;
}

export default function WalletCard({ connectWallet, walletLogo, walletTitle }: WalletCardProps) {
  return (
    <div
      onClick={() => connectWallet()}
      className="flex cursor-pointer items-center gap-2 rounded-md p-2 duration-200 hover:bg-[#2A2A2A]"
    >
      <Avatar src={walletLogo} className="h-12 w-12" />
      <span className="font-bold text-white">{walletTitle}</span>
    </div>
  );
}
