'use client';
import { cn, getChainLogo } from '@/lib/utils';
import { useAuth, useIdentity } from '@nfid/identitykit/react';
import { useAppKit, useAppKitAccount, useDisconnect, useAppKitNetwork } from '@reown/appkit/react';
import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '../ui/popover';
import { CloseIcon } from '../icons';
import { useUnAuthenticatedAgent } from '@/hooks/useUnauthenticatedAgent';
import { useAuthenticatedAgent } from '@/hooks/useAuthenticatedAgent';
import { get_icp_wallet_tokens_balances } from '@/blockchain_api/functions/icp/get_icp_balances';
import { EvmTokensBalances, get_evm_wallet_tokens_balances } from '@/blockchain_api/functions/evm/get_evm_balances';
import { IcpToken } from '@/blockchain_api/types/tokens';
import WalletCard from './wallet/wallet-card';
import { WalletPop } from './wallet/wallet-pop';
import { getStorageItem } from '@/lib/localstorage';
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from '../ui/drawer';

const WalletPage = () => {
  // States Management
  const [icpBalance, setIcpBalance] = useState<{
    tokens: IcpToken[];
    totalBalanceUsd: string;
  }>();
  const [evmBalance, setEvmBalance] = useState<EvmTokensBalances>();

  const [icpLoading, setIcpLoading] = useState(false);
  const [evmLoading, setEvmLoading] = useState(false);

  const authenticatedAgent = useAuthenticatedAgent();

  // ICP Wallet Hooks
  const icpIdentity = useIdentity();
  const { connect: connectIcp, disconnect: disconnectIcp } = useAuth();

  // EVM Wallet Hooks
  const { open: openEvmModal } = useAppKit();
  const { isConnected: isEvmConnected, address: evmAddress } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const { disconnect: disconnectEvm } = useDisconnect();

  const fetchIcpBalances = async () => {
    try {
      setIcpLoading(true);
      if (authenticatedAgent && icpIdentity) {
        const all_tokens = getStorageItem('icpTokens');
        const icp_balance = await get_icp_wallet_tokens_balances(
          icpIdentity.getPrincipal().toString(),
          JSON.parse(all_tokens || '[]'),
          authenticatedAgent,
        );
        setIcpBalance(icp_balance.result);
      }
      setIcpLoading(false);
    } catch (error) {
      console.log('Get Balance Error => ', error);
    }
  };
  const fetchEvmBalances = async () => {
    try {
      setEvmLoading(true);
      if (evmAddress) {
        const evm_balance = await get_evm_wallet_tokens_balances(evmAddress);
        setEvmBalance(evm_balance.result);
      }
      setEvmLoading(false);
    } catch (error) {
      console.log('Line 85 Get Balance Error => ', error);
    }
  };

  useEffect(() => {
    fetchEvmBalances();
    fetchIcpBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticatedAgent, icpIdentity, evmAddress]);

  const handleDisconnectIcp = () => {
    disconnectIcp();
    setIcpBalance(undefined);
  };

  const handleDisconnectEvm = () => {
    disconnectEvm();
    setEvmBalance(undefined);
  };

  return (
    <div
      className={cn(
        'flex items-center justify-evenly gap-2 relative min-w-fit lg:h-[42px]',
        'rounded-full bg-[#faf7fd]/50 border border-[#ECE6F5]',
        'md:col-span-2 md:justify-self-end',
        (icpIdentity || isEvmConnected) && 'px-3',
        '*:rounded-full',
      )}
    >
      {!icpIdentity && !isEvmConnected ? (
        <>
          <div className="md:hidden">
            <Drawer>
              <DrawerTrigger className="w-full font-medium text-sm text-white py-2 px-3">Connect Wallet</DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>Select Wallet</DrawerHeader>
                <div className="flex flex-col gap-4">
                  {!icpIdentity && (
                    <WalletCard
                      connectWallet={() => connectIcp()}
                      walletLogo="/images/logo/wallet_logos/icp.svg"
                      walletTitle="Connect ICP Wallet"
                    />
                  )}
                  {!isEvmConnected && (
                    <WalletCard
                      connectWallet={() => openEvmModal()}
                      walletLogo={getChainLogo(chainId)}
                      walletTitle="Connect EVM Wallet"
                    />
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          <div className="hidden md:block">
            <Popover>
              <PopoverTrigger className="w-full font-medium text-sm text-white py-2 px-3">
                Connect Wallet
              </PopoverTrigger>
              <PopoverContent className="w-72 translate-y-4 flex flex-col gap-y-4" align="end">
                <div className="flex items-center justify-center font-medium text-white">
                  <PopoverClose className="absolute top-4 right-4">
                    <CloseIcon width={20} height={20} />
                  </PopoverClose>
                  Select Wallet
                </div>
                <div className="flex flex-col gap-4">
                  {!icpIdentity && (
                    <WalletCard
                      connectWallet={() => connectIcp()}
                      walletLogo="/images/logo/wallet_logos/icp.svg"
                      walletTitle="Connect ICP Wallet"
                    />
                  )}
                  {!isEvmConnected && (
                    <WalletCard
                      connectWallet={() => openEvmModal()}
                      walletLogo={getChainLogo(chainId)}
                      walletTitle="Connect EVM Wallet"
                    />
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </>
      ) : icpIdentity && isEvmConnected ? (
        <div className="text-black dark:text-white text-sm py-2 px-3">
          <span className="hidden md:inline-block">Connected</span> <span>Wallets</span>
        </div>
      ) : (
        <div className="text-black dark:text-white text-sm py-2 px-3">Add Wallet</div>
      )}

      {icpBalance && (
        <WalletPop
          logo="/images/logo/wallet_logos/icp.svg"
          title="Your ICP Wallet"
          balance={icpBalance}
          disconnect={handleDisconnectIcp}
          isLoading={icpLoading}
          address={icpIdentity?.getPrincipal().toString() || ''}
        />
      )}

      {evmBalance && (
        <WalletPop
          logo={getChainLogo(chainId)}
          title="Your EVM Wallet"
          balance={evmBalance}
          disconnect={handleDisconnectEvm}
          isLoading={evmLoading}
          address={evmAddress || ''}
        />
      )}
    </div>
  );
};

export default WalletPage;
