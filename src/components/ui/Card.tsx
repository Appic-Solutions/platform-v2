import { cn } from "@/lib/utils";
import React from "react";

interface CardProps extends React.AllHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function card({ children, className, ...other }: CardProps) {
  return (
    <div
      className={cn(
        "relative w-full flex items-center gap-x-7 overflow-clip group",
        "px-9 py-11 rounded-xl shadow-md",
        "text-2xl leading-7 font-bold text-black dark:text-white",
        "bg-input-fields bg-center bg-no-repeat bg-cover",
        "backdrop-blur-[30.07605743408203px] duration-200 hover:bg-[#000000]/75",
        "md:px-10 md:py-14 md:rounded-[36px] md:text-[28px] md:leading-8",
        className
      )}
      {...other}
    >
      {children}
    </div>
  );
};