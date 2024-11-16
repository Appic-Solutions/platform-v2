import "../style/globals.css";
import HeaderPage from "@/components/layout/header";
import ShapesPage from "@/components/layout/shapes";
import "@nfid/identitykit/react/styles.css";
import { WalletWrapper } from "@/components/wallet_wrappers/wrapper";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className="dark bg-[#060607] bg-no-repeat h-screen">
      <body className="relative max-w-[1920px] mx-auto w-full h-full flex flex-col items-center justify-between">
        <WalletWrapper>
          <HeaderPage />
          <ShapesPage />
          {children}
        </WalletWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
