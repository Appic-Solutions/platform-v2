"use client"
import { CloseIcon, CopyIcon, FireIcon, LinkIcon, ParkOutlineBridgeIcon } from "@/common/components/icons";
import CheckIcon from "@/common/components/icons/check";
import Spinner from "@/common/components/ui/spinner";
import { cn, copyToClipboard, formatToSignificantFigures, getChainLogo, getChainName } from "@/common/helpers/utils";
import { ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useLogic from "../_logic";
import { Avatar, AvatarFallback, AvatarImage } from "@/common/components/ui/avatar";
import { useGetAllBridgeHistory } from "../_api";
import { HttpAgent } from "@dfinity/agent";

export default function BridgeContent() {
    const [itemId, setItemId] = useState<null | number>(null);
    const { bridgePairs, evmAddress, icpIdentity, unAuthenticatedAgent } = useLogic()

    const { data, isLoading, isError } = useGetAllBridgeHistory({
        unauthenticated_agent: unAuthenticatedAgent as HttpAgent,
        bridge_tokens: bridgePairs,
        evm_wallet_address: evmAddress,
        principal_id: icpIdentity?.getPrincipal(),
    });

    const expandHandler = (id: number) => {
        if (itemId === id) {
            setItemId(null)
        } else {
            setItemId(id)
        }
    }

    if (isError) {
        return (
            <div className={cn(
                "flex items-center justify-center h-full text-xl",
                "text-center max-w-[490px] mx-auto px-6 text-white",
            )}>
                Failed To Get Transaction History
            </div>
        )
    } else if (isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <Spinner />
            </div>
        )
    } else {
        return (
            data?.result.map((item, idx) => (
                <div
                    key={idx}
                    className={cn(
                        "flex flex-col w-full bg-input-fields bg-center bg-no-repeat bg-cover shadow-md",
                        "rounded-2xl p-5 backdrop-blur-[30px] duration-200 hover:bg-black/75",
                        "md:px-10 md:rounded-[36px]",
                    )}>
                    {/* Date & Time */}
                    <div className={cn(
                        "flex items-center justify-between gap-x-4",
                        "text-sm font-bold max-md:text-[#898989] md:text-[#333333] md:dark:text-[#898989]"
                    )}>
                        <p>{item.date}</p>
                        <p>{item.time}</p>
                    </div>
                    <div className="flex items-center justify-between w-full my-5 *:relative">
                        <div>
                            <Avatar className={cn(
                                "w-[58px] h-[58px] rounded-full",
                                "md:w-[72px] md:h-[72px]"
                            )}>
                                <AvatarImage src={item.from_token.logo || "images/logo/placeholder.png"} />
                                <AvatarFallback>{item.from_token.symbol}</AvatarFallback>
                            </Avatar>
                            <Avatar className={cn(
                                "absolute -right-1 -bottom-1 w-6 h-6 rounded-full",
                                "shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]"
                            )}>
                                <AvatarImage src={getChainLogo(item.from_token.chainId)} />
                                <AvatarFallback>{item.from_token.symbol}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex items-center justify-center w-full">
                            <div className={cn(
                                "flex-1 border-t-[3px] border-black",
                                item.status === "Failed" ? "border-red-500" : "border-green-500",
                            )} />
                            <div className={cn(
                                "rounded-full p-3 z-10 relative",
                                "bg-[linear-gradient(81.4deg,_#000000_-15.41%,_#1D1D1D_113.98%)]",
                                item.status === "Failed" ? "border-2 border-solid border-red-500" : "before:absolute before:inset-0 before:rounded-full before:border-2 before:border-green-500",
                                item.status === "Pending" && "before:border-t-transparent before:animate-spin"
                            )}>
                                <ParkOutlineBridgeIcon className="w-5 md:w-6 h-5 md:h-6 text-white" />
                            </div>
                            <div className={cn(
                                "flex-1 border-t-[3px] border-black",
                                item.status === "Failed" && "border-red-500",
                                item.status === "Pending" && "border-dashed",
                                item.status === "Successful" && "border-green-500",
                            )} />
                        </div>
                        <div>
                            <Avatar className={cn(
                                "w-[58px] h-[58px] rounded-full",
                                "md:w-[72px] md:h-[72px]"
                            )}>
                                <AvatarImage src={item.to_token.logo || "images/logo/placeholder.png"} />
                                <AvatarFallback>{item.to_token.symbol}</AvatarFallback>
                            </Avatar>
                            <Avatar className={cn(
                                "absolute -right-1 -bottom-1 w-6 h-6 rounded-full",
                                "shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]"
                            )}>
                                <AvatarImage src={getChainLogo(item.to_token.chainId)} />
                                <AvatarFallback>{item.to_token.symbol}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                    {/* Transaction Detailes */}
                    <div className="flex flex-col gap-y-4 mb-5">
                        <div>
                            <div></div>
                        </div>
                        <div className={cn(
                            "flex items-center justify-between gap-x-4 text-xs font-bold",
                            "max-md:text-[#898989] md:text-[#333333] md:dark:text-[#898989] md:text-sm",
                            "*:flex *:flex-col *:justify-center *:flex-1",
                        )}>
                            <div>
                                <p>{item.from_token.symbol} on {getChainName(item.from_token.chainId)}</p>
                                <p className="max-md:text-white md:text-[#333333] md:dark:text-white leading-7 text-2xl">
                                    {item.human_readable_base_value ? formatToSignificantFigures(item.human_readable_base_value) : "Calculating"}
                                </p>
                            </div>
                            <div className="items-center text-center max-md:hidden">
                                {
                                    item.status === "Successful" ? "Successful Bridge Transaction" :
                                        item.status === "Pending" ? "Bridge Transaction In Progress" :
                                            "Bridge Transaction Failed"
                                }
                            </div>
                            <div className="items-end">
                                <p>{item.to_token.symbol} on {getChainName(item.to_token.chainId)}</p>
                                <p className="max-md:text-white md:text-[#333333] md:dark:text-white leading-7 text-2xl">
                                    {item.human_readable_final_value ? formatToSignificantFigures(item.human_readable_final_value) : "Calculating"}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Status */}
                    <div className={cn(
                        "flex flex-col gap-y-6 duration-300",
                        itemId === idx ? "opacity-100 mb-8 translate-y-0" : "opacity-0 h-0 overflow-hidden -translate-y-2"
                    )}>
                        {/* Transaction ID */}
                        <div className={cn(
                            "flex items-center gap-x-1",
                            "text-sm font-bold max-md:text-[#898989] md:text-[#6E6E6E] md:dark:text-[#898989]"
                        )}>
                            {`Transaction ID: ${item.id.slice(0, 10)}`}
                            <span className="rounded-md p-0.5 cursor-pointer hover:bg-white/10">
                                <CopyIcon
                                    width={16}
                                    height={16}
                                    onClick={() => copyToClipboard(item.id)}
                                />
                            </span>
                        </div>
                        {/* Transaction Steps */}
                        <div className="flex flex-col gap-y-6">
                            {item.bridge_steps.map((step, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "flex items-center justify-between gap-x-4 group",
                                        "font-bold max-md:text-[#898989] md:text-[#6E6E6E] md:dark:text-[#898989]"
                                    )}>
                                    <div className="flex items-center gap-x-9">
                                        <div className={cn(
                                            "relative flex items-center justify-center h-11 w-11 rounded-full",
                                            step.status === "Pending" ? "bg-blue-600/35" : step.status === "Successful" ? "bg-[#12B76A33] text-[#12b76a]" : "bg-[#FF0000]/35 text-[#FF0000]",
                                            idx < item.bridge_steps.length - 1 && "after:absolute after:w-[2px] after:h-[26px] after:bg-[#12B76A33] after:top-full"
                                        )}>
                                            {step.status === "Pending" ? <Spinner /> : step.status === "Successful" ? <CheckIcon /> : <CloseIcon />}
                                        </div>
                                        <div className={step.link && "flex flex-col gap-y-5 h-12 overflow-y-hidden *:duration-300"}>
                                            <span className={step.link && "translate-y-3 group-hover:-translate-y-6"}>
                                                {step.message}
                                            </span>
                                            {step.link &&
                                                <div className="flex items-center gap-x-1 group-hover:-translate-y-8">
                                                    Details
                                                    <Link
                                                        href={step.link}
                                                        rel="noopener noreferrer"
                                                        className="rounded-md p-0.5 cursor-pointer hover:bg-white/10"
                                                    >
                                                        <LinkIcon width={16} height={16} />
                                                    </Link>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Collape Trigger */}
                    <div className={cn(
                        "flex items-center justify-between gap-x-4 text-xs",
                        "*:flex *:items-center *:justify-center *:font-semibold",
                        "max-md:text-[#898989] md:text-[#333333] md:dark:text-[#898989]"
                    )}>
                        <div className="gap-x-1 text-[#0F0F0F] bg-white/60 rounded-full py-1 px-2">
                            via {item.operator}
                            <Image
                                src="/images/logo/icp-logo.png"
                                alt="Li.FI"
                                width={16}
                                height={16}
                                className="rounded-full min-h-4 min-w-4"
                            />
                        </div>
                        <div className="gap-x-2 cursor-pointer select-none text-sm" onClick={() => expandHandler(idx)}>
                            {itemId === idx ? "Hide Details" : "View Details"}
                            <ChevronDownIcon
                                width={20}
                                height={20}
                                className={cn(
                                    "duration-300 ease-in-out",
                                    itemId === idx && "transform rotate-180"
                                )}
                            />
                        </div>
                        <div className="gap-x-1 text-white">
                            {formatToSignificantFigures(item.human_readable_fee)} {item.fee_token_symbol}
                            <FireIcon width={20} height={20} />
                        </div>
                    </div>
                </div >
            ))
        )
    }
}