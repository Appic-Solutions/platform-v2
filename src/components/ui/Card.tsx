import { cn } from "@/lib/utils";
import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "text-white lg:text-primary text-hero-bold font-bold",
        "px-4 md:px-12 py-8 w-full bg-background-dark md:bg-background-main max-w-lg md:max-w-full",
        "rounded-2xl border-2 border-white relative",
        { className }
      )}
    >
      {children}
    </div>
  );
};

export default Card;
