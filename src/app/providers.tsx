'use client';
import { useEffect } from 'react';
import { useAuthenticatedAgent } from '@/lib/hooks/useAuthenticatedAgent';
import { useUnAuthenticatedAgent } from '@/lib/hooks/useUnauthenticatedAgent';
import { useSharedStoreActions } from '@/store/store';
import { Principal } from '@dfinity/principal';
import { useIdentity } from '@nfid/identitykit/react';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { useQuery } from '@tanstack/react-query';
import { get_icp_tokens } from '@/blockchain_api/functions/icp/get_all_icp_tokens';
import { setStorageItem } from '@/lib/helpers/localstorage';
import { WalletWrapper } from '@/lib/wrappers/wallet/wrapper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Custom hook for syncing wallet state
const useWalletSync = () => {
  const {
    setIcpIdentity,
    setIsEvmConnected,
    setEvmAddress,
    setChainId,
    setAuthenticatedAgent,
    setUnAuthenticatedAgent,
  } = useSharedStoreActions();

  const icpIdentity = useIdentity();
  const { isConnected: isEvmConnected, address: evmAddress } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const authenticatedAgent = useAuthenticatedAgent();
  const unAuthenticatedAgent = useUnAuthenticatedAgent();

  useEffect(() => {
    // Sync ICP wallet
    if (icpIdentity && icpIdentity.getPrincipal() !== Principal.anonymous()) {
      setIcpIdentity(icpIdentity);
      if (authenticatedAgent) {
        setAuthenticatedAgent(authenticatedAgent);
      }
    }

    // Sync EVM wallet
    setIsEvmConnected(!!isEvmConnected && !!evmAddress);
    if (evmAddress) {
      setEvmAddress(evmAddress);
    }
    if (chainId) {
      setChainId(chainId);
    }

    // Sync unauthenticated agent
    if (unAuthenticatedAgent) {
      setUnAuthenticatedAgent(unAuthenticatedAgent);
    }
  }, [
    icpIdentity,
    authenticatedAgent,
    unAuthenticatedAgent,
    isEvmConnected,
    evmAddress,
    chainId,
    setIcpIdentity,
    setAuthenticatedAgent,
    setUnAuthenticatedAgent,
    setIsEvmConnected,
    setEvmAddress,
    setChainId,
  ]);

  return unAuthenticatedAgent; // Return for useQuery dependency
};

// Component for wallet and token syncing
export const WalletAndIcpTokensSync = () => {
  const unAuthenticatedAgent = useWalletSync();
  useQuery({
    queryKey: ['icp-tokens'],
    queryFn: async () => {
      if (!unAuthenticatedAgent) return;
      const response = await get_icp_tokens(unAuthenticatedAgent);
      if (response.result) {
        setStorageItem('icpTokens', JSON.stringify(response.result));
        return response.result; // Return the actual data
      }
      return []; // Default return if no result
    },
    enabled: !!unAuthenticatedAgent,
    refetchInterval: 1000 * 60 * 5, // Every 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  return null;
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <WalletWrapper>
        <WalletAndIcpTokensSync />
        {children}
      </WalletWrapper>
    </QueryClientProvider>
  );
}
