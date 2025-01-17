"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/common/components/ui/tabs";
import { PAGE_PARAMS_DATA } from "../_constants";
import { cn } from "@/common/helpers/utils";
import { useRouter } from "next/navigation";
import { useSharedStore } from "@/common/state/store";
import Image from "next/image";

export default function TabSection({ defaultValue }: { defaultValue: string }) {
    const router = useRouter()
    const { icpBalance, evmBalance } = useSharedStore();

    return (
        <Tabs
            defaultValue={defaultValue}
            onValueChange={(value) => router.push(`/transactions-history/${value}`)}
            className="h-full w-full overflow-y-auto max-md:pt-4 max-md:pb-10"
        >
            <TabsList className={cn(
                "flex items-center justify-center gap-1.5 px-4 py-2.5 max-w-fit mx-auto",
                "bg-box-background rounded-full text-white ring-[5px] ring-box-border",
                "sm:px-6 sm:py-3.5",
                "md:flex-col md:py-5 md:px-2 md:absolute md:-left-24 md:top-24"
            )}>
                {PAGE_PARAMS_DATA.map((item, idx) => (
                    <TabsTrigger key={idx} value={item.name}>
                        {item.icon}
                    </TabsTrigger>
                ))}
            </TabsList>

            {!icpBalance && !evmBalance ? (
                <div className={cn(
                    "flex flex-col items-center justify-center h-full gap-y-5",
                    "text-center max-w-[490px] mx-auto px-6 text-white",
                )}>
                    <Image
                        src="/images/wallet.svg"
                        alt="wallet-Image"
                        width={210}
                        height={210}
                        quality={100}
                    />
                    <p className="text-xl">
                        Connect your wallet to access history
                    </p>
                    <p className="text-sm leading-6 mb-24">
                        To access the full history of your wallet transactions, please connect your wallet. It’s quick, secure, and easy.
                    </p>
                </div>
            ) : (PAGE_PARAMS_DATA.map((item, idx) => (
                <TabsContent key={idx} value={item.name}>
                    <div className="w-full flex flex-col gap-y-4 max-md:p-4">
                        <item.component />
                    </div>
                </TabsContent>
            )))}

        </Tabs>
    )
}