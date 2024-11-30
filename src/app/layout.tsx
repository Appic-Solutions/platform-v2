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
    <html lang="en" className="dark bg-[#060607] relative overflow-hidden h-full">
      <WalletWrapper>
        <body className="flex flex-col h-full isolate pb-24 sm:pb-28 md:pb-0">
          <HeaderPage />
          <ShapesPage />
          {children}
        </body >
      </WalletWrapper>
    </html >
  );
};

export default RootLayout;
