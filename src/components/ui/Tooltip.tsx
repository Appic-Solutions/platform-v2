import { cn } from "@/lib/utils";
import React from "react";

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "absolute z-100 bottom-full text-nowrap w-fit h-fit text-xs lg:top-full md:text-sm px-4",
        "px-2 py-1 rounded-round text-white",
        "before:absolute before:inset-0 before:bg-black/50 before:backdrop-blur-sm before:-z-10 before:rounded-round",
        "group-hover:opacity-100 opacity-0 duration-200 transition-all",
        "after:content-[''] after:absolute after:-bottom-1 after:inset-x-0 after:mx-auto",
        "after:w-4 after:h-4 after:bg-black/50 after:backdrop-blur-sm after:rotate-45 after:block after:-z-20 after:rounded-s lg:after:-top-1",
        "left-1/2 -translate-x-1/2"
      )}
    >
      {children}
    </div>
  );
};

export default Tooltip;
