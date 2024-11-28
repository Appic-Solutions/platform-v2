"use client";

import Box from "@/components/ui/box";
import { cn } from "@/lib/utils";
import { Tabs } from "@/components/ui/tabs";
import {
  TRANSACTION_TAB_ITEMS,
  TransactionTabItem,
} from "@/constants/layout/transactions";
import { sampleTransactions, Transaction } from "./sampleTransactions";
import { useEffect, useState } from "react";
import { ExpandLeftIcon } from "@/components/icons";
import Link from "next/link";
import TransactionTabsList from "./_components/TransactionTabsList";
import TransactionTabsContent from "./_components/TransactionTabsContent";

const TransactionsPage = () => {
  const [selectedTab, setSelectedTab] = useState<TransactionTabItem["value"]>(
    TRANSACTION_TAB_ITEMS[0].value
  );

  const [selectedTransactions, setSelectedTransactions] =
    useState<Transaction[]>(sampleTransactions);

  useEffect(() => {
    if (selectedTab === "bridge") {
      setSelectedTransactions(
        sampleTransactions.filter(
          (transaction) => transaction.type === "bridge"
        )
      );
    } else if (selectedTab === "auto-invest") {
      setSelectedTransactions(
        sampleTransactions.filter(
          (transaction) => transaction.type === "auto-invest"
        )
      );
    } else if (selectedTab === "advanced") {
      setSelectedTransactions(
        sampleTransactions.filter(
          (transaction) => transaction.type === "advanced"
        )
      );
    } else {
      setSelectedTransactions(sampleTransactions);
    }
  }, [selectedTab]);

  const tabTitleConverter = (tab: TransactionTabItem["value"]) => {
    if (tab === "bridge") return "Bridge";
    if (tab === "auto-invest") return "Auto Invest";
    if (tab === "advanced") return "Advanced";
    if (tab === "swap") return "Swap";
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden w-full h-fit px-6 m-auto",
        "flex justify-center items-center",
        "*:z-10",
        // Box Background
        "flex gap-4",
        "h-full w-full"
      )}
    >
      <Tabs
        defaultValue={selectedTab}
        className="w-full h-full flex justify-center items-start m-auto relative"
      >
        <div
          className={cn(
            "w-full h-full relative m-auto",
            "md:max-w-[617px] md:max-h-[750px]"
          )}
        >
          <TransactionTabsList
            customOnClick={(tab) =>
              setSelectedTab(tab as TransactionTabItem["value"])
            }
          />
          <Box
            className={cn(
              "flex flex-col z-20 w-full h-full m-0 gap-0",
              "overflow-y-scroll md:overflow-hidden",
              "lg:pb-8",
              "transition-[max-height] duration-300 ease-in-out justify-start"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center mb-8",
                "text-white md:text-black md:dark:text-white"
              )}
            >
              <Link
                href="/"
                className={cn(
                  "flex items-center justify-center gap-x-1",
                  "absolute left-4 font-semibold md:left-8"
                )}
              >
                <ExpandLeftIcon width={18} height={18} />
                Back
              </Link>
              <p className="text-xl md:text-3xl font-bold">
                {tabTitleConverter(selectedTab)}
              </p>
            </div>
            <div className="overflow-y-scroll w-full h-full">
              <TransactionTabsContent
                value={selectedTab}
                transactions={selectedTransactions}
              />
            </div>
          </Box>
        </div>
      </Tabs>
    </div>
  );
};

export default TransactionsPage;
