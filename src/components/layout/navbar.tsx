"use client";
import { NAVBAR_ITEMS } from "@/constants/layout/navbar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavbarPage = () => {
  const path = usePathname();

  return (
    <nav className={cn(
      "border-2 border-white/30 py-0.5 px-4 rounded-full text-white",
      "bg-[radial-gradient(75.61%_136.07%_at_48.06%_0%,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0)_100%)]",
      "w-full lg:w-auto md:py-1.5"
    )}>
      <ul className="flex items-center justify-center gap-x-1.5 max-h-[60px] sm:justify-between">
        {NAVBAR_ITEMS.map((item, idx) =>
          item.active ? (
            <li key={idx}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center justify-center gap-x-1 rounded-full py-3 px-6 lg:px-8 xl:px-11 xl:py-4",
                  path === item.href && "bg-[linear-gradient(81.4deg,#000000_-15.41%,#1D1D1D_113.98%)]"
                )}>
                {item.Icon}
                <span className={cn("hidden md:flex", "text-lg font-bold")}>{item.label}</span>
              </Link>
            </li>
          ) : (
            <div
              key={idx}
              className={cn(
                "relative flex items-center justify-center gap-x-1 select-none",
                "rounded-full py-3 px-6 lg:px-8 xl:px-11 xl:py-4 group",
                "hover:bg-[linear-gradient(81.4deg,rgba(0,0,0,0.2)_-15.41%,rgba(29,29,29,0.2)_113.98%)]"
              )}
            >
              {item.Icon}
              <span className={cn("hidden md:flex", "text-lg font-bold")}>{item.label}</span>
            </div>
          )
        )}
      </ul>
    </nav>
  );
};

export default NavbarPage;
