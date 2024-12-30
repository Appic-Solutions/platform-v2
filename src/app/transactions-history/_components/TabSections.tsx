"use client"
import { Tabs, TabsList, TabsTrigger } from "@/common/components/ui/tabs";
import { PAGE_PARAMS_DATA } from "../_constants";
import { cn } from "@/common/helpers/utils";
import { useRouter } from "next/navigation";

export default function TabSection({ defaultValue }: { defaultValue: string }) {
    const router = useRouter()

    return (
        <Tabs
            defaultValue={defaultValue}
            onValueChange={(value) => router.push(`/transactions-history/${value}`)}>
            <TabsList className={cn(
                "flex items-center justify-center gap-1.5 px-4 py-2.5",
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
        </Tabs>
    )
}