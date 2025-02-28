'use client';
import { IdentityKitAuthType, Plug, InternetIdentity, Stoic, NFIDW } from '@nfid/identitykit';
import { IdentityKitProvider } from '@nfid/identitykit/react';
import { wagmiAdapter, projectId } from '@/lib/configs/wagmi';
import { createAppKit } from '@reown/appkit/react';
import { mainnet, arbitrum, avalanche, base, optimism, polygon, bsc } from '@reown/appkit/networks';
import { WagmiProvider, type Config } from 'wagmi';

if (!projectId) {
  throw new Error('Project ID is not defined');
}

// Set up metadata
const metadata = {
  name: 'Appicdao',
  description: 'Appic crosschain swap on icp',
  url: 'http://app.appicdao.com', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
  debug: true,
};

// Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, avalanche, base, optimism, polygon, bsc],
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
      <IdentityKitProvider
        signers={[NFIDW, Plug, Stoic, InternetIdentity]}
        authType={IdentityKitAuthType.DELEGATION}
        signerClientOptions={{ targets: ['zjydy-zyaaa-aaaaj-qnfka-cai', '2ztvj-yaaaa-aaaap-ahiza-cai'] }}
      >
        {children}
      </IdentityKitProvider>
    </WagmiProvider>
  );
};
