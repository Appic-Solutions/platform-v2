import { IcpTokensBalances } from '@/blockchain_api/functions/icp/get_icp_balances';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';

export type WalletBalance =
  | IcpTokensBalances
  | {
      tokens: EvmToken[];
      totalBalanceUsd: string;
    };

export type WalletCardProps = {
  logo: string;
  title: string;
  balance: WalletBalance | undefined;
  disconnect: () => void;
  isLoading: boolean;
  address: string;
} & (
  | {
      hasMoreToken?: true;
    }
  | {
      hasMoreToken?: false;
    }
);

export type FormattedToken = (IcpToken | EvmToken) & {
  displayUsd: string;
  chainName: string;
  chainLogo: string;
};

export type BalanceType = 'wallet' | 'dex';
