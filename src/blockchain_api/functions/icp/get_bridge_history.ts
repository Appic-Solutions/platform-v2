import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';

import { idlFactory as AppicHelperIdlFactory } from '@/blockchain_api/did/appic/appic_helper/appic_helper.did';
import { Transaction } from '@/blockchain_api/did/appic/appic_helper/appic_helper_types';

import { appic_helper_canister_id } from '@/canister_ids.json';
import { parse_evm_to_icp_tx_status, parse_icp_to_evm_tx_status } from './utils/tx_status_parser';
import BigNumber from 'bignumber.js';
import { Principal } from '@dfinity/principal';
import { NATIVE_TOKEN_ADDRESS } from './get_bridge_options';
import { chains } from '@/blockchain_api/lists/chains';
import { DepositTxStatus, WithdrawalTxStatus } from './bridge_transactions';
import { Response } from '@/blockchain_api/types/response';
import { Actor, HttpAgent } from '@dfinity/agent';
export type Status = 'Pending' | 'Successful' | 'Failed';
export interface BridgeStep {
  status: Status;
  message: string;
  link?: string;
}

export interface BridgeHistory {
  id: string;
  date_object: Date;
  date: string;
  time: string;
  from_token: EvmToken | IcpToken;
  to_token: EvmToken | IcpToken;
  tx_type: 'Deposit' | 'Withdrawal';
  fee: string;
  human_readable_fee: string;
  fee_token_symbol: string;
  bridge_steps: BridgeStep[];
  status: Status;
  base_value: string;
  human_readable_base_value: string;
  final_value: string;
  human_readable_final_value: string;
  verified: boolean;
}

export const get_transaction_history = async (
  evm_wallet_address: string | undefined,
  principal_id: Principal | undefined,
  unauthenticated_agent: HttpAgent,
  bridge_tokens: (EvmToken | IcpToken)[],
): Promise<Response<BridgeHistory[]>> => {
  const appic_helper_actor = Actor.createActor(AppicHelperIdlFactory, {
    canisterId: Principal.fromText(appic_helper_canister_id),
    agent: unauthenticated_agent,
  });
  try {
    if (evm_wallet_address && principal_id) {
      const txs = (await appic_helper_actor.get_txs_by_address_principal_combination(
        evm_wallet_address,
        principal_id,
      )) as Transaction[];
      return { result: transform_bridge_tx(txs, bridge_tokens), message: '', success: true };
    } else if (evm_wallet_address) {
      const txs = (await appic_helper_actor.get_txs_by_address(evm_wallet_address)) as Transaction[];
      return { result: transform_bridge_tx(txs, bridge_tokens), message: '', success: true };
    } else if (principal_id) {
      const txs = (await appic_helper_actor.get_txs_by_principal(principal_id)) as Transaction[];
      return { result: transform_bridge_tx(txs, bridge_tokens), message: '', success: true };
    } else {
      return {
        result: [],
        message: 'At least one principal id or evm address should be provided',
        success: false,
      };
    }
  } catch (error) {
    console.log(error);
    console.error(error);
    return {
      result: [],
      message: `Failed to get user transaction history ${error}`,
      success: false,
    };
  }
};

