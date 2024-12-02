import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TRANSACTION_TAB_ITEMS } from "@/constants/layout/transactions";
import { cn } from "@/lib/utils";

const TransactionTabsList = ({
  customOnClick,
}: {
  customOnClick: (tab: string) => void;
}) => {
  return (
    <TabsList
      className={cn(
        "overflow-hidden w-fit h-fit border-none mb-2",
        "flex md:flex-col gap-2 items-center justify-between",
        "md:absolute md:top-10 md:-left-24",
        "ring-4 ring-box-border !rounded-[35px]",
        "*:z-20",
        // Box Background
        "backdrop-blur-md max-md:before:hidden",
        "!bg-box-background bg-center bg-no-repeat"
      )}
    >
      {TRANSACTION_TAB_ITEMS.map((item) => (
        <TabsTrigger
          className="text-primary rounded-full w-[50px] h-[50px]"
          key={item.value}
          value={item.value}
          onClick={() => customOnClick(item.value)}
        >
          {item.Icon}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default TransactionTabsList;
