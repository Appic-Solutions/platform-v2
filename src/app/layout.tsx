import type { Metadata } from "next";
import "../style/globals.css";
import HeaderPage from "@/components/layout/header";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className="dark bg-background-main bg-no-repeat">
      <body className="relative w-full max-w-[1920px] mx-auto flex flex-col">
        <HeaderPage />
        {children}
      </body>
    </html>
  );
}

export default RootLayout;