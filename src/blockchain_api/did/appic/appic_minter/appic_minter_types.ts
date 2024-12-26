import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AccessListItem {
  storage_keys: Array<Uint8Array | number[]>;
  address: string;
}
export interface Account {
  owner: Principal;
  subaccount: [] | [Uint8Array | number[]];
}
export interface AddErc20Token {
  erc20_ledger_id: Principal;
  erc20_token_symbol: string;
  chain_id: bigint;
  address: string;
}
export type CandidBlockTag = { Safe: null } | { Finalized: null } | { Latest: null };
export interface CanisterStatusResponse {
  status: CanisterStatusType;
  memory_size: bigint;
  cycles: bigint;
  settings: DefiniteCanisterSettings;
  query_stats: QueryStats;
  idle_cycles_burned_per_day: bigint;
  module_hash: [] | [Uint8Array | number[]];
  reserved_cycles: bigint;
}
export type CanisterStatusType = { stopped: null } | { stopping: null } | { running: null };
export interface DefiniteCanisterSettings {
  freezing_threshold: bigint;
  controllers: Array<Principal>;
  reserved_cycles_limit: bigint;
  log_visibility: LogVisibility;
  wasm_memory_limit: bigint;
  memory_allocation: bigint;
  compute_allocation: bigint;
}
export interface Eip1559TransactionPrice {
  max_priority_fee_per_gas: bigint;
  max_fee_per_gas: bigint;
  max_transaction_fee: bigint;
  timestamp: [] | [bigint];
  gas_limit: bigint;
}
export interface Eip1559TransactionPriceArg {
  erc20_ledger_id: Principal;
}
export interface Erc20Balance {
  balance: bigint;
  erc20_contract_address: string;
}
export interface Erc20Token {
  erc20_token_symbol: string;
  erc20_contract_address: string;
  ledger_canister_id: Principal;
}
export interface Event {
  timestamp: bigint;
  payload: EventPayload;
}
export type EventPayload =
  | { SkippedBlock: { block_number: bigint } }
  | {
      AcceptedErc20Deposit: {
        principal: Principal;
        transaction_hash: string;
        value: bigint;
        log_index: bigint;
        subaccount: [] | [Uint8Array | number[]];
        block_number: bigint;
        erc20_contract_address: string;
        from_address: string;
      };
    }
  | {
      SignedTransaction: {
        raw_transaction: string;
        withdrawal_id: bigint;
      };
    }
  | { Upgrade: UpgradeArg }
  | { Init: InitArg }
  | { AddedErc20Token: AddErc20Token }
  | { QuarantinedDeposit: { event_source: EventSource } }
  | { SyncedToBlock: { block_number: bigint } }
  | {
      AcceptedDeposit: {
        principal: Principal;
        transaction_hash: string;
        value: bigint;
        log_index: bigint;
        subaccount: [] | [Uint8Array | number[]];
        block_number: bigint;
        from_address: string;
      };
    }
  | {
      ReplacedTransaction: {
        withdrawal_id: bigint;
        transaction: UnsignedTransaction;
      };
    }
  | { QuarantinedReimbursement: { index: ReimbursementIndex } }
  | {
      ReimbursedNativeWithdrawal: {
        transaction_hash: [] | [string];
        withdrawal_id: bigint;
        reimbursed_amount: bigint;
        reimbursed_in_block: bigint;
      };
    }
  | {
      FailedErc20WithdrawalRequest: {
        to: Principal;
        withdrawal_id: bigint;
        reimbursed_amount: bigint;
        to_subaccount: [] | [Uint8Array | number[]];
      };
    }
  | {
      MintedErc20: {
        erc20_token_symbol: string;
        event_source: EventSource;
        erc20_contract_address: string;
        mint_block_index: bigint;
      };
    }
  | {
      ReimbursedErc20Withdrawal: {
        burn_in_block: bigint;
        transaction_hash: [] | [string];
        withdrawal_id: bigint;
        reimbursed_amount: bigint;
        ledger_id: Principal;
        reimbursed_in_block: bigint;
      };
    }
  | {
      AcceptedNativeWithdrawalRequest: {
        ledger_burn_index: bigint;
        destination: string;
        withdrawal_amount: bigint;
        from: Principal;
        created_at: [] | [bigint];
        from_subaccount: [] | [Uint8Array | number[]];
      };
    }
  | {
      CreatedTransaction: {
        withdrawal_id: bigint;
        transaction: UnsignedTransaction;
      };
    }
  | { InvalidDeposit: { event_source: EventSource; reason: string } }
  | {
      AcceptedErc20WithdrawalRequest: {
        erc20_ledger_burn_index: bigint;
        destination: string;
        withdrawal_amount: bigint;
        erc20_ledger_id: Principal;
        from: Principal;
        created_at: bigint;
        from_subaccount: [] | [Uint8Array | number[]];
        erc20_contract_address: string;
        max_transaction_fee: bigint;
        native_ledger_burn_index: bigint;
      };
    }
  | {
      FinalizedTransaction: {
        withdrawal_id: bigint;
        transaction_receipt: TransactionReceipt;
      };
    }
  | {
      MintedNative: {
        event_source: EventSource;
        mint_block_index: bigint;
      };
    };
