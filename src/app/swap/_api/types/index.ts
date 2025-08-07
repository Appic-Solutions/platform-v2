export interface TxStatus {
  statusTitle: string;
  description: string;
}

export interface TxStep {
  title: string;
  statuses: {
    [key in 'pending' | 'successful' | 'failed']: TxStatus;
  };
}