// convert Transaction into BridgeHistory
const transform_bridge_tx = (txs: Transaction[], bridge_tokens: (EvmToken | IcpToken)[]): BridgeHistory[] => {
  return txs
    .map((tx): BridgeHistory => {
      if ('EvmToIcp' in tx) {
        const transaction = tx.EvmToIcp;
        const id = `${transaction.transaction_hash}-${transaction.chain_id}`;
        const epoch = Math.floor(BigNumber(transaction.time.toString()).dividedBy(1_000_000).toNumber());
        const date_object = new Date(epoch);
        const date = date_object.toLocaleDateString('en-GB');
        const time = date_object.toLocaleTimeString();
        const from_token = bridge_tokens.find(
          (token) => token.chain_type == 'EVM' && token.contractAddress == transaction.erc20_contract_address,
        )!;

        const to_token = bridge_tokens.find(
          (token) =>
            token.chain_type == 'ICP' &&
            token.canisterId!.toLocaleLowerCase() == transaction.icrc_ledger_id[0]?.toString().toLowerCase(),
        )!;

        const native_currency = bridge_tokens.find(
          (token) => token.chain_type == 'EVM' && token.contractAddress == NATIVE_TOKEN_ADDRESS,
        )!;

        const tx_type = 'Deposit';
        const fee = transaction.total_gas_spent[0]?.toString() || '0';
        const human_readable_fee =
          fee == '0' ? 'Calculating fees' : BigNumber(fee).dividedBy(BigNumber(10).pow(18)).toString();
        const fee_token_symbol = native_currency.symbol;
        const base_value = transaction.value.toString();
        const human_readable_base_value = BigNumber(base_value)
          .dividedBy(BigNumber(10).pow(from_token.decimals))
          .toString();

        const final_value = transaction.actual_received[0]?.toString() || '0';
        const human_readable_final_value = BigNumber(final_value)
          .dividedBy(BigNumber(10).pow(to_token.decimals))
          .toString();
        const scanner = chains.find(
          (chain) => chain.chainId.toString() == transaction.chain_id.toString(),
        )!.scannerAddress;
        const bridge_steps = transform_tx_history_to_steps(tx, scanner, human_readable_final_value, to_token.symbol);
        const bridge_status = map_tx_status_to_status(parse_evm_to_icp_tx_status(transaction.status));
        return {
          id,
          date,
          date_object: date_object,
          time,
          from_token,
          to_token,
          tx_type,
          fee,
          human_readable_fee,
          fee_token_symbol,
          bridge_steps,
          status: bridge_status,
          base_value,
          human_readable_base_value,
          final_value,
          human_readable_final_value,
          verified: tx.EvmToIcp.verified,
        };
      } else if ('IcpToEvm' in tx) {
        const transaction = tx.IcpToEvm;
        const id = `${transaction.native_ledger_burn_index}-${transaction.chain_id}`;
        const epoch = Math.floor(BigNumber(transaction.time.toString()).dividedBy(1_000_000).toNumber());
        const date_object = new Date(epoch);
        const date = date_object.toLocaleDateString('en-GB');
        const time = date_object.toLocaleTimeString();
        const from_token = bridge_tokens.find(
          (token) =>
            token.chain_type == 'ICP' &&
            token.canisterId!.toLocaleLowerCase() == transaction.icrc_ledger_id[0]?.toString().toLowerCase(),
        )!;

        const to_token = bridge_tokens.find(
          (token) => token.chain_type == 'EVM' && token.contractAddress == transaction.erc20_contract_address,
        )!;

        const chain = chains.find((chain) => chain.chainId.toString() == transaction.chain_id.toString())!;
        const native_ledger_principal =
          'AppicMinter' in transaction.operator
            ? chain.appic_twin_native_ledger_canister_id!
            : chain.dfinity_ck_native_ledger_canister_id!;

        const native_currency = bridge_tokens.find(
          (token) => token.chain_type == 'ICP' && token.canisterId! == native_ledger_principal,
        )!;

        const tx_type = 'Withdrawal';
        const fee = transaction.total_gas_spent[0]?.toString() || '0';
        const human_readable_fee =
          fee == '0' ? 'Calculating fees' : BigNumber(fee).dividedBy(BigNumber(10).pow(18)).toString();
        const fee_token_symbol = native_currency.symbol;
        const base_value = transaction.withdrawal_amount.toString();
        const human_readable_base_value = BigNumber(base_value)
          .dividedBy(BigNumber(10).pow(from_token.decimals))
          .toString();

        const final_value = transaction.actual_received[0]?.toString() || '0';
        const human_readable_final_value = BigNumber(final_value)
          .dividedBy(BigNumber(10).pow(to_token.decimals))
          .toString();
        const scanner = chain.scannerAddress;
        const bridge_steps = transform_tx_history_to_steps(tx, scanner, human_readable_final_value, to_token.symbol);
        const bridge_status = map_tx_status_to_status(parse_icp_to_evm_tx_status(transaction.status));
        return {
          id,
          date,
          date_object: date_object,
          time,
          from_token,
          to_token,
          tx_type,
          fee,
          human_readable_fee,
          fee_token_symbol,
          bridge_steps,
          status: bridge_status,
          base_value,
          human_readable_base_value,
          final_value,
          human_readable_final_value,
          verified: tx.IcpToEvm.verified,
        };
      } else {
        throw 'Wrong Transaction type';
      }
    })
    .sort((a, b) => b.date_object.getTime() - a.date_object.getTime());
};

