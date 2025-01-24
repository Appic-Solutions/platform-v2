import { useEffect } from 'react';
import { useAuthenticatedAgent } from '@/common/hooks/useAuthenticatedAgent';
import { useUnAuthenticatedAgent } from '@/common/hooks/useUnauthenticatedAgent';
import { useSharedStoreActions } from '@/common/state/store';
import { Principal } from '@dfinity/principal';
import { useIdentity } from '@nfid/identitykit/react';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';

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

  // Agents
  const authenticatedAgent = useAuthenticatedAgent();
  const unAuthenticatedAgent = useUnAuthenticatedAgent();

  // Set unauthenticated agent
  useEffect(() => {
    if (unAuthenticatedAgent) {
      setUnAuthenticatedAgent(unAuthenticatedAgent);
    }
  }, [unAuthenticatedAgent, setUnAuthenticatedAgent]);

  // Set ICP identity and authenticated agent
  useEffect(() => {
    if (icpIdentity && authenticatedAgent) {
      if (icpIdentity.getPrincipal() !== Principal.anonymous()) {
        setIcpIdentity(icpIdentity);
        setAuthenticatedAgent(authenticatedAgent);
      }
    }
  }, [icpIdentity, authenticatedAgent, setIcpIdentity, setAuthenticatedAgent]);

  // Set EVM connection state
  useEffect(() => {
    if (isEvmConnected && evmAddress) {
      setIsEvmConnected(isEvmConnected);
      setEvmAddress(evmAddress);
    }
    if (chainId) {
      setChainId(chainId);
    }
  }, [isEvmConnected, evmAddress, chainId, setIsEvmConnected, setEvmAddress, setChainId]);

  return null;
};
