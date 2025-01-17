import { InfoCircleIcon } from "@/common/components/icons";
import Box from "@/common/components/ui/box";
import { cn, getChainName, getChainSymbol } from "@/common/helpers/utils";
import { useState } from "react";
import TokenListPage from "./chain-token-list/token-list";
import RHFInput from "@/common/components/rhf/rhf-input";
import Link from "next/link";
import HistoryIcon from "@/common/components/icons/history";
import { Step1Props } from "../_types";
import Spinner from "@/common/components/ui/spinner";

export default function Step1({ methods, chainIdWatch, isLoading }: Step1Props) {
  const [selectTokenBox, setSelectTokenBox] = useState(false);

  if (selectTokenBox) {
    return (
      <TokenListPage prevStepHandler={() => setSelectTokenBox(false)} />
    );
  } else {
    return (
      <Box className={cn(
        "gap-y-6 justify-normal h-full flex flex-col",
        "md:h-fit md:max-w-[617px] md:py-[55px] md:px-[65px]"
      )}>
        <div className="flex items-center justify-between w-full mb-5 text-white md:text-black md:dark:text-white">
          <div className="flex items-center self-start gap-3.5 text-2xl font-bold md:text-4xl">
            Create Twin Token
            <InfoCircleIcon className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <Link
            href="/transactions-history/advanced"
            className="flex items-center gap-x-2 text-sm"
          >
            <HistoryIcon className="w-5 h-5 md:w-6 md:h-6" />
            <span className="hidden xs:block">History</span>
          </Link>
        </div>
        <div className="w-full flex flex-col justify-between gap-y-1">
          <div className="flex flex-col gap-y-1 min-w-fit w-full cursor-pointer">
            <label className="text-white md:text-black dark:text-white">
              Select Chain
            </label>
            <div
              onClick={() => setSelectTokenBox(true)}
              className={cn(
                "flex items-center w-full h-[42px] text-white md:text-black dark:text-white",
                "bg-white/50 dark:bg-white/60 rounded-lg text-[#0A0A0B] dark:text-[#333333] px-3.5 py-2.5",
              )}>
              {chainIdWatch !== "" ? `${getChainName(chainIdWatch)} (${getChainSymbol(chainIdWatch)})` : "Select Chain"}
            </div>
          </div>
          {methods.formState.errors.chain_id && <span className="text-sm text-red-500">{methods.formState.errors.chain_id.message}</span>}
        </div>
        <RHFInput
          name="contract_address"
          label="contract address"
          className="w-full"
          placeholder="Enter Contract Address"
        />
        <RHFInput
          name="transfer_fee"
          label="Transfer Fee"
          className="w-full"
          placeholder="Enter Transfer Fee"
          type="number"
        />
        <button
          className="bg-primary-buttons w-full min-h-14 rounded-[16px] text-white mt-auto md:mt-0"
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : "Continue"}
        </button>
      </Box >
    );
  }
}
