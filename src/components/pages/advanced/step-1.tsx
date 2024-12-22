import { EvmToken, IcpToken } from "@/blockchain_api/types/tokens";
import { InfoCircleIcon } from "@/components/icons";
import RHFUploadFile from "@/components/rhf/rhf-upload-file";
import Box from "@/components/ui/box";
import { cn, getChainName } from "@/lib/utils";
import { useState } from "react";
import TokenListPage from "./chain-token-list/token-list";
import RHFInput from "@/components/rhf/rhf-input";
import Link from "next/link";
import HistoryIcon from "@/components/icons/history";

export default function Step1({
  stepHandler,
  selectedToken,
  setSelectedToken,
}: {
  stepHandler: (mode: "next" | "prev") => void;
  selectedToken: EvmToken | IcpToken | null;
  setSelectedToken: (token: EvmToken | IcpToken) => void;
}) {
  const [selectTokenBox, setSelectTokenBox] = useState(false);

  if (selectTokenBox) {
    return (
      <TokenListPage
        prevStepHandler={() => setSelectTokenBox(false)}
        setTokenHandler={setSelectedToken}
        selectedToken={selectedToken}
      />
    );
  } else {
    return (
      <Box
        className={cn(
          "gap-y-6 justify-normal h-full flex flex-col",
          "md:h-fit md:max-w-[617px] md:py-[55px] md:px-[65px]"
        )}
      >
        <div className="flex items-center justify-between w-full mb-5 text-white md:text-black md:dark:text-white">
          <div
            className={cn(
              "flex items-center self-start gap-3.5",
              "text-2xl font-bold",
              "md:text-4xl"
            )}
          >
            Create Twin Token
            <InfoCircleIcon className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <Link
            href="/transactions#advanced"
            className="flex items-center gap-x-2 text-sm"
          >
            <HistoryIcon className="w-5 h-5 md:w-6 md:h-6" />
            <span className="hidden xs:block">History</span>
          </Link>
        </div>
        <div className="w-full flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col gap-y-1 min-w-fit w-full cursor-pointer">
            <label className="text-white md:text-black dark:text-white">
              Select Token
            </label>
            <div
              onClick={() => setSelectTokenBox(true)}
              className={cn(
                "flex items-center w-full h-[42px] text-white md:text-black dark:text-white",
                "bg-white/50 dark:bg-white/60 rounded-lg",
                "text-[#0A0A0B] dark:text-[#333333]",
                "px-3.5 py-2.5"
              )}
            >
              {selectedToken
                ? `${getChainName(selectedToken.chainId)} (${selectedToken.symbol})`
                : "Select Token"}
            </div>
          </div>

          <div
            className={cn(
              "rounded-full min-w-10 min-h-10 m-auto z-20",
              "flex items-center justify-center",
              "bg-[#C0C0C0] text-black dark:bg-[#0B0B0B] dark:text-white",
              "border-2 border-white dark:border-white/30",
              "transition-transform duration-300"
            )}
          >
            OR
          </div>

          <RHFInput
            name="blockchainId"
            label="Contract Address"
            className="w-full"
            placeholder="Enter Contract Address"
          />
        </div>

        <RHFInput
          name="symbol"
          label="Symbol"
          className="w-full"
          placeholder="Enter Symbol"
        />

        <RHFUploadFile
          name="file"
          label="Upload File"
          maxSize={5}
          maxWidth={100}
          maxHeight={100}
        />
        <button
          type="button"
          onClick={() => stepHandler("next")}
          className="bg-primary-buttons w-full min-h-14 rounded-[16px] text-white mt-auto md:mt-0"
        >
          Continue
        </button>
      </Box>
    );
  }
}
