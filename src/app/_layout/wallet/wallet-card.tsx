import { cn } from '@/lib/utils';
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
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-md p-2 duration-200',
        'hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A]',
      )}
    >
      <Avatar src={walletLogo} className="h-[51px] w-[51px]" />
      <span className="text-lg font-bold text-white">{walletTitle}</span>
    </div>
  );
}
