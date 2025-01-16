import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AddErc20Arg {
  contract: Erc20Contract;
  ledger_init_arg: LedgerInitArg;
}
export type AddErc20Error =
  | { TransferIcpError: TransferFromError }
  | { ChainIdNotSupported: string }
  | { Erc20TwinTokenAlreadyExists: null }
  | { InvalidErc20Contract: string }
  | { InternalError: string };
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
export interface CyclesManagement {
  cycles_top_up_increment: bigint;
  cycles_for_ledger_creation: bigint;
  cycles_for_archive_creation: bigint;
  cycles_for_index_creation: bigint;
}
export interface DefiniteCanisterSettings {
  freezing_threshold: bigint;
  controllers: Array<Principal>;
  reserved_cycles_limit: bigint;
  memory_allocation: bigint;
  compute_allocation: bigint;
}
export interface Erc20Contract {
  chain_id: bigint;
  address: string;
}
export interface InitArg {
  minter_ids: Array<[bigint, Principal]>;
  cycles_management: [] | [CyclesManagement];
  more_controller_ids: Array<Principal>;
  twin_ls_creation_fee_appic_token: [] | [bigint];
  twin_ls_creation_fee_icp_token: bigint;
}
export interface InstalledNativeLedgerSuite {
  fee: bigint;
  decimals: number;
  logo: string;
  name: string;
  chain_id: bigint;
  ledger_wasm_hash: string;
  ledger: Principal;
  index_wasm_hash: string;
  index: Principal;
  archives: Array<Principal>;
  symbol: string;
}
export type InvalidNativeInstalledCanistersError =
  | {
      TokenAlreadyManaged: null;
    }
  | { NotAllowed: null }
  | { WasmHashError: null }
  | { FailedToNotifyAppicHelper: null }
  | { AlreadyManagedPrincipals: null };
export type LSMarg = { Upgrade: UpgradeArg } | { Init: InitArg };
export interface LedgerInitArg {
  decimals: number;
  token_symbol: string;
  transfer_fee: bigint;
  token_logo: string;
  token_name: string;
}
export interface LedgerManagerInfo {
  minter_ids: Array<[bigint, Principal]>;
  cycles_management: CyclesManagement;
  managed_canisters: Array<ManagedCanisters>;
  more_controller_ids: Array<Principal>;
  ledger_suite_version: [] | [LedgerSuiteVersion];
  ls_creation_appic_fee: [] | [bigint];
  ls_creation_icp_fee: bigint;
}
export interface LedgerSuiteVersion {
  archive_compressed_wasm_hash: string;
  ledger_compressed_wasm_hash: string;
  index_compressed_wasm_hash: string;
}
export interface ManagedCanisterIds {
  ledger: [] | [Principal];
  index: [] | [Principal];
  archives: Array<Principal>;
}
export type ManagedCanisterStatus =
  | {
      Created: { canister_id: Principal };
    }
  | {
      Installed: { canister_id: Principal; installed_wasm_hash: string };
    };
export interface ManagedCanisters {
  erc20_contract: Erc20Contract;
  twin_erc20_token_symbol: string;
  ledger: [] | [ManagedCanisterStatus];
  index: [] | [ManagedCanisterStatus];
  archives: Array<Principal>;
}
export interface QueryStats {
  response_payload_bytes_total: bigint;
  num_instructions_total: bigint;
  num_calls_total: bigint;
  request_payload_bytes_total: bigint;
}
export type Result = { Ok: null } | { Err: AddErc20Error };
export type Result_1 = { Ok: null } | { Err: InvalidNativeInstalledCanistersError };
export type TransferFromError =
  | {
      GenericError: { message: string; error_code: bigint };
    }
  | { TemporarilyUnavailable: null }
  | { InsufficientAllowance: { allowance: bigint } }
  | { BadBurn: { min_burn_amount: bigint } }
  | { Duplicate: { duplicate_of: bigint } }
  | { BadFee: { expected_fee: bigint } }
  | { CreatedInFuture: { ledger_time: bigint } }
  | { TooOld: null }
  | { InsufficientFunds: { balance: bigint } };
export interface UpdateCyclesManagement {
  cycles_top_up_increment: [] | [bigint];
  cycles_for_ledger_creation: [] | [bigint];
  cycles_for_archive_creation: [] | [bigint];
  cycles_for_index_creation: [] | [bigint];
}
export interface UpdateLedgerSuiteCreationFee {
  icp: bigint;
  appic: [] | [bigint];
}
export interface UpgradeArg {
  cycles_management: [] | [UpdateCyclesManagement];
  archive_compressed_wasm_hash: [] | [string];
  new_minter_ids: [] | [Array<[bigint, Principal]>];
  ledger_compressed_wasm_hash: [] | [string];
  index_compressed_wasm_hash: [] | [string];
  twin_ls_creation_fees: [] | [UpdateLedgerSuiteCreationFee];
}
export interface _SERVICE {
  add_erc20_ls: ActorMethod<[AddErc20Arg], Result>;
  add_native_ls: ActorMethod<[InstalledNativeLedgerSuite], Result_1>;
  all_twins_canister_ids: ActorMethod<[], Array<ManagedCanisters>>;
  get_canister_status: ActorMethod<[], CanisterStatusResponse>;
  get_lsm_info: ActorMethod<[], LedgerManagerInfo>;
  twin_canister_ids_by_contract: ActorMethod<[Erc20Contract], [] | [ManagedCanisterIds]>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
