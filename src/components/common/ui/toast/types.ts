export interface NotificationProps {
  type: 'success' | 'error' | 'warning';
  message: string;
}

export type TransactionNotificationProps = {
  title: string;
  caption: string;
  status: 'loading' | 'success' | 'failed';
  fromChain: string;
  fromToken: string;
  toToken: string;
} & (
  | {
      isSameChain: true;
      toChain?: undefined;
    }
  | {
      isSameChain: false;
      toChain: string;
    }
);
