import { cn } from "@/lib/utils";
import React, { AllHTMLAttributes, FC, ReactNode } from "react";

type FeatureBoxProps = {
  children: ReactNode;
  className?: string;
} & AllHTMLAttributes<HTMLDivElement>;

const FeatureBox: FC<FeatureBoxProps> = ({ children, className, ...other }) => {
  return (
    <div
      className={cn(
        "w-full bg-opacity-0 rounded-[28px] backdrop-blur-sm p-2 h-full",
        "md:bg-white md:w-[38rem] md:bg-opacity-10",
        className
      )}
      {...other}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-4",
          "h-full w-full md:py-8 rounded-lg",
          "md:px-16 md:bg-input-fields md:dark:bg-background-dark"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default FeatureBox;
