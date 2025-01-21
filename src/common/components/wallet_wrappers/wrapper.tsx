'use client';
import { IdentityKitAuthType } from '@nfid/identitykit';
import { IdentityKitProvider } from '@nfid/identitykit/react';
import { wagmiAdapter, projectId } from '@/common/configs/wagmi';
import { createAppKit } from '@reown/appkit/react';
import { mainnet, arbitrum, avalanche, base, optimism, polygon, bsc } from '@reown/appkit/networks';
import { WagmiProvider, type Config } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { get_icp_tokens } from '@/blockchain_api/functions/icp/get_all_icp_tokens';
import { setStorageItem } from '@/common/helpers/localstorage';
import { useUnAuthenticatedAgent } from '@/common/hooks/useUnauthenticatedAgent';

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
  const unAuthenticatedAgent = useUnAuthenticatedAgent();

  useQuery({
    queryKey: ['IcpTokens'],
    queryFn: async () => {
      if (!unAuthenticatedAgent) return [];

      await get_icp_tokens(unAuthenticatedAgent).then((res) => {
        if (res.result) {
          setStorageItem('icpTokens', JSON.stringify(res.result));
        }
      });

      return [];
    },
    enabled: !!unAuthenticatedAgent,
    refetchInterval: 1000 * 60 * 1.5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 45,
    gcTime: 1000 * 60 * 5,
  });

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <IdentityKitProvider
        authType={IdentityKitAuthType.DELEGATION}
        signerClientOptions={{ targets: ['zjydy-zyaaa-aaaaj-qnfka-cai'] }}
      >
        {children}
      </IdentityKitProvider>
    </WagmiProvider>
  );
};
