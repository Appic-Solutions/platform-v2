import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useBridgeActions, useBridgeStore } from '../_store';
import { useSharedStore } from '@/store/store';
import { check_deposit_status, check_withdraw_status } from '@/blockchain_api/functions/icp/bridge_transactions';
import { BridgeOption, TxType } from '@/blockchain_api/functions/icp/get_bridge_options';
import { HttpAgent } from '@dfinity/agent';
import { useEffect } from 'react';
import { getPendingTransaction, PendingTransaction, removePendingTransaction } from '@/lib/helpers/session';

export const BridgeLogic = () => {
  const queryClient = useQueryClient();
  const { pendingTx } = useBridgeStore();
  const { setPendingTx } = useBridgeActions();
  const { icpIdentity, unAuthenticatedAgent, evmAddress } = useSharedStore();

  // check pending deposit tx status
  useQuery({
    queryKey: ['check-pending-deposit-status'],
    queryFn: async () => {
      const res = await check_deposit_status(
        pendingTx?.id as `0x${string}`,
        pendingTx?.bridge_option as BridgeOption,
        unAuthenticatedAgent as HttpAgent,
      );
      if (res.success) {
        if (res.result === 'Minted') {
          setPendingTx(undefined);
          removePendingTransaction();
        } else if (res.result === 'Invalid' || res.result === 'Quarantined') {
          setPendingTx(undefined);
          removePendingTransaction();
        } else {
          setPendingTx(pendingTx);
        }
      } else if (!res.success) {
        setPendingTx(undefined);
        removePendingTransaction();
      }
      queryClient.invalidateQueries({ queryKey: ['bridge-history', 'fetch-wallet-balances'] });
      return res;
    },
    refetchInterval: 1000 * 30,
    enabled:
      !!pendingTx &&
      !!unAuthenticatedAgent &&
      pendingTx.bridge_option.bridge_tx_type === TxType.Deposit &&
      !!evmAddress,
  });

  // check pending withdrawal tx status
  useQuery({
    queryKey: ['check-pending-withdrawal-status'],
    queryFn: async () => {
      const res = await check_withdraw_status(
        pendingTx?.id as string,
        pendingTx?.bridge_option as BridgeOption,
        unAuthenticatedAgent as HttpAgent,
      );

      if (res.success) {
        if (res.result === 'Successful') {
          setPendingTx(undefined);
          removePendingTransaction();
        } else if (res.result === 'QuarantinedReimbursement' || res.result === 'Reimbursed') {
          setPendingTx(undefined);
          removePendingTransaction();
        } else {
          setPendingTx(pendingTx);
        }
      } else if (!res.success) {
        setPendingTx(undefined);
        removePendingTransaction();
      }
      queryClient.invalidateQueries({ queryKey: ['bridge-history', 'fetch-wallet-balances'] });
      return res;
    },
    refetchInterval: 1000 * 30,
    enabled:
      !!pendingTx &&
      !!unAuthenticatedAgent &&
      pendingTx.bridge_option.bridge_tx_type === TxType.Withdrawal &&
      !!icpIdentity,
  });

  // get pending tx on reload
  useEffect(() => {
    const pendingTxFromSession = getPendingTransaction() as PendingTransaction;
    if (pendingTxFromSession) {
      if (pendingTxFromSession.bridge_option.bridge_tx_type === TxType.Deposit && evmAddress) {
        setPendingTx(pendingTxFromSession);
      }
      if (pendingTxFromSession.bridge_option.bridge_tx_type === TxType.Withdrawal && icpIdentity) {
        setPendingTx(pendingTxFromSession);
      }
    }
  }, [evmAddress, icpIdentity, setPendingTx]);
};
