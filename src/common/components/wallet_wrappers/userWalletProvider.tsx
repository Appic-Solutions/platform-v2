import { useUnAuthenticatedAgent } from '@/common/hooks/useUnauthenticatedAgent';
import { useSharedStoreActions } from '@/common/state/store';
import { useIdentity } from '@nfid/identitykit/react';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { useEffect } from 'react';

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
  const authenticatedAgent = useAppKitAccount();
  const unAuthenticatedAgent = useUnAuthenticatedAgent();

  setUnAuthenticatedAgent(unAuthenticatedAgent);

  useEffect(() => {
    if (icpIdentity) {
      setIcpIdentity(icpIdentity);
    }
  }, [icpIdentity, setIcpIdentity]);

  useEffect(() => {
    if (isEvmConnected && evmAddress && chainId) {
      setIsEvmConnected(isEvmConnected);
      setEvmAddress(evmAddress);
      setChainId(chainId);
      setAuthenticatedAgent(authenticatedAgent);
    }
  }, [
    isEvmConnected,
    evmAddress,
    chainId,
    authenticatedAgent,
    setIsEvmConnected,
    setEvmAddress,
    setChainId,
    setAuthenticatedAgent,
  ]);

  return null;
};
