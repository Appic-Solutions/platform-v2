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
        "relative overflow-y-hidden md:overflow-y-hidden w-full h-full px-6 m-auto",
        "flex justify-center items-center",
        "*:z-10",
        "flex gap-4",
        "pb-36 md:pb-0"
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
          {/* mobile title */}
          <div
            className={cn(
              "flex items-center justify-center my-6",
              "text-white md:text-black md:dark:text-white md:hidden"
            )}
          >
            <Link
              href="/"
              className={cn(
                "flex items-center justify-center gap-x-1",
                "absolute left-0 font-semibold md:left-8"
              )}
            >
              <ExpandLeftIcon width={18} height={18} />
              Back
            </Link>
            <p className="text-xl md:text-3xl font-bold">
              {tabTitleConverter(selectedTab)}
            </p>
          </div>
          <TransactionTabsList
            customOnClick={(tab) =>
              setSelectedTab(tab as TransactionTabItem["value"])
            }
          />
          <Box
            className={cn(
              "flex flex-col gap-4 h-full md:min-h-[10vh] justify-start max-md:px-0",
              "md:px-[35px] md:py-[30px] md:max-w-[617px]",
              "overflow-hidden",
              "transition-[max-height] duration-300 ease-in-out"
            )}
          >
            {/* desktop title */}
            <div
              className={cn(
                "items-center justify-center mb-8 hidden",
                "text-white md:text-black md:dark:text-white md:flex"
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
            <div className="w-full overflow-y-scroll">
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
