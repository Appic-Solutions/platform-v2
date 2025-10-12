import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';

export type TxStatusType = 'pending' | 'successful' | 'failed';

export interface NotificationProps {
  type: 'success' | 'error' | 'warning';
  message: string;
}

export type TransactionNotificationProps = {
  title: string;
  caption: string;
  isSameChain: boolean;
  status: TxStatusType;
  tokenIn: EvmToken | IcpToken;
  tokenOut: EvmToken | IcpToken;
};
