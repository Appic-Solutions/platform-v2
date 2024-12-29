'use client';
import { IdentityKitAuthType } from '@nfid/identitykit';
import { IdentityKitProvider, useIdentity } from '@nfid/identitykit/react';
import { wagmiAdapter, projectId } from '@/common/configs/wagmi';
import { createAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { mainnet, arbitrum, avalanche, base, optimism, polygon } from '@reown/appkit/networks';
import { WagmiProvider, type Config } from 'wagmi';
import { useUnAuthenticatedAgent } from '@/common/hooks/useUnauthenticatedAgent';
import { useQuery } from '@tanstack/react-query';
import { get_icp_tokens } from '@/blockchain_api/functions/icp/get_all_icp_tokens';
import { setStorageItem } from '@/common/helpers/localstorage';
import { useSharedStore, useSharedStoreActions } from '@/common/state/store';
import { useEffect } from 'react';

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
  networks: [mainnet, arbitrum, avalanche, base, optimism, polygon],
  defaultNetwork: mainnet,

  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

const UserWalletProvider = () => {
  const { setUnAuthenticatedAgent, setIcpIdentity, setIsEvmConnected, setEvmAddress, setChainId } =
    useSharedStoreActions();
  // ICP Wallet Hooks
  const icpIdentity = useIdentity();

  // EVM Wallet Hooks
  const { isConnected: isEvmConnected, address: evmAddress } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  const unAuthenticatedAgent = useUnAuthenticatedAgent();

  useEffect(() => {
    console.log('Setting shared store', {
      unAuthenticatedAgent,
      icpIdentity,
      isEvmConnected,
      evmAddress,
      chainId,
    });
    setUnAuthenticatedAgent(unAuthenticatedAgent);
    setIcpIdentity(icpIdentity);
    setIsEvmConnected(isEvmConnected);
    setEvmAddress(evmAddress);
    setChainId(chainId);
  }, [
    unAuthenticatedAgent,
    icpIdentity,
    isEvmConnected,
    evmAddress,
    chainId,
    setUnAuthenticatedAgent,
    setIcpIdentity,
    setIsEvmConnected,
    setEvmAddress,
    setChainId,
  ]);

  return null;
};

export const WalletWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { unAuthenticatedAgent } = useSharedStore((state) => state);
  useQuery({
    queryKey: ['IcpTokens'],
    queryFn: async () => {
      if (!unAuthenticatedAgent) return;
      const res = await get_icp_tokens(unAuthenticatedAgent);

      if (res.result) {
        setStorageItem('icpTokens', JSON.stringify(res.result));
      }

      return res.result;
    },
    enabled: true,
    refetchInterval: 1000 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <IdentityKitProvider
        authType={IdentityKitAuthType.DELEGATION}
        signerClientOptions={{ targets: ['zjydy-zyaaa-aaaaj-qnfka-cai'] }}
      >
        <UserWalletProvider />
        {children}
      </IdentityKitProvider>
    </WagmiProvider>
  );
};
