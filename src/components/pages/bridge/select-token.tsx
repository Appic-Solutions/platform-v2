import { EvmToken, IcpToken } from "@/blockchain_api/types/tokens";
import { ArrowsUpDownIcon } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Box from "@/components/ui/box";
import Card from "@/components/ui/card";
import { cn, getChainLogo, getChainName } from "@/lib/utils";

interface SelectTokenProps {
  stepHandler: (value: "next" | "prev" | number) => void;
  setSelectedType: (type: "from" | "to") => void;
  fromToken: EvmToken | IcpToken | null;
  toToken: EvmToken | IcpToken | null;
  swapTokensHandler: () => void;
}

interface TokenCardProps {
  customOnClick: () => void
  token: EvmToken | IcpToken | null;
  label: string;
}

function TokenCard({ token, customOnClick, label }: TokenCardProps) {
  return (
    <Card
      className="max-h-[133px] md:max-h-[155px] cursor-pointer flex-col items-start justify-center gap-2"
      onClick={() => {
        customOnClick?.()
      }}>
      <p className="text-sm font-semibold">{label}</p>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className=" w-11 h-11 rounded-full">
            <AvatarImage src={token?.logo || "images/logo/placeholder.png"} />
            <AvatarFallback>{token?.symbol}</AvatarFallback>
          </Avatar>
          <Avatar className={cn(
            "absolute -right-1 -bottom-1 w-5 h-5 rounded-full",
            "shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]"
          )}>
            <AvatarImage src={getChainLogo(token?.chainId)} />
            <AvatarFallback>{token?.symbol}</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <p>{token?.symbol || "Select Token"}</p>
          <p className="text-sm">{getChainName(token?.chainId)}</p>
        </div>
      </div>
    </Card >
  )
}

export default function SelectTokenPage({
  stepHandler,
  setSelectedType,
  fromToken,
  toToken,
  swapTokensHandler,
}: SelectTokenProps) {

  const disabled = !fromToken || !toToken || (!fromToken.contractAddress === !toToken.contractAddress && fromToken?.chainId === toToken?.chainId);
  const buttonText = fromToken && toToken && fromToken.contractAddress === toToken.contractAddress && fromToken.chainId === toToken.chainId ? "Please select different tokens" : "Confirm";

  return (
    <Box className="md:max-w-[617px] md:max-h-[607px] md:pb-10">
      <div className="flex flex-col items-center justify-center gap-y-7 w-full max-w-[482px]">
        <h1
          className={cn(
            "text-white md:text-black md:dark:text-white mr-auto",
            "text-[26px] leading-7 md:text-[40px] md:leading-10 font-bold"
          )}>
          Bridge
        </h1>
        <div className="relative flex flex-col gap-y-4 w-full">
          <TokenCard
            token={fromToken}
            customOnClick={() => {
              setSelectedType("from");
              stepHandler("next");
            }}
            label="From"
          />
          <div
            className={cn(
              "absolute rounded-full inset-0 w-14 h-14 m-auto z-20 cursor-pointer group",
              "flex items-center justify-center",
              "bg-[#C0C0C0] text-black dark:bg-[#0B0B0B] dark:text-white",
              "border-2 border-white dark:border-white/30",
              "transition-transform duration-300 hover:rotate-180 hover:scale-110"
            )}
            onClick={swapTokensHandler}
          >
            <ArrowsUpDownIcon width={24} height={24} />
          </div>
          <TokenCard
            token={toToken}
            customOnClick={() => {
              setSelectedType("to");
              stepHandler("next");
            }}
            label="To"
          />
        </div>
      </div>
      <button
        className={cn(
          "bg-primary-buttons w-full h-12 rounded-2xl max-w-[482px] md:h-14",
          "font-normal text-white disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        disabled={disabled}
        onClick={() => stepHandler(3)}
      >
        {buttonText}
      </button>
    </Box>
  );
};