import { useEffect, useState } from 'react';
import { useSharedStore, useSharedStoreActions } from '@/store/store';
import { fetchEvmBalances, fetchIcpBalances } from '@/lib/helpers/wallet';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@nfid/identitykit/react';
import { useAppKit, useDisconnect } from '@reown/appkit/react';

export const WalletLogic = () => {
  const { icpIdentity, evmAddress, unAuthenticatedAgent } = useSharedStore();
  const {
    setIcpBalance,
    setEvmBalance,
    setUnAuthenticatedAgent,
    setIsEvmConnected,
    setChainId,
    setIcpIdentity,
    setEvmAddress,
    setIsEvmBalanceLoading,
    setIsIcpBalanceLoading,
  } = useSharedStoreActions();
  // ICP Wallet Hooks
  const { disconnect: disconnectIcp, connect: connectIcpWallet } = useAuth();
  // EVM Wallet Hooks
  const { disconnect: disconnectEvmWallet } = useDisconnect();
  const { open: connectEvmWallet } = useAppKit();
  const [isFetching, setIsFetching] = useState(false);

  const fetchBalances = async () => {
    if (isFetching) return null;
    setIsFetching(true);

    // Fetch EVM balance
    if (evmAddress) {
      setIsEvmBalanceLoading(true);
      try {
        const evmRes = await fetchEvmBalances({ evmAddress });
        setEvmBalance(evmRes);
      } finally {
        setIsEvmBalanceLoading(false);
      }
    }

    // Fetch ICP balance
    if (icpIdentity && unAuthenticatedAgent) {
      setUnAuthenticatedAgent(unAuthenticatedAgent);
      setIsIcpBalanceLoading(true);
      try {
        const icpRes = await fetchIcpBalances({ unAuthenticatedAgent, icpIdentity });
        setIcpBalance(icpRes);
      } finally {
        setIsIcpBalanceLoading(false);
      }
    }

    setIsFetching(false);
    return null;
  };

  // Fetch balances on dependency change
  useEffect(() => {
    if (evmAddress || icpIdentity) {
      fetchBalances();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evmAddress, icpIdentity]);

  // Fetch balances every 1.5 minutes
  useQuery({
    queryKey: ['fetch-wallet-balances'],
    queryFn: fetchBalances,
    refetchInterval: 1000 * 90,
    gcTime: 1000 * 60,
    staleTime: 1000 * 60,
    enabled: !!(evmAddress || icpIdentity), // Enable only if wallets are connected
  });
  const walletDisconnectHandler = (walletType: 'EVM' | 'ICP') => {
    if (walletType === 'EVM') {
      disconnectEvmWallet();
      setEvmBalance(undefined);
      setIsEvmConnected(false);
      setChainId(undefined);
      setEvmAddress(undefined);
      return;
    }
    disconnectIcp();
    setIcpBalance(undefined);
    setIcpIdentity(undefined);
  };

  const walletConnectHandler = (walletType: 'EVM' | 'ICP') => {
    if (walletType === 'EVM') {
      connectEvmWallet();
      return;
    }
    connectIcpWallet();
  };

  return {
    walletDisconnectHandler,
    walletConnectHandler,
  };
};
