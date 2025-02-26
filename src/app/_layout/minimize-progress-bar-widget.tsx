import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";

type MinimizeProgressBarWidgetProps = {
    icon: ReactNode
}

export default function MinimizeProgressBarWidget({ icon }: MinimizeProgressBarWidgetProps) {
    return (
        <Link
            href={"/transactions-history/bridge"}
            className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full',
                'isolate fixed right-6 bottom-6 z-50',
                'before:absolute before:inset-0 before:rounded-full before:border-2 before:border-green-500 before:border-t-transparent before:animate-spin'
            )}>
            {icon}
        </Link>
    )

}