import "../style/globals.css";
import HeaderPage from "@/common/components/layout/header";
import ShapesPage from "@/common/components/layout/shapes";
import "@nfid/identitykit/react/styles.css";
import { WalletWrapper } from "@/common/components/wallet_wrappers/wrapper";
import Providers from "./providers";
import StoreProvider from "@/redux/store-provider";

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en" className="dark bg-[#060607] relative overflow-hidden h-full">
      <StoreProvider>
        <Providers>
          <WalletWrapper>
            <body className="flex flex-col h-full isolate pb-24 sm:pb-28 md:pb-0">
              <HeaderPage />
              <ShapesPage />
              {children}
            </body>
          </WalletWrapper>
        </Providers>
      </StoreProvider>
    </html>
  );
};

export default RootLayout;
