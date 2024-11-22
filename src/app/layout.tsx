import "../style/globals.css";
import HeaderPage from "@/components/layout/header";
import ShapesPage from "@/components/layout/shapes";
import "@nfid/identitykit/react/styles.css";
import { WalletWrapper } from "@/components/wallet_wrappers/wrapper";
import ThemeSwitch from "@/components/layout/theme-switch";
import Link from "next/link";
import WalletPage from "@/components/layout/wallet";
import Image from "next/image";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className="dark bg-[#060607] bg-no-repeat h-screen">
      <body className="relative max-w-[1920px] mx-auto w-full h-screen flex flex-col items-center justify-between">
        <WalletWrapper>
          <HeaderPage />
          <div className="flex items-center justify-between w-full px-6 pt-4 lg:hidden">
            <Link href="" className="text-white">
              <Image src="/images/logo/white-logo.png" alt="logo" width={36} height={36} />
            </Link>
            <WalletPage />
          </div>
          <ShapesPage />
          {children}
          <ThemeSwitch />
        </WalletWrapper>
      </body >
    </html >
  );
};

export default RootLayout;