// Convert  tx_status to BridgeStep[]
const transform_tx_history_to_steps = (
  tx: Transaction,
  scanner: string,
  final_value: string,
  to_token_symbol: string,
): BridgeStep[] => {
  if ('EvmToIcp' in tx) {
    const parsed_status = parse_evm_to_icp_tx_status(tx.EvmToIcp.status);

    const steps: BridgeStep[] = [
      create_bridge_step(
        'Successful',
        'Transaction submitted to the network',
        `${scanner}/tx/${tx.EvmToIcp.transaction_hash}`,
      ),
      create_bridge_step('Pending', 'Minter canister verification in progress'),
      create_bridge_step('Pending', 'Minting in progress'),
      create_bridge_step('Failed', `Transaction failed, ${parsed_status}`),
    ];

    switch (parsed_status) {
      case 'PendingVerification':
        return steps.slice(0, 2);
      case 'Accepted':
        return [steps[0], create_bridge_step('Successful', 'Transaction verified by minter'), steps[2]];
      case 'Minted':
        return [
          steps[0],
          create_bridge_step('Successful', 'Transaction verified by minter'),
          create_bridge_step('Successful', `${final_value} ${to_token_symbol} minted`),
        ];
      case 'Invalid':
      case 'Quarantined':
        return [
          steps[0],
          create_bridge_step('Successful', 'Transaction verified by minter'),
          create_bridge_step('Failed', `Bridge transaction failed. Tx is ${parsed_status}`),
        ];
      default:
        return []; // Default case if status is unexpected
    }
  } else if ('IcpToEvm' in tx) {
    const parsed_status = parse_icp_to_evm_tx_status(tx.IcpToEvm.status);

    const steps: BridgeStep[] = [
      create_bridge_step('Successful', `Transaction submitted with Id: ${tx.IcpToEvm.native_ledger_burn_index}`),
      create_bridge_step('Pending', 'Transaction verification in progress'),
      create_bridge_step('Pending', 'Signing in progress'),
      create_bridge_step('Failed', `Transaction failed, ${parsed_status}`),
    ];

    switch (parsed_status) {
      case 'PendingVerification':
        return steps.slice(0, 2);
      case 'Accepted':
        return [
          steps[0],
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Pending', 'Creating Eip1559 transaction'),
        ];
      case 'Created':
        return [
          steps[0],
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Created Eip1559 transaction'),
          create_bridge_step('Pending', 'signing Eip1559 transaction'),
        ];
      case 'SignedTransaction':
        return [
          steps[0],
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Created Eip1559 transaction'),
          create_bridge_step('Successful', 'Signed Eip1559 transaction'),
          create_bridge_step('Pending', 'Sending Eip1559 transaction'),
        ];

      case 'Successful':
        return [
          steps[0],
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Created Eip1559 transaction'),
          create_bridge_step('Successful', 'Signed Eip1559 transaction'),
          create_bridge_step(
            'Successful',
            `Received ~${final_value} ${to_token_symbol} `,
            `${scanner}/tx/${tx.IcpToEvm.transaction_hash[0]}`,
          ),
        ];

      case 'ReplacedTransaction':
        return [
          steps[0],
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Created Eip1559 transaction'),
          create_bridge_step('Successful', 'Signed Eip1559 transaction'),
          create_bridge_step('Pending', 'Replacing transaction'),
        ];

      case 'Failed':
        return [
          steps[0],
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Created Eip1559 transaction'),
          create_bridge_step('Successful', 'Signed Eip1559 transaction'),
          create_bridge_step(
            'Failed',
            'Failed to bridge funds, your funds will be refunded',
            `${scanner}/tx/${tx.IcpToEvm.transaction_hash[0]}`,
          ),
          create_bridge_step('Pending', 'Refund in progress'),
        ];

      case 'Reimbursed':
        return [
          steps[0],
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Created Eip1559 transaction'),
          create_bridge_step('Successful', 'Signed Eip1559 transaction'),
          create_bridge_step(
            'Failed',
            'Failed to bridge funds, your funds will be refunded',
            `${scanner}/tx/${tx.IcpToEvm.transaction_hash[0]}`,
          ),
          create_bridge_step('Successful', 'Refunded your funds back to your wallet'),
        ];

      case 'QuarantinedReimbursement':
        return [
          steps[0],
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Created Eip1559 transaction'),
          create_bridge_step('Successful', 'Signed Eip1559 transaction'),
          create_bridge_step(
            'Failed',
            'Failed to bridge funds, your funds will be refunded',
            `${scanner}/tx/${tx.IcpToEvm.transaction_hash[0]}`,
          ),
          create_bridge_step('Successful', 'Failed to refund back, transaction is quarantined'),
        ];
    }
  }
  return [] as BridgeStep[];
};

// Helper function to create BridgeStep
const create_bridge_step = (status: Status, message: string, link?: string): BridgeStep => ({
  status,
  message,
  link,
});

const map_tx_status_to_status = (status: WithdrawalTxStatus | DepositTxStatus): Status => {
  switch (status) {
    case 'Successful':
    case 'Minted':
      return 'Successful';

    case 'Failed':
    case 'Call Failed':
    case 'Invalid':
    case 'Quarantined':
    case 'QuarantinedReimbursement':
    case 'Reimbursed':
      return 'Failed';

    case 'PendingVerification':
    case 'Accepted':
    case 'SignedTransaction':
    case 'ReplacedTransaction':
    case 'Created':
      return 'Pending';

    default:
      throw new Error(`Unknown status: ${status}`);
  }
};
