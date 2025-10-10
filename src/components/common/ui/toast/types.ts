export interface NotificationProps {
  type: 'success' | 'error' | 'warning';
  message: string;
}

export interface TransactionNotificationProps {
  title: string;
  caption: string;
}
