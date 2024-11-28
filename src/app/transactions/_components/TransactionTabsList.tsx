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
        "overflow-hidden w-[72px] h-fit bg-none",
        "flex flex-col gap-2 items-center justify-between",
        "absolute top-10 -left-24",
        "md:border-[5px] border-box-border rounded-[35px]",
        "*:z-20",
        // Box Background
        "backdrop-blur-md max-md:before:hidden before:content-[''] before:absolute before:inset-0",
        "before:bg-box-background before:bg-center before:bg-no-repeat"
      )}
    >
      {TRANSACTION_TAB_ITEMS.map((item) => (
        <TabsTrigger
          className="text-primary rounded-full w-[50px] h-[50px]"
          key={item.value}
          value={item.value}
          onClick={() => customOnClick(item.value)}
        >
          {item.Icon ? item.Icon : item.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default TransactionTabsList;