export interface EventSource {
  transaction_hash: string;
  log_index: bigint;
}
export type EvmNetwork =
  | { BSC: null }
  | { Fantom: null }
  | { Base: null }
  | { Ethereum: null }
  | { BSCTestnet: null }
  | { ArbitrumOne: null }
  | { Sepolia: null }
  | { Polygon: null }
  | { Optimism: null }
  | { Avalanche: null };
export type FeeError =
  | { TemporarilyUnavailable: string }
  | {
      InsufficientAllowance: {
        token_symbol: string;
        ledger_id: Principal;
        allowance: bigint;
        failed_transfer_amount: bigint;
      };
    }
  | {
      AmountTooLow: {
        token_symbol: string;
        ledger_id: Principal;
        minimum_transfer_amount: bigint;
        failed_transfer_amount: bigint;
      };
    }
  | {
      InsufficientFunds: {
        balance: bigint;
        token_symbol: string;
        ledger_id: Principal;
        failed_transfer_amount: bigint;
      };
    };
export interface GasFeeEstimate {
  max_priority_fee_per_gas: bigint;
  max_fee_per_gas: bigint;
  timestamp: bigint;
}
export interface GetEventsArg {
  start: bigint;
  length: bigint;
}
export interface GetEventsResult {
  total_event_count: bigint;
  events: Array<Event>;
}
export interface Icrc28TrustedOriginsResponse {
  trusted_origins: Array<string>;
}
export interface InitArg {
  last_scraped_block_number: bigint;
  ecdsa_key_name: string;
  next_transaction_nonce: bigint;
  native_minimum_withdrawal_amount: bigint;
  native_symbol: string;
  helper_contract_address: [] | [string];
  deposit_native_fee: bigint;
  native_ledger_transfer_fee: bigint;
  native_index_id: Principal;
  withdrawal_native_fee: bigint;
  native_ledger_id: Principal;
  block_height: CandidBlockTag;
  evm_network: EvmNetwork;
  min_max_priority_fee_per_gas: bigint;
  ledger_suite_manager_id: Principal;
}
export type LedgerError =
  | { TemporarilyUnavailable: string }
  | {
      InsufficientAllowance: {
        token_symbol: string;
        ledger_id: Principal;
        allowance: bigint;
        failed_burn_amount: bigint;
      };
    }
  | {
      AmountTooLow: {
        minimum_burn_amount: bigint;
        token_symbol: string;
        ledger_id: Principal;
        failed_burn_amount: bigint;
      };
    }
  | {
      InsufficientFunds: {
        balance: bigint;
        token_symbol: string;
        ledger_id: Principal;
        failed_burn_amount: bigint;
      };
    };
export type LogVisibility = { controllers: null } | { public: null };
export type MinterArg = { UpgradeArg: UpgradeArg } | { InitArg: InitArg };
export interface MinterInfo {
  last_scraped_block_number: [] | [bigint];
  last_observed_block_number: [] | [bigint];
  supported_erc20_tokens: [] | [Array<Erc20Token>];
  deposit_native_fee: [] | [bigint];
  last_gas_fee_estimate: [] | [GasFeeEstimate];
  native_twin_token_ledger_id: [] | [Principal];
  helper_smart_contract_address: [] | [string];
  swap_canister_id: [] | [Principal];
  minimum_withdrawal_amount: [] | [bigint];
  withdrawal_native_fee: [] | [bigint];
  erc20_balances: [] | [Array<Erc20Balance>];
  minter_address: [] | [string];
  block_height: [] | [CandidBlockTag];
  native_balance: [] | [bigint];
  ledger_suite_manager_id: [] | [Principal];
}
export interface QueryStats {
  response_payload_bytes_total: bigint;
  num_instructions_total: bigint;
  num_calls_total: bigint;
  request_payload_bytes_total: bigint;
}
export type ReimbursementIndex =
  | {
      Erc20: {
        erc20_ledger_burn_index: bigint;
        ledger_id: Principal;
        native_ledger_burn_index: bigint;
      };
    }
  | { Native: { ledger_burn_index: bigint } };
export type RequestScrapingError =
  | { BlockAlreadyObserved: null }
  | { CalledTooManyTimes: null }
  | { InvalidBlockNumber: null };
