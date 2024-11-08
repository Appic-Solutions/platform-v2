import { chains } from "@/blockchain_api/lists/chains"
import { Chain } from "@/blockchain_api/types/chains"
import ExpandLeftIcon from "@/components/icons/expand-left"
import Box from "@/components/ui/box"
import { cn } from "@/lib/utils"
import Image from "next/image"

const TokenListPage = ({
  prevStepHandler,
  selectedChain,
  selectChainHandler
}: {
  prevStepHandler: () => void
  selectedChain: Chain["chainId"]
  selectChainHandler: (value: Chain["chainId"]) => void
}) => {
  return (
    <Box className="justify-normal gap-y-9 md:max-w-[611px] md:max-h-[716px] md:pb-10">
      <div className={cn(
        "flex items-center justify-center",
        "text-black dark:text-white",
      )}>
        <button className={cn(
          "flex items-center justify-center gap-x-1",
          "absolute left-4 font-semibold"
        )}
          onClick={prevStepHandler}
        >
          <ExpandLeftIcon width={18} height={18} />
          Back
        </button>
        <p className="text-[26px] md:text-3xl font-bold">
          Bridge from
        </p>
      </div>

      <div className="grid grid-cols-5 gap-5 place-items-center w-full select-none">
        {chains.map((chain, idx) => (
          <div
            key={idx}
            onClick={() => selectChainHandler(chain.chainId)}
            className={cn(
              "rounded-round cursor-pointer w-12 h-12 md:w-14 md:h-14",
              selectedChain === chain.chainId && "border-4 border-[#7E35DC]"
            )}
          >
            <Image
              src={chain.logo}
              alt=""
              width={54}
              height={54}
            />
          </div>
        ))}
      </div>

      <hr className="bg-white dark:bg-[#636363]/25 w-full" />

    </Box >
  )
}

export default TokenListPage