"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NAVBAR_ITEMS } from "@/lib/constants/layout";

const NavbarPage = () => {
  const path = usePathname();

  return (
    <ul
      className={cn(
        "fixed bottom-3.5 right-6 left-6 z-[99]",
        "border-[1.63px] border-white/30 text-white rounded-full",
        "bg-[radial-gradient(75.61%_136.07%_at_48.06%_0%,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0)_100%)]",
        "grid grid-cols-4 items-center gap-x-1 py-1.5 px-3 h-[63px]",
        "sm:h-[78px] sm:py-2 sm:px-4",
        "md:w-full md:max-w-[610px] md:mx-auto md:static md:col-span-8",
        "xl:max-w-[775px]"
      )}
    >
      {NAVBAR_ITEMS.map((item, idx) =>
        item.active ? (
          <li
            key={idx}
            className={cn(
              "w-full h-full flex items-center justify-center rounded-full",
              path === item.href &&
              "bg-[linear-gradient(81.4deg,#000000_-15.41%,#1D1D1D_113.98%)]",
              "md:hover:bg-[linear-gradient(81.4deg,rgba(0,0,0,0.2)_-15.41%,rgba(29,29,29,0.2)_113.98%)]",
              "*:flex *:items-center *:justify-center *:w-full *:h-full *:gap-x-1.5"
            )}
          >
            <Link href={item.href}>
              {item.Icon}
              <span className={cn("hidden md:flex", "lg:text-lg lg:font-bold")}>
                {item.label}
              </span>
            </Link>
          </li>
        ) : (
          <TooltipProvider key={idx}>
            <Tooltip>
              <TooltipTrigger
                key={idx}
                className={cn(
                  "w-full h-full flex items-center justify-center gap-x-1.5 rounded-full",
                  "hover:bg-[linear-gradient(81.4deg,rgba(0,0,0,0.2)_-15.41%,rgba(29,29,29,0.2)_113.98%)]"
                )}
              >
                {item.Icon}
                <span
                  className={cn("hidden md:flex", "lg:text-lg lg:font-bold")}
                >
                  {item.label}
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom">{item.tooltip}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      )}
    </ul>
  );
};

export default NavbarPage;
