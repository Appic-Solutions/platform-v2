"use client"
import { CloseIcon, CopyIcon, FireIcon } from "@/common/components/icons";
import CheckIcon from "@/common/components/icons/check";
import Spinner from "@/common/components/ui/spinner";
import { cn } from "@/common/helpers/utils";
import { ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SAMPLE_TRANSACTIONS } from "../_constants";
import useLogic from "../_logic";

export default function BridgeContent() {
    const [open, setOpen] = useState(false);

    const { bridgePairs, evmAddress, icpIdentity, unAuthenticatedAgent } = useLogic()


    return (
        <div className={cn(
            "flex flex-col w-full py-4 px-8 rounded-[21px]",
            "bg-input-fields bg-center bg-no-repeat bg-cover shadow-appic-shadow"
        )}>
            {/* Date & Time */}
            <div className={cn(
                "flex items-center justify-between gap-x-4",
                "text-sm font-bold max-md:text-[#898989] md:text-[#333333] md:dark:text-[#898989]"
            )}>
                <p>January 11, 2024</p>
                <p>6:32am</p>
            </div>

            {/* Transaction Detailes */}
            <div className="flex flex-col gap-y-4 my-8">
                <div>
                    <div></div>
                </div>
                <div className={cn(
                    "flex items-center justify-between gap-x-4 text-sm font-bold",
                    "max-md:text-[#898989] md:text-[#333333] md:dark:text-[#898989]",
                    "*:flex *:flex-col *:justify-center *:flex-1",
                )}>
                    <div>
                        <p>ETH on Polygon</p>
                        <p className="max-md:text-white md:text-[#333333] md:dark:text-white leading-7 text-2xl">0.1241235</p>
                    </div>
                    <div className="items-center text-center">
                        Bridge Transaction In Progress
                    </div>
                    <div className="items-end">
                        <p>ETH on Polygon</p>
                        <p className="max-md:text-white md:text-[#333333] md:dark:text-white leading-7 text-2xl">0.1241235</p>
                    </div>
                </div>
            </div>
            {/* Status */}
            <div className={cn(
                "flex flex-col gap-y-6 duration-300",
                open ? "opacity-100 mb-8 translate-y-0" : "opacity-0 h-0 overflow-hidden -translate-y-2"
            )}>
                {/* Transaction ID */}
                <div className={cn(
                    "flex items-center gap-x-1",
                    "text-sm font-bold max-md:text-[#898989] md:text-[#6E6E6E] md:dark:text-[#898989]"
                )}>
                    {`Transaction ID: ${"QW4244532"}`}
                    <span className="rounded-md p-0.5 cursor-pointer hover:bg-white/10">
                        <CopyIcon width={16} height={16} />
                    </span>
                </div>
                {/* Transaction Steps */}
                <div className="flex flex-col gap-y-6">
                    {SAMPLE_TRANSACTIONS.map(({ title, status, time, href }, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "flex items-center justify-between gap-x-4 group",
                                "font-bold max-md:text-[#898989] md:text-[#6E6E6E] md:dark:text-[#898989]"
                            )}>
                            <div className="flex items-center gap-x-9">
                                <div className={cn(
                                    "relative flex items-center justify-center h-11 w-11 rounded-full",
                                    status === "Pending" ? "bg-blue-600/35" : status === "Completed" ? "bg-[#12B76A33] text-[#12b76a]" : "bg-[#FF0000]/35 text-[#FF0000]",
                                    idx < SAMPLE_TRANSACTIONS.length - 1 && "after:absolute after:w-[2px] after:h-[26px] after:bg-[#12B76A33] after:top-full"
                                )}>
                                    {status === "Pending" ? <Spinner /> : status === "Completed" ? <CheckIcon /> : <CloseIcon />}
                                </div>
                                <div className={href && "flex flex-col gap-y-5 h-12 overflow-y-hidden *:duration-300"}>
                                    <span className={href && "translate-y-3 group-hover:-translate-y-6"}>
                                        {title}
                                    </span>
                                    {href &&
                                        <div className="flex items-center gap-x-1 group-hover:-translate-y-8">
                                            Details
                                            <Link
                                                href={href}
                                                rel="noopener noreferrer"
                                                className="rounded-md p-0.5 cursor-pointer hover:bg-white/10"
                                            >
                                                <CopyIcon width={16} height={16} />
                                            </Link>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="text-sm">
                                {time}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Collape Trigger */}
            <div className={cn(
                "flex items-center justify-between gap-x-4",
                "*:flex *:items-center *:justify-center *:text-[13px] *:font-semibold",
                "max-md:text-[#898989] md:text-[#333333] md:dark:text-[#898989]"
            )}>
                <div className="gap-x-1 text-[#0F0F0F] bg-white/60 rounded-full py-0.5 px-2">
                    via Li.FI
                    <Image
                        src="/images/wallet.svg"
                        alt="Li.FI"
                        width={16}
                        height={16}
                        className="rounded-full min-h-4 min-w-4"
                    />
                </div>
                <div className="gap-x-2 cursor-pointer select-none" onClick={() => setOpen(!open)}>
                    {open ? "Hide Details" : "View Details"}
                    <ChevronDownIcon
                        width={20}
                        height={20}
                        className={cn(
                            "duration-300 ease-in-out",
                            open && "transform rotate-180"
                        )}
                    />
                </div>
                <div className="gap-x-1">
                    $1.24
                    <FireIcon width={20} height={20} />
                </div>
            </div>
        </div >
    )
}