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
        "relative w-full max-w-lg px-4 py-8",
        "text-white text-hero-bold font-bold",
        "bg-background-dark rounded-2xl border-2 border-white",
        "md:px-12 md:max-w-full md:bg-background-main lg:text-primary",
        className
      )}
      {...other}
    >
      {children}
    </div>
  );
};

export default Card;
