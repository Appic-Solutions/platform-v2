import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

interface BoxProps {
  children: ReactNode;
  className?: string;
}

const Box: FC<BoxProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "max-md:px-6 max-md:pt-5",
        "relative overflow-x-hidden overflow-y-auto",
        "min-w-fit w-full h-full backdrop-blur-md",
        "flex flex-col items-center justify-between",
        "md:bg-box-background md:bg-center md:bg-no-repeat",
        "md:border-[11px] md:border-box-border md:rounded-3xl md:m-auto",
        "md:max-h-[75vh]",
        "*:z-10",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Box;
