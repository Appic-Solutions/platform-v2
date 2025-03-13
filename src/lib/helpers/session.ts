import { BridgeOption } from '@/blockchain_api/functions/icp/get_bridge_options';

export type PendingTransaction = {
  bridge_option: BridgeOption;
  id: string;
};

function setPendingTransactionToSession({ bridge_option, id }: PendingTransaction): void {
  const key = 'pending_tx';

  const pendingTransaction: PendingTransaction = {
    bridge_option,
    id,
  };

  sessionStorage.setItem(key, JSON.stringify(pendingTransaction));
}

function getPendingTransaction(): PendingTransaction | null {
  const key = 'pending_tx';

  const data = sessionStorage.getItem(key);

  return data ? (JSON.parse(data) as PendingTransaction) : null;
}

function removePendingTransaction(): void {
  const key = 'pending_tx';

  sessionStorage.removeItem(key);
}

export { setPendingTransactionToSession, getPendingTransaction, removePendingTransaction };
