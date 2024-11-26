"use client";

import Box from "@/components/ui/box";
import BoxHeader from "@/components/ui/box-header";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { TransactionCard } from "./_components/TransactionCard";
import { sampleTransactions } from "./sampleTransactions";

const TransactionsPage = () => {
  const router = useRouter();
  const prevStepHandler = () => {
    router.back();
  };
  return (
    <Box
      className={cn(
        "flex flex-col gap-4",
        "lg:px-14 md:max-w-[617px] md:pb-10",
        "h-full overflow-y-scroll md:overflow-hidden",
        "lg:pb-8",
        "transition-[max-height] duration-300 ease-in-out",
        "md:max-h-[750px]"
      )}
    >
      <BoxHeader title="Transactions" onBack={prevStepHandler} />
      <div className="flex flex-col gap-y-4">
        {sampleTransactions.map((transaction) => (
          <TransactionCard key={transaction.id} {...transaction} />
        ))}
      </div>
    </Box>
  );
};

export default TransactionsPage;
