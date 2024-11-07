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
        "relative w-full max-w-lg px-12 py-8",
        "text-white text-hero-bold font-bold",
        "bg-background-dark rounded-2xl border-2 border-white border-opacity-25",
        "md:bg-input-fields md:max-w-full md:text-primary",
        className
      )}
      {...other}
    >
      {children}
    </div>
  );
};

export default Card;
