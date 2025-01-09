export interface TxStatus {
  statusTitle: string;
  description: string;
}

export interface TxStep {
  logo: string;
  title: string;
  statuses: {
    [key in 'pending' | 'successful' | 'failed']: TxStatus;
  };
}
