import { Avatar } from "@/components/common/ui/avatar";
import { ArrowLeftIcon, PlusIcon, PoolIcon } from "@/components/icons";
import Box from "@/components/ui/box";
import { cn } from "@/lib/utils";

export default function YourPositionsPage() {
    return (
        <Box className={cn(
            "gap-y-9",
            "md:w-[611px]",
            "md:p-12",
            "text-white md:text-black md:dark:text-white"
        )}>
            {/* Header */}
            <div className={cn(
                "flex items-center justify-between gap-4",
                "w-full"
            )}>
                <h1 className="text-[27px] font-bold md:text-[30px]">
                    Your positions
                </h1>
                <button className={cn(
                    "flex items-center justify-center",
                    "text-[13px] font-medium md:text-[15px]",
                    "rounded-[10px] p-2.5",
                    "bg-primary-buttons",
                )}>
                    <PlusIcon className="w-[14px] h-[14px] md:w-[17px] md:h-[17px]" />
                    Create position
                </button>
            </div>

            {/* Main */}
            <div className={cn(
                "relative isolate",
                "flex flex-col gap-2.5 w-full",
                "py-5 px-6 md:p-8",
                "bg-gradient-to-b from-[#1D55BF]/30 to-[#000000]/30",
                "rounded-[20px] md:rounded-[30px]",
                "border border-[#4982EF]/40"
            )}>
                <div className="flex items-center gap-x-1.5">
                    <PoolIcon width={24} height={24} />
                    <p className="text-lg md:text-xl font-medium">
                        Welcome to your positions
                    </p>
                </div>
                <p className="text-sm md:text-[15px] text-white/75">
                    Connect your wallet to view your current positions.
                </p>
            </div>

            <div className={cn(
                "flex flex-col gap-3 w-full",
                "pt-3",
                "border-t border-white/20",
                "max-h-96 overflow-y-auto"
            )}>
                <div className={cn(
                    "bg-[#222222]",
                    "rounded-[21px]"
                )}>
                    <div className={cn(
                        "flex items-start justify-between",
                        "px-6 md:px-8 pb-5 pt-5 md:pt-6"
                    )}>
                        <div className="flex items-center gap-x-2.5">
                            <div className="flex relative">
                                <Avatar
                                    // src={token?.logo}
                                    src="/images/logo/icp-logo.svg"
                                    className="h-[34px] w-[34px] md:h-[46px] md:w-[46px]"
                                />
                                <Avatar
                                    // src={token?.logo}
                                    src="/images/logo/icp-logo.svg"
                                    className={cn(
                                        "h-[34px] w-[34px] md:h-[46px] md:w-[46px]",
                                        "-ml-4"
                                    )}
                                />
                                <Avatar
                                    // src={token?.logo}
                                    src="/images/logo/icp-logo.svg"
                                    className={cn(
                                        "h-[13px] w-[13px] md:h-[17px] md:w-[17px]",
                                        "absolute bottom-1 right-0"
                                    )}
                                />
                            </div>
                            <div className="flex flex-col gap-y-1">
                                <p className="text-lg md:text-2xl font-medium">
                                    USDC/ETH
                                </p>
                                <p className={cn(
                                    "flex items-center gap-x-1.5",
                                    "text-[#77EF4B] text-[13px]",
                                )}>
                                    <div className="rounded-full bg-[#77EF4B] w-[9px] h-[9px]" />
                                    In range
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-x-1">
                            <div className={cn(
                                "bg-white/10 rounded-[6px]",
                                "py-px px-1.5",
                                "text-white/60 text-xs leading-5"
                            )}>
                                V3
                            </div>
                            <div className={cn(
                                "bg-white/10 rounded-[6px]",
                                "py-px px-1.5",
                                "text-white/60 text-xs leading-5"
                            )}>
                                1%
                            </div>
                        </div>
                    </div>

                    <div className={cn(
                        "flex items-center justify-between gap-4",
                        "px-6 md:px-8 pt-6 md:pt-3.5 pb-3.5 md:pb-[18px]",
                        "border-t border-t-white/5"
                    )}>
                        <div className="flex flex-col">
                            <span className="text-sm md:text-lg font-semibold">
                                $2.01
                            </span>
                            <span className="text-[13px] text-white/50 font-semibold">
                                Position
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm md:text-lg font-semibold">
                                $0.01
                            </span>
                            <span className="text-[13px] text-white/50 font-semibold">
                                Fees
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm md:text-lg font-semibold">
                                $2.01
                            </span>
                            <span className="text-[13px] text-white/50 font-semibold">
                                APR
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[13px] text-white/50 font-semibold">
                                Full range
                            </span>
                            <span className="text-sm md:text-lg font-semibold">
                                $2.01
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </Box >
    )
}