"use client";
import { NAVBAR_ITEMS } from "@/constants/layout/navbar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectWallet, useIdentityKit } from "@nfid/identitykit/react";
import { useAppKit } from "@reown/appkit/react";

const HeaderPage = () => {
  const path = usePathname();
  const {
    // isInitializing,
    // user,
    // isUserConnecting,
    // icpBalance,
    // signer,
    // identity,
    // delegationType,
    // accounts,
    // connect,
    // disconnect,
    // fetchIcpBalance,
  } = useIdentityKit();
  const {
    open,
    // close
  } = useAppKit();

  // console.log(sig);
  return (
    <header
      className={cn(
        "order-last lg:order-first w-full",
        "flex items-center justify-between",
        "pt-5 pb-3.5 px-6 xl:px-12 z-10"
      )}
    >
      {/* Logo */}
      <Link
        href="/"
        className="min-w-[114px] min-h-11 hidden lg:flex items-center justify-center"
      >
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
        )}
      >
        <ul className="flex items-center justify-center gap-x-1.5 max-h-[60px] sm:justify-between">
          {NAVBAR_ITEMS.map((item, idx) =>
            item.active ? (
              <li key={idx}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center gap-x-1 rounded-round py-3 px-6 lg:px-8 xl:px-11 xl:py-4",
                    path === item.href &&
                      "bg-[linear-gradient(81.4deg,#000000_-15.41%,#1D1D1D_113.98%)]"
                  )}
                >
                  <item.Icon
                    width={24}
                    height={24}
                    className="min-w-5 min-h-5"
                  />
                  <span className={cn("hidden md:flex", "text-lg font-bold")}>
                    {item.label}
                  </span>
                </Link>
              </li>
            ) : (
              <div
                key={idx}
                className={cn(
                  "relative flex items-center justify-center gap-x-1 select-none",
                  "rounded-round py-3 px-6 lg:px-8 xl:px-11 xl:py-4 group"
                )}
              >
                <item.Icon width={24} height={24} className="min-w-5 min-h-5" />
                <span className={cn("hidden md:flex", "text-lg font-bold")}>
                  {item.label}
                </span>

                <div
                  className={cn(
                    "absolute bottom-full w-24 h-fit text-xs lg:top-full md:text-sm md:w-28",
                    "px-2 py-1 rounded-round bg-primary-buttons",
                    "group-hover:opacity-100 opacity-0 duration-100",
                    "after:content-[''] after:absolute after:-bottom-1 after:inset-x-0 after:mx-auto",
                    "after:w-4 after:h-4 after:bg-primary-buttons after:rotate-45 after:-z-10 after:rounded-s lg:after:-top-1"
                  )}
                >
                  Coming Soon
                </div>
              </div>
            )
          )}
        </ul>
      </nav>

      {/* User Wallet */}
      <div
        className="bg-[#FAF7FD80]/50 rounded-round border border-[#ECE6F5] py-2 px-4 hidden lg:flex"
        onClick={() => {
          open();
        }}
      >
        User Wallet
        <ConnectWallet></ConnectWallet>
      </div>
      {/* <ConnectWalletDropdownMenuAddressItem value={""}></ConnectWalletDropdownMenuAddressItem> */}
    </header>
  );
};

export default HeaderPage;
