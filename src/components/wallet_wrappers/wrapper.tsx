"use client";

import { IdentityKitAuthType, IdentityKitDelegationType, IdentityKitSignerClient } from "@nfid/identitykit";
import { ConnectWallet, IdentityKitProvider, IdentityKitTheme } from "@nfid/identitykit/react";

export const WalletWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <IdentityKitProvider authType={IdentityKitAuthType.DELEGATION} signerClientOptions={{ targets: ["2ztvj-yaaaa-aaaap-ahiza-cai"] }}>
      {children}
    </IdentityKitProvider>
  );
};
