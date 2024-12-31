import { useAuthenticatedAgent } from '@/common/hooks/useAuthenticatedAgent';
import { useUnAuthenticatedAgent } from '@/common/hooks/useUnauthenticatedAgent';
import { useSharedStoreActions } from '@/common/state/store';
import { Principal } from '@dfinity/principal';
import { useIdentity } from '@nfid/identitykit/react';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { useMemo } from 'react';

export const UserWalletProvider = () => {
  const {
    setIcpIdentity,
    setIsEvmConnected,
    setEvmAddress,
    setChainId,
    setAuthenticatedAgent,
    setUnAuthenticatedAgent,
  } = useSharedStoreActions();
  // ICP Wallet Hooks
  const icpIdentity = useIdentity();

  // EVM Wallet Hooks
  const { isConnected: isEvmConnected, address: evmAddress } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const authenticatedAgent = useAuthenticatedAgent();
  const unAuthenticatedAgent = useUnAuthenticatedAgent();

  setUnAuthenticatedAgent(unAuthenticatedAgent);

  useMemo(() => {
    if (icpIdentity && authenticatedAgent) {
      if (icpIdentity?.getPrincipal() === Principal.anonymous()) return;
      setIcpIdentity(icpIdentity);
      setAuthenticatedAgent(authenticatedAgent);
    }
  }, [icpIdentity, setIcpIdentity, authenticatedAgent, setAuthenticatedAgent]);

  useMemo(() => {
    if (chainId) {
      setChainId(chainId);
    }
    if (isEvmConnected && evmAddress) {
      setIsEvmConnected(isEvmConnected);
      setEvmAddress(evmAddress);
    }
  }, [isEvmConnected, evmAddress, chainId, setIsEvmConnected, setEvmAddress, setChainId]);

  return null;
};
