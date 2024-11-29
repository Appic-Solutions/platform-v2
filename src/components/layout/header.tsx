import Image from "next/image";
import Link from "next/link";
import WalletPage from "./wallet";
import NavbarPage from "./navbar";
import { cn } from "@/lib/utils";
import ThemeSwitch from "./theme-switch";

const HeaderPage = () => {
  return (
    <header className={cn(
      "flex items-center justify-between px-6 pt-3.5 w-full",
      "lg:grid lg:grid-cols-12 lg:place-items-center lg:justify-items-center",
      "lg:pt-8 xl:px-16"
    )}>

      {/* Logo  */}
      <Link href="/" className={cn(
        "relative min-h-11 min-w-12 flex items-center justify-center",
        "lg:col-span-2 lg:justify-self-start"
      )}>
        <Image src={"/images/logo/white-logo.png"} alt="logo" fill />
      </Link>

      {/* Navbar  */}
      <NavbarPage />

      {/* Wallet  */}
      <WalletPage />

      {/* Theme Switch  */}
      <ThemeSwitch />

    </header>
  );
};

export default HeaderPage;
