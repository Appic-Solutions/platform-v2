import { EvmToken, IcpToken } from "@/blockchain_api/types/tokens";
import { ArrowsUpDownIcon } from "@/components/icons";
import Box from "@/components/ui/box";
import Card from "@/components/ui/Card";
import Tooltip from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";

const SelectTokenPage = ({
  stepHandler,
  setSelectedType,
  fromToken,
  toToken,
  swapTokensHandler,
}: {
  stepHandler: (value: "next" | "prev" | number) => void;
  setSelectedType: (type: "from" | "to") => void;
  fromToken: EvmToken | IcpToken | null;
  toToken: EvmToken | IcpToken | null;
  swapTokensHandler: () => void;
}) => {
  return (
    <Box className="md:max-w-[617px] md:max-h-[607px] md:pb-10">
      <div className="flex flex-col items-center justify-center gap-y-7 w-full max-w-[482px]">
        {/* Header Section */}
        <div className="flex items-center justify-between w-full px-4 md:px-0">
          <h1
            className={cn(
              "text-black dark:text-white",
              "text-[26px] leading-7 md:text-[40px] md:leading-10 font-bold"
            )}
          >
            Bridge
          </h1>
          {/* Mobile Avatar */}
          <button
            className={cn(
              "flex items-center justify-center md:hidden",
              "*:rounded-round"
            )}
          >
            <Image
              src="images/logo/white-logo.png"
              alt="avatar"
              width={38}
              height={38}
            />
          </button>
        </div>

        {/* Select Token Section */}
        <div className="relative flex flex-col gap-y-4 w-full">
          <Card
            className="max-h-[133px] md:max-h-[155px] cursor-pointer"
            onClick={() => {
              setSelectedType("from");
              stepHandler("next");
            }}
          >
            <div
              className={cn(
                "relative flex flex-col gap-y-2",
                "*:rounded-round"
              )}
            >
              <p className="text-sm font-semibold">From</p>
              <Image
                src={fromToken ? fromToken.logo : "images/logo/placeholder.png"}
                alt="token-logo"
                width={44}
                height={44}
              />
              <Image
                src={fromToken?.logo || "images/logo/placeholder.png"}
                alt="token-logo"
                width={20}
                height={20}
                className="w-5 h-5 absolute -right-1 -bottom-2 border-[2.5px] border-black dark:border-white"
              />
            </div>
            <p>{fromToken ? fromToken.name : "Select Token"}</p>
          </Card>
          <div
            className={cn(
              "absolute rounded-round inset-0 w-14 h-14 m-auto z-20 cursor-pointer group",
              "flex items-center justify-center",
              "bg-[#C0C0C0] text-black dark:bg-[#0B0B0B] dark:text-white",
              "border-2 border-white dark:border-white/30"
            )}
            onClick={swapTokensHandler}
          >
            <ArrowsUpDownIcon width={24} height={24} />
            <Tooltip>swap</Tooltip>
          </div>
          <Card
            className="max-h-[133px] md:max-h-[155px] cursor-pointer"
            onClick={() => {
              setSelectedType("to");
              stepHandler("next");
            }}
          >
            <div
              className={cn(
                "relative flex flex-col gap-y-2",
                "*:rounded-round"
              )}
            >
              <p className="text-sm font-semibold">To</p>
              <Image
                src={toToken ? toToken.logo : "images/logo/placeholder.png"}
                alt="token-logo"
                width={44}
                height={44}
              />
              <Image
                src={toToken?.logo || "images/logo/placeholder.png"}
                alt="token-logo"
                width={20}
                height={20}
                className="w-5 h-5 absolute -right-1 -bottom-2 border-[2.5px] border-black dark:border-white"
              />
            </div>
            <p>{toToken ? toToken.name : "Select Token"}</p>
          </Card>
        </div>
      </div>

      {/* Submit Button */}
      <button
        className={cn(
          "bg-primary-buttons w-full h-12 rounded-ml max-w-[482px] md:h-14",
          "font-normal text-white disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        disabled={
          !fromToken ||
          !toToken ||
          (!fromToken.contractAddress === !toToken.contractAddress &&
            fromToken?.chainId === toToken?.chainId)
        }
        onClick={() => stepHandler(3)}
      >
        {fromToken &&
          toToken &&
          fromToken?.contractAddress === toToken?.contractAddress &&
          fromToken?.chainId === toToken?.chainId
          ? "Please select different tokens"
          : "Confirm"}
      </button>
    </Box>
  );
};

export default SelectTokenPage;
