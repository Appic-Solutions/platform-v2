import { EvmToken, IcpToken } from "@/blockchain_api/types/tokens";
import { InfoCircleIcon } from "@/components/icons";
import RHFUploadFile from "@/components/rhf/rhf-upload-file";
import Box from "@/components/ui/box";
import { cn, getChainName } from "@/lib/utils";
import { useState } from "react";
import TokenListPage from "./chain-token-list/token-list";
import RHFInput from "@/components/rhf/rhf-input";

export default function Step1({
  stepHandler,
  selectedToken,
  setSelectedToken
}: {
  stepHandler: (mode: "next" | "prev") => void,
  selectedToken: EvmToken | IcpToken | null,
  setSelectedToken: (token: EvmToken | IcpToken) => void
}) {
  const [selectTokenBox, setSelectTokenBox] = useState(false)

  if (selectTokenBox) {
    return <TokenListPage
      prevStepHandler={() => setSelectTokenBox(false)}
      setTokenHandler={setSelectedToken}
      selectedToken={selectedToken}
    />
  } else {
    return (
      <Box className="gap-y-6 justify-normal md:max-w-[620px] md:p-10">
        <div
          className={cn(
            "flex items-center self-start gap-3.5",
            "text-white md:text-black dark:text-white text-2xl font-bold",
            "md:text-4xl"
          )}>
          Create Twin Token
          <InfoCircleIcon />
        </div>
        <div className="w-full flex flex-col items-center justify-between gap-6 md:grid md:grid-cols-7">

          <div className="flex flex-col gap-y-1 min-w-fit w-full cursor-pointer md:col-span-3">
            <label className="text-white md:text-black dark:text-white">Select Token</label>
            <div
              onClick={() => setSelectTokenBox(true)}
              className={cn(
                "flex items-center w-full h-[42px] text-white md:text-black dark:text-white",
                "bg-white/50 dark:bg-white/60 rounded-lg",
                "text-[#0A0A0B] dark:text-[#333333]",
                "px-3.5 py-2.5",
              )}
            >
              {selectedToken ? `${getChainName(selectedToken.chainId)} (${selectedToken.symbol})` : "Select Token"}
            </div>
          </div>

          <div
            className={cn(
              "rounded-full min-w-10 min-h-10 m-auto z-20",
              "flex items-center justify-center",
              "bg-[#C0C0C0] text-black dark:bg-[#0B0B0B] dark:text-white",
              "border-2 border-white dark:border-white/30",
              "transition-transform duration-300",
            )}>
            OR
          </div>

          <RHFInput
            name="blockchainId"
            label="Blockchain ID"
            className="w-full md:col-span-3"
            placeholder="Enter BlockChain ID"
          />
        </div>

        <RHFInput
          name="symbol"
          label="Select Symbol"
          className="w-full md:col-span-3"
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
          className="bg-primary-buttons w-full min-h-14 rounded-[16px] text-white"
        >
          Continue
        </button>
      </Box >
    )
  }
}
