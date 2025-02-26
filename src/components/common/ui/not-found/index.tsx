import { cn } from "@/lib/utils";
import Image from "next/image";
import { AllHTMLAttributes } from "react";

export interface NotFoundProps extends AllHTMLAttributes<HTMLDivElement> {
    title: string;
    desc?: string;
}

export default function NotFound({ title, desc, className, ...props }: NotFoundProps) {
    return (
        <section
            className={cn(
                "flex flex-col items-center justify-center gap-y-5 pt-20",
                "text-white md:text-black md:dark:text-white",
                className
            )}
            {...props}
        >
            <Image
                src="/images/empty.png"
                alt=""
                width={100}
                height={100}
            />

            <div className="text-lg lg:text-4xl">Not Found!</div>

            {/* Title */}
            <h3 className="text-lg lg:text-xl">{title}</h3>

            {/* Description */}
            {desc && <p className="text-sm">{desc}</p>}
        </section>
    )
}