import { useEffect } from 'react';
import { useAuthenticatedAgent } from '@/lib/hooks/useAuthenticatedAgent';
import { useUnAuthenticatedAgent } from '@/lib/hooks/useUnauthenticatedAgent';
import { useSharedStoreActions } from '@/store/store';
import { Principal } from '@dfinity/principal';
import { useAccounts, useAuth, useIdentity } from '@nfid/identitykit/react';
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
	const icpAccounts = useAccounts();
	const icpIdentity = useIdentity();
	const { disconnect } = useAuth();


	console.log(icpIdentity, icpAccounts);

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
		if (icpAccounts != undefined && authenticatedAgent) {
			if (icpAccounts[0].principal.compareTo(Principal.anonymous()) != "eq") {
				setIcpIdentity(icpAccounts[0].principal);
				setAuthenticatedAgent(authenticatedAgent);
			} else {
				disconnect()
			}
		}
		if (icpIdentity != undefined && authenticatedAgent) {
			if (icpIdentity.getPrincipal().compareTo(Principal.anonymous()) != "eq") {
				setIcpIdentity(icpIdentity.getPrincipal());
				setAuthenticatedAgent(authenticatedAgent);
			} else {
				disconnect()
			}
		}

	}, [icpAccounts, icpIdentity, authenticatedAgent, setIcpIdentity, setAuthenticatedAgent]);

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