export type LogScrapingResult = { Ok: null } | { Err: RequestScrapingError };
export type WithdrawalErc20Result = { Ok: RetrieveErc20Request } | { Err: WithdrawErc20Error };
export type WithdrawalNativeResult = { Ok: RetrieveNativeRequest } | { Err: WithdrawalError };
export interface RetrieveErc20Request {
  erc20_block_index: bigint;
  native_block_index: bigint;
}
export interface RetrieveNativeRequest {
  block_index: bigint;
}
export type RetrieveWithdrawalStatus =
  | { NotFound: null }
  | { TxFinalized: TxFinalizedStatus }
  | { TxSent: Transaction }
  | { TxCreated: null }
  | { Pending: null };
export interface Transaction {
  transaction_hash: string;
}
export interface TransactionReceipt {
  effective_gas_price: bigint;
  status: TransactionStatus;
  transaction_hash: string;
  block_hash: string;
  block_number: bigint;
  gas_used: bigint;
}
export type TransactionStatus = { Success: null } | { Failure: null };
export type TxFinalizedStatus =
  | {
      Success: {
        transaction_hash: string;
        effective_transaction_fee: [] | [bigint];
      };
    }
  | {
      Reimbursed: {
        transaction_hash: string;
        reimbursed_amount: bigint;
        reimbursed_in_block: bigint;
      };
    }
  | { PendingReimbursement: Transaction };
export interface UnsignedTransaction {
  destination: string;
  value: bigint;
  max_priority_fee_per_gas: bigint;
  data: Uint8Array | number[];
  max_fee_per_gas: bigint;
  chain_id: bigint;
  nonce: bigint;
  gas_limit: bigint;
  access_list: Array<AccessListItem>;
}
export interface UpgradeArg {
  last_scraped_block_number: [] | [bigint];
  next_transaction_nonce: [] | [bigint];
  evm_rpc_id: [] | [Principal];
  native_minimum_withdrawal_amount: [] | [bigint];
  helper_contract_address: [] | [string];
  deposit_native_fee: [] | [bigint];
  native_ledger_transfer_fee: [] | [bigint];
  withdrawal_native_fee: [] | [bigint];
  block_height: [] | [CandidBlockTag];
  min_max_priority_fee_per_gas: [] | [bigint];
}
export interface WithdrawErc20Arg {
  erc20_ledger_id: Principal;
  recipient: string;
  amount: bigint;
}
export type WithdrawErc20Error =
  | {
      TokenNotSupported: { supported_tokens: Array<Erc20Token> };
    }
  | { TemporarilyUnavailable: string }
  | { InvalidDestination: string }
  | { NativeLedgerError: { error: LedgerError } }
  | { NativeFeeTransferError: { error: FeeError } }
  | {
      Erc20LedgerError: {
        error: LedgerError;
        native_block_index: bigint;
      };
    };
export interface WithdrawalArg {
  recipient: string;
  amount: bigint;
}
export interface WithdrawalDetail {
  status: WithdrawalStatus;
  token_symbol: string;
  withdrawal_amount: bigint;
  withdrawal_id: bigint;
  from: Principal;
  from_subaccount: [] | [Uint8Array | number[]];
  max_transaction_fee: [] | [bigint];
  recipient_address: string;
}
export type WithdrawalError =
  | { TemporarilyUnavailable: string }
  | { InvalidDestination: string }
  | { InsufficientAllowance: { allowance: bigint } }
  | { AmountTooLow: { min_withdrawal_amount: bigint } }
  | { InsufficientFunds: { balance: bigint } };
export type WithdrawalSearchParameter =
  | { ByRecipient: string }
  | { BySenderAccount: Account }
  | { ByWithdrawalId: bigint };
export type WithdrawalStatus =
  | { TxFinalized: TxFinalizedStatus }
  | { TxSent: Transaction }
  | { TxCreated: null }
  | { Pending: null };
export interface _SERVICE {
  add_erc20_token: ActorMethod<[AddErc20Token], undefined>;
  check_new_deposits: ActorMethod<[], undefined>;
  eip_1559_transaction_price: ActorMethod<[[] | [Eip1559TransactionPriceArg]], Eip1559TransactionPrice>;
  get_canister_status: ActorMethod<[], CanisterStatusResponse>;
  get_events: ActorMethod<[GetEventsArg], GetEventsResult>;
  get_minter_info: ActorMethod<[], MinterInfo>;
  icrc28_trusted_origins: ActorMethod<[], Icrc28TrustedOriginsResponse>;
  minter_address: ActorMethod<[], string>;
  request_scraping_logs: ActorMethod<[bigint], LogScrapingResult>;
  retrieve_witdrawal_status: ActorMethod<[bigint], RetrieveWithdrawalStatus>;
  smart_contract_address: ActorMethod<[], string>;
  withdraw_erc20: ActorMethod<[WithdrawErc20Arg], WithdrawalErc20Result>;
  withdraw_native_token: ActorMethod<[WithdrawalArg], WithdrawalNativeResult>;
  withdrawal_status: ActorMethod<[WithdrawalSearchParameter], Array<WithdrawalDetail>>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
