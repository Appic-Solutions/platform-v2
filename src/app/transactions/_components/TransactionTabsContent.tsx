import { TabsContent } from "@/components/ui/tabs";
import BridgeTransactionCard from "./BridgeTransactionCard";
import { Transaction } from "../sampleTransactions";
import AdvancedTransactionCard from "./AdvancedTransactionCard";
import AutoInvestTransactionCard from "./AutoInvestTransactionCard";
import NoteRemoveIcon from "@/components/icons/note-remove";

interface TransactionTabsContentProps {
  value: "bridge" | "auto-invest" | "advanced" | "swap";
  transactions: Transaction[];
}

const TransactionTabsContent = ({
  value,
  transactions,
}: TransactionTabsContentProps) => {
  return (
    <TabsContent
      value={value}
      className="flex flex-col w-full h-full mt-0 overflow-y-visible md:overflow-y-scroll gap-y-4"
    >
      {transactions.length > 0 ? (
        transactions.map((transaction) => (
          <div key={transaction.id} className="w-full lg:px-2 md:max-w-[617px]">
            {value === "bridge" && <BridgeTransactionCard {...transaction} />}
            {value === "advanced" && (
              <AdvancedTransactionCard {...transaction} />
            )}
            {value === "auto-invest" && (
              <AutoInvestTransactionCard {...transaction} />
            )}
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center gap-2 justify-center text-center text-sm text-secondary h-full overflow-hidden">
          <NoteRemoveIcon width={80} height={80} />
          <p>There is no transaction</p>
        </div>
      )}
    </TabsContent>
  );
};

export default TransactionTabsContent;
