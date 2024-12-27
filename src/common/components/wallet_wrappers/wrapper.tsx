"use client";
import { IdentityKitAuthType } from "@nfid/identitykit";
import { IdentityKitProvider } from "@nfid/identitykit/react";
import { wagmiAdapter, projectId } from "@/common/configs/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, arbitrum, avalanche, base, optimism, polygon } from "@reown/appkit/networks";
import React from "react";
import { WagmiProvider, type Config } from "wagmi";

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
  name: "Appicdao",
  description: "Appic crosschain swap on icp",
  url: "http://app.appicdao.com", // origin must match your domain & subdomain
  icons: ["https://assets.reown.com/reown-profile-pic.png"],
  debug: true,
};

// Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, avalanche, base, optimism, polygon],
  defaultNetwork: mainnet,

  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

export const WalletWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <IdentityKitProvider authType={IdentityKitAuthType.DELEGATION} signerClientOptions={{ targets: ["zjydy-zyaaa-aaaaj-qnfka-cai"] }}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </IdentityKitProvider>
    </WagmiProvider>
  );
};
