import { useEffect } from 'react';
import { useAuthenticatedAgent } from '@/lib/hooks/useAuthenticatedAgent';
import { useUnAuthenticatedAgent } from '@/lib/hooks/useUnauthenticatedAgent';
import { useSharedStoreActions } from '@/store/store';
import { Principal } from '@dfinity/principal';
import { useAccounts } from '@nfid/identitykit/react';
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
  const icpIdentity = useAccounts();

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
    console.log(icpIdentity);
    if (icpIdentity != undefined && authenticatedAgent) {
      if (icpIdentity[0].principal !== Principal.anonymous()) {
        setIcpIdentity(icpIdentity[0].principal);
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
