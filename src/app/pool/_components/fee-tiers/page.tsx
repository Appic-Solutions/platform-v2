import { Avatar } from "@/components/common/ui/avatar";
import { ArrowLeftIcon, LockIcon } from "@/components/icons";
import Box from "@/components/ui/box";
import { cn } from "@/lib/utils";

export default function FeeTiersPage() {

    const selected = false

    return (
        <Box className={cn(
            "gap-y-9",
            "md:w-[611px]",
            "md:p-12",
            "text-white md:text-black md:dark:text-white"
        )}>
            {/* Header */}
            <div className={cn(
                "relative isolate",
                "flex items-center justify-between gap-4",
                "w-full"
            )}>
                <ArrowLeftIcon className="z-10 cursor-pointer" />
                <h1 className={cn(
                    "text-[27px] font-bold md:text-[30px]",
                    "absolute inset-x-0 text-center"
                )}>
                    Fee tiers
                </h1>
            </div>

            {/* Main */}
            <div className={cn(
                "overflow-y-auto",
                "max-h-[550px]",
                "w-full *:w-full",
                "flex flex-col gap-3"
            )}>
                <div className={cn(
                    "relative isolate",
                    selected ? "bg-[linear-gradient(to_bottom,#242424_35%,#3C3C3C_100%)]" : "bg-[linear-gradient(to_bottom,#242424_0%,#2121214D_100%)]",
                    "py-6 px-8",
                    "rounded-[28px] backdrop-blur-[30px]",
                    "border-2 border-[#4C4C4C]/30"
                )}>
                    <div className="flex items-center justify-between gap-5">
                        <div className="text-xl md:text-2xl font-semibold">
                            0.01%
                        </div>
                        {selected && (
                            <>
                                <div className="flex-1">
                                    <span className={cn(
                                        "rounded-[16px] bg-[#2060D5]/45",
                                        "p-1 md:px-2",
                                        "text-[#A7C6FF] text-[13px] md:text-sm"
                                    )}>
                                        HighestTVL
                                    </span>
                                </div>
                                <LockIcon width={24} height={24} />
                            </>
                        )}
                    </div>
                    <div className={cn(
                        "mb-6 md:mb-8",
                        "text-[17px] md:text-xl text-[#898989]"
                    )}>
                        Best for very stable pairs.
                    </div>
                    <div className={cn(
                        "flex items-center justify-between gap-4",
                        "text-white md:text-xl",
                    )}>
                        <span>
                            $1.5test
                        </span>
                        <span>
                            0% select
                        </span>
                    </div>
                </div>               
            </div>
        </Box>
    )
}