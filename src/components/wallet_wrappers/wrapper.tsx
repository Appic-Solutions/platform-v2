"use client";

import { IdentityKitAuthType, IdentityKitDelegationType, IdentityKitSignerClient } from "@nfid/identitykit";
import { ConnectWallet, IdentityKitProvider, IdentityKitTheme } from "@nfid/identitykit/react";
import { wagmiAdapter, projectId } from "@/config/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, arbitrum, avalanche, base, optimism, polygon } from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
  name: "Appicdao",
  description: "AppKit Example",
  url: "https://reown.com/appkit", // origin must match your domain & subdomain
  icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

// Create the modal
const modal = createAppKit({
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
  // const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <IdentityKitProvider authType={IdentityKitAuthType.DELEGATION} signerClientOptions={{ targets: ["2ztvj-yaaaa-aaaap-ahiza-cai"] }}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </IdentityKitProvider>
    </WagmiProvider>
  );
};
