import { cn } from "@/lib/utils";
import { FC, ReactNode, RefObject } from "react";

interface BoxProps {
  children: ReactNode;
  className?: string;
  ref?: RefObject<HTMLDivElement>;
}

const Box: FC<BoxProps> = ({ children, className, ref }) => {
  return (
    <div
      ref={ref}
      className={cn(
        "max-md:px-6 max-md:pt-5",
        "relative overflow-x-hidden overflow-y-auto",
        "w-full h-fit backdrop-blur-md",
        "flex flex-col items-center justify-between",
        "md:bg-box-background md:bg-center md:bg-no-repeat",
        "md:ring-8 md:ring-box-border md:rounded-3xl md:m-auto",
        "md:min-w-fit md:max-h-[80vh] md:min-h-fit",
        "*:z-10",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Box;
