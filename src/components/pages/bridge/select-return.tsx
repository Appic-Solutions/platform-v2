"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";

import { ArrowDownIcon } from "@/components/icons";
import Image from "next/image";
import Box from "@/components/ui/box";
import Card from "@/components/ui/Card";
import ClockIcon from "@/components/icons/clock";
import FireIcon from "@/components/icons/fire";
import { EvmToken, IcpToken } from "@/blockchain_api/types/tokens";
import ChevronDownIcon from "@/components/icons/chevron-down";

// TODO: This is a temporary code for testing purposes only
const returns = [
  {
    id: 1,
    amount: 1.154844,
    via: "ICP",
    time: 10,
    usdPrice: 1.24,
    isBest: true,
    isActive: true,
  },
  {
    id: 2,
    amount: 1.154844,
    via: "ICP",
    time: 10,
    usdPrice: 1.24,
    isBest: false,
    isActive: true,
  },
  {
    id: 3,
    amount: 1.154844,
    via: "ICP",
    time: 10,
    usdPrice: 1.24,
    isBest: false,
    isActive: false,
  },
  {
    id: 4,
    amount: 1.154844,
    via: "ICP",
    time: 10,
    usdPrice: 1.24,
    isBest: false,
    isActive: true,
  },
];

const SelectOptionPage = ({
  fromToken,
  toToken,
}: {
  nextStepHandler: () => void;
  fromToken: EvmToken | IcpToken;
  toToken: EvmToken | IcpToken;
}) => {
  const [amount, setAmount] = useState("");
  const [usdPrice, setUsdPrice] = useState("0");
  const [expandedReturn, setExpandedReturn] = useState<number | null>(null);
  const [selectedReturn, setSelectedReturn] = useState<number | null>(null);

  const handleReturnSelect = (returnId: number) => {
    setSelectedReturn(returnId);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const usdPrice = Number(value) * (fromToken?.usdPrice ?? 0);
    setAmount(e.target.value);
    setUsdPrice(usdPrice.toFixed(2));
  };

  return (
    <Box
      className={cn(
        "flex flex-col overflow-y-scroll ",
        "lg:px-14 md:overflow-auto md:max-h-[607px] md:max-w-[617px]",
        "lg:max-w-[1060px] lg:h-[607px] lg:pb-10"
      )}
    >
      {/* BOX CONTENT */}
      <div
        className={cn(
          "flex flex-col gap-10 w-full flex-1",
          "lg:flex-row lg:overflow-hidden"
        )}
      >
        {/* SELECT TOKENS */}
        <div
          className={cn(
            "flex flex-col items-center w-full justify-between",
            "lg:max-w-[55%]"
          )}
        >
          {/* CARDS */}
          <div className="relative flex flex-col gap-y-4 w-full justify-between">
            {/* TITLE */}
            <div className={cn("flex flex-col gap-x-10 w-full", "md:flex-row")}>
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
                  src="images/logo5/white-logo.png"
                  alt="avatar"
                  width={38}
                  height={38}
                />
              </button>
            </div>
            <Card
              className={cn(
                "max-h-[133px] px-4",
                "md:max-h-[174px] md:px-10 md:py-20",
                "sm:px-6"
              )}
            >
              <p
                className={cn(
                  "absolute top-3",
                  "text-muted text-sm font-semibold"
                )}
              >
                From
              </p>
              <div className="flex items-center justify-between w-full">
                {/* left section */}
                <div className="flex items-center gap-x-3 max-w-[40%]">
                  <div className=" border-2 border-primary rounded-round p-3">
                    <div className="relative w-8 h-8 md:w-11 md:h-11">
                      <Image
                        src={fromToken?.logo ?? ""}
                        alt={fromToken?.name ?? ""}
                        className="object-contain"
                        fill
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl md:text-3xl">{fromToken?.symbol}</p>
                    <p className="text-sm md:text-base font-semibold text-muted">
                      {fromToken?.name}
                    </p>
                  </div>
                </div>
                {/* right section */}
                <div className="flex flex-col gap-y-2 items-end">
                  <p className="text-muted text-xs md:text-sm font-semibold">
                    Available: 0.334 ETH
                  </p>
                  <input
                    type="text"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => handleAmountChange(e)}
                    className={cn(
                      "border-[#1C68F8] dark:border-[#000000] rounded-m py-1 px-3 outline-none",
                      "bg-white/50 dark:bg-white/30 text-black dark:text-white",
                      "placeholder:text-black/50 dark:placeholder:text-white/50",
                      amount.length > 8
                        ? "text-sm md:text-sm w-3/4"
                        : "text-sm md:text-xl w-1/2",
                      "font-semibold"
                    )}
                  />
                  <div className="flex flex-col md:flex-row items-center gap-2">
                    <span className="text-muted text-xs md:text-sm">
                      {usdPrice} $
                    </span>
                    <span className="px-4 cursor-pointer py-1 text-xs md:text-sm text-black bg-gradient-to-r from-white to-white/35 rounded-ml">
                      max
                    </span>
                  </div>
                </div>
              </div>
            </Card>
            <div
              className={cn(
                "absolute rounded-round inset-0 top-20 md:top-14 w-14 h-14 m-auto z-20",
                "flex items-center justify-center",
                "bg-[#C0C0C0] text-black dark:bg-[#0B0B0B] dark:text-white",
                "border-2 border-white dark:border-white/30"
              )}
            >
              <ArrowDownIcon width={24} height={24} />
            </div>
            <Card
              className={cn(
                "max-h-[133px] px-4 sm:px-6",
                "md:max-h-[174px] md:px-10 md:py-20"
              )}
            >
              <p
                className={cn(
                  "absolute top-3",
                  "text-muted text-sm font-semibold"
                )}
              >
                To
              </p>
              <div className="flex items-center justify-between w-full">
                {/* left section */}
                <div className="flex items-center gap-x-3">
                  <div className=" border-2 border-primary rounded-round p-3">
                    <div className="relative w-8 h-8 md:w-11 md:h-11">
                      <Image
                        src={toToken?.logo ?? ""}
                        alt={toToken?.name ?? ""}
                        className="object-contain"
                        fill
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl md:text-3xl">{toToken?.symbol}</p>
                    <p className="text-sm md:text-base font-semibold text-muted">
                      {toToken?.name}
                    </p>
                  </div>
                </div>
                {/* right section */}
                <div className="flex flex-col gap-y-3 items-end">
                  <p className="text-xl md:text-2xl font-semibold">0.3245764</p>
                  <div className="flex flex-col gap-y-3 items-end">
                    <span className="text-muted text-xs md:text-sm">
                      {usdPrice} $
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          {/* SUBMIT BUTTON: DESKTOP */}
          <button
            className={cn(
              "bg-primary-buttons justify-self-end w-full h-14 rounded-ml max-w-[482px]",
              "text-highlight-standard font-normal text-white outline-none",
              "max-lg:hidden",
              // Add disabled styles
              (!selectedReturn || !Number(amount)) &&
                "opacity-50 cursor-not-allowed"
            )}
            onClick={(e) => e.preventDefault}
            disabled={!selectedReturn}
          >
            Select Return
          </button>
        </div>
        {/* RETURNS */}
        <div
          className={cn(
            "flex flex-col items-start w-full",
            "lg:max-w-[45%] md:pr-2"
          )}
        >
          <h1
            className={cn(
              "text-black dark:text-white mb-4",
              "text-[26px] leading-7 md:text-[40px] md:leading-10 font-bold"
            )}
          >
            Receive
          </h1>
          <div className="w-full flex lg:flex-col gap-4 h-full overflow-x-scroll lg:overflow-y-scroll pr-4 hide-scrollbar">
            {returns.map((item) => (
              <Card
                onClick={() => item.isActive && handleReturnSelect(item.id)}
                className={cn(
                  "py-4 px-4 flex-col gap-3 items-start justify-center",
                  "min-w-[300px]",
                  "sm:px-6",
                  "md:px-6",
                  item.isActive && "cursor-pointer",
                  item.isBest && "bg-highlighted-card",
                  selectedReturn === item.id && "border-2 border-blue-600",
                  "min-h-[165px]",
                  expandedReturn === item.id && "min-h-[360px]",
                  "transition-all duration-300 ease-in-out",
                  "md:rounded-xl"
                )}
                key={item.id}
              >
                {/* top section */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex-1">
                    {item.isBest && (
                      <p
                        className={cn(
                          "text-muted text-xs lg:text-sm font-thin",
                          "bg-primary-buttons text-white rounded-ml px-2 w-fit",
                          !item.isActive && "opacity-50"
                        )}
                      >
                        Best Return
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      item.isActive &&
                      setExpandedReturn(
                        expandedReturn === item.id ? null : item.id
                      )
                    }
                    className={cn(
                      "bg-gray-400 bg-opacity-20 rounded-m p-2 flex items-center ml-auto",
                      "transition-transform duration-300",
                      expandedReturn === item.id && "rotate-180",
                      !item.isActive && "opacity-30"
                    )}
                  >
                    <ChevronDownIcon width={10} height={10} />
                  </button>
                </div>
                {/* middle section */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-x-3">
                    <div className="border-2 border-primary rounded-round p-3">
                      <div
                        className={cn("relative w-6 h-6", "lg:w-10 lg:h-10")}
                      >
                        <Image
                          src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                          alt="btc"
                          className="object-contain"
                          fill
                        />
                      </div>
                    </div>
                    <p
                      className={cn(
                        "text-base lg:text-xl",
                        !item.isActive && "opacity-30"
                      )}
                    >
                      {item.amount}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-3 items-end">
                    <div
                      className={cn(
                        "px-4 py-1 rounded-ml flex items-center gap-x-1",
                        "bg-white",
                        !item.isActive && "opacity-30"
                      )}
                    >
                      <span
                        className={cn(
                          "text-xs lg:text-sm",
                          item.isBest ? "text-blue-600" : "text-black"
                        )}
                      >
                        via {item.via}
                      </span>
                      <Image
                        src="images/logo/icp-logo.png"
                        alt="logo"
                        width={15}
                        height={15}
                      />
                    </div>
                  </div>
                </div>
                {/* bottom section */}
                <div
                  className={cn(
                    "flex items-end w-full justify-end gap-x-4",
                    !item.isActive && "opacity-30"
                  )}
                >
                  <span className="flex items-center gap-x-1 w-max">
                    <p className="text-muted text-xs font-thin text-primary">
                      1.24
                    </p>
                    <FireIcon width={15} height={15} className="text-primary" />
                  </span>
                  <span className="flex items-center gap-x-1 w-max">
                    <p className="text-primary text-xs font-thin">10 Mins</p>
                    <ClockIcon
                      width={15}
                      height={15}
                      className="text-primary"
                    />
                  </span>
                </div>

                {/* Expanded content */}
                {expandedReturn === item.id && (
                  <div className="mt-4 w-full border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="space-y-4">
                      <p className="text-sm font-medium">Additional Details:</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted">Network Fee:</span>
                          <span>0.001 ETH</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted">Estimated Time:</span>
                          <span>{item.time} mins</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted">Route:</span>
                          <span>Direct Bridge</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted">Security:</span>
                          <span>High</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
      {/* submit button: mobile */}
      <button
        className={cn(
          "bg-primary-buttons w-full h-14 rounded-ml max-w-[482px] mt-7 py-4",
          "text-highlight-standard outline-none font-normal text-white",
          "lg:hidden",
          (!selectedReturn || !Number(amount)) &&
            "opacity-50 cursor-not-allowed"
        )}
        onClick={(e) => e.preventDefault()}
        disabled={!selectedReturn || !Number(amount)}
      >
        Select Return
      </button>
    </Box>
  );
};

export default SelectOptionPage;
