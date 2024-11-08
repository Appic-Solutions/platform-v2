"use client";
import { NAVBAR_ITEMS } from "@/constants/layout/navbar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HeaderPage = () => {
  const path = usePathname();

  return (
    <header
      className={cn(
        "order-last lg:order-first w-full",
        "flex items-center justify-between",
        "pt-5 pb-3.5 px-6 xl:px-12"
      )}>

      {/* Logo */}
      <Link
        href="/"
        className="min-w-[114px] min-h-11 hidden lg:flex items-center justify-center">
        <Image
          src={"/images/logo/white-logo.png"}
          alt="logo"
          width={52}
          height={44}
        />
      </Link>

      {/* Navbar Menu */}
      <nav
        className={cn(
          "border-2 border-white/30 py-0.5 px-4 rounded-round text-white",
          "bg-[radial-gradient(75.61%_136.07%_at_48.06%_0%,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0)_100%)]",
          "w-full lg:w-auto md:py-1.5"
        )}>
        <ul className="flex items-center justify-between gap-x-1.5 max-h-[60px]">
          {NAVBAR_ITEMS.map((item, idx) => (
            <li key={idx}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-x-1 rounded-round py-3 px-6 lg:px-8 xl:px-11 xl:py-4",
                  path === item.href &&
                  "bg-[linear-gradient(81.4deg,#000000_-15.41%,#1D1D1D_113.98%)]"
                )}
              >
                <item.Icon className="min-w-5 min-h-5" />
                <span
                  className={cn(
                    "hidden md:flex",
                    "text-lg font-bold"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Wallet */}
      <div className="bg-[#FAF7FD80]/50 rounded-round border border-[#ECE6F5] py-2 px-4 hidden lg:flex">
        User Wallet
      </div>
    </header>
  )
};

export default HeaderPage;
