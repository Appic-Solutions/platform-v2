import { cn } from "@/lib/utils";
import React, { AllHTMLAttributes, FC } from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
} & AllHTMLAttributes<HTMLDivElement>;

const Card: FC<CardProps> = ({ children, className, ...other }) => {
  return (
    <div
      className={cn(
        "relative w-full flex items-center gap-x-7 overflow-hidden",
        "px-9 py-11 rounded-xl border-2 border-box-border",
        "text-2xl leading-7 font-bold",
        "text-black dark:text-white",
        "bg-input-fields bg-center bg-no-repeat",
        "backdrop-blur-[30.07605743408203px]",
        "md:px-10 md:py-14 md:rounded-2xl md:text-[28px] md:leading-8",
        className
      )}
      {...other}
    >
      {children}
    </div>
  );
};

export default Card;
