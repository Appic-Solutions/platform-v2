import { EvmToken, IcpToken } from "@/blockchain_api/types/tokens";
import { ArrowLongLeftIcon, ExpandLeftIcon } from "@/common/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/common/components/ui/avatar";
import Box from "@/common/components/ui/box";
import { cn, getChainLogo, getChainName } from "@/common/helpers/utils";

export default function Step2({
  stepHandler,
}: {
  stepHandler: (mode: "next" | "prev") => void;
}) {
  const data = [
    {
      title: "Original Token Name:",
      value: selectedToken?.name,
    },
    {
      title: "Original Token Symbol:",
      value: selectedToken?.symbol,
    },
    {
      title: "Blockchain:",
      value: getChainName(selectedToken?.chainId),
    },
    {
      title: "Twin Token Name:",
      value: "Acme Twin",
    },
    {
      title: "Twin Token Symbol:",
      value: "ACMT",
    },
    {
      title: "Twin Token Fee:",
      value: "0.01 ICP",
    },
  ];

  return (
    <Box className="gap-y-5 justify-between h-full md:h-auto md:max-w-[612px] md:gap-y-16 md:p-10">
      <div className="flex flex-col gap-y-8 w-full">
        <div
          className={cn(
            "flex items-center justify-center relative",
            "text-white md:text-black dark:text-white text-2xl font-bold",
            "md:text-4xl"
          )}
        >
          Token Summary
          <button
            className="hidden md:flex absolute left-0 text-base items-center gap-x-1"
            type="button"
            onClick={() => stepHandler("prev")}
          >
            <ExpandLeftIcon width={18} height={18} />
            Back
          </button>
        </div>

        <div className="flex items-center self-start gap-4">
          <div className="relative">
            <Avatar className=" w-12 h-12 rounded-full">
              <AvatarImage src={getChainLogo(selectedToken?.chainId)} />
              <AvatarFallback>
                {getChainName(selectedToken?.chainId)}
              </AvatarFallback>
            </Avatar>
            <Avatar
              className={cn(
                "absolute -right-1 -bottom-1 w-5 h-5 rounded-full",
                "shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]"
              )}
            >
              <AvatarImage src={getChainLogo(selectedToken?.chainId)} />
              <AvatarFallback>
                {getChainName(selectedToken?.chainId)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-white md:text-black dark:text-white">
            <p className="text-2xl">{selectedToken?.name}</p>
            <p className="text-lg">{getChainName(selectedToken?.chainId)}</p>
          </div>
        </div>

        <div className="rounded-[16px] bg-white/10 p-6 text-white flex flex-col gap-y-3 md:p-8 md:text-black dark:text-white">
          {data.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center justify-between gap-x-1",
                idx === 2 && "border-b border-white/15 pb-4 mb-1"
              )}
            >
              <p className="font-medium">{item.title}</p>
              <p className={cn(idx === 5 && "text-[#27AE60]")}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-y-6 w-full">
        <button
          className="flex items-center justify-center gap-x-1.5 text-white md:hidden"
          type="button"
          onClick={() => stepHandler("prev")}
        >
          <ArrowLongLeftIcon />
          Back to Token
        </button>
        <button
          className="bg-primary-buttons w-full min-h-14 rounded-[16px] text-white"
          type="submit"
        >
          Continue
        </button>
      </div>
    </Box>
  );
}
