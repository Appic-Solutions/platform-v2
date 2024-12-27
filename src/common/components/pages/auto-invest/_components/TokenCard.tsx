import { getChainName } from "@/common/helpers/utils";

import { IcpToken } from "@/blockchain_api/types/tokens";
import { Avatar, AvatarFallback, AvatarImage } from "@/common/components/ui/avatar";
import { Card } from "@/common/components/ui/card";
import { cn } from "@/common/helpers/utils";

interface TokenCardProps {
  customOnClick: () => void;
  token: IcpToken | null;
  label: string;
  className?: string;
}

export function TokenCard({
  token,
  customOnClick,
  label,
  className,
}: TokenCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer flex-col items-start justify-center gap-2",
        "max-h-[105px] md:max-h-[120px]",
        className
      )}
      onClick={() => {
        customOnClick?.();
      }}
    >
      <p className="text-sm font-semibold">{label}</p>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className=" w-11 h-11 rounded-full">
            <AvatarImage src={token?.logo || "images/logo/placeholder.png"} />
            <AvatarFallback>{token?.symbol}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex items-center gap-x-4">
          <p>{token?.symbol || "Select Token"}</p>
          <p className="text-lg text-secondary">
            {getChainName(token?.chainId)}
          </p>
        </div>
      </div>
    </Card>
  );
}
