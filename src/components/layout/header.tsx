import Image from "next/image";
import Link from "next/link";
import WalletPage from "./wallet";
import NavbarPage from "./navbar";

const HeaderPage = () => {
  return (
    <header className="order-last lg:order-first w-full flex items-center justify-between pt-5 pb-3.5 px-6 xl:px-12 z-10">
      <Link href="/" className="w-[165px] min-h-11 hidden lg:flex items-center justify-center">
        <Image src={"/images/logo/white-logo.png"} alt="logo" width={52} height={44} />
      </Link>
      <NavbarPage />
      <WalletPage />
    </header>
  );
};

export default HeaderPage;
