import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface AddEvmToIcpTx {
  principal: Principal;
  transaction_hash: string;
  value: bigint;
  operator: Operator;
  time: bigint;
  subaccount: [] | [Uint8Array | number[]];
  erc20_contract_address: string;
  chain_id: bigint;
  from_address: string;
  icrc_ledger_id: Principal;
  total_gas_spent: bigint;
}
export type AddEvmToIcpTxError = { InvalidAddress: null } | { ChinNotSupported: null } | { InvalidTokenPairs: null } | { InvalidTokenContract: null } | { TxAlreadyExsits: null };
export interface AddIcpToEvmTx {
  destination: string;
  withdrawal_amount: bigint;
  from: Principal;
  operator: Operator;
  time: bigint;
  from_subaccount: [] | [Uint8Array | number[]];
  erc20_contract_address: string;
  chain_id: bigint;
  max_transaction_fee: bigint;
  icrc_ledger_id: Principal;
  native_ledger_burn_index: bigint;
}
export type AddIcpToEvmTxError = { InvalidDestination: null } | { ChinNotSupported: null } | { InvalidTokenPairs: null } | { InvalidTokenContract: null } | { TxAlreadyExsits: null };
export interface CandidEvmToIcp {
  status: EvmToIcpStatus;
  principal: Principal;
  verified: boolean;
  transaction_hash: string;
  value: bigint;
  operator: Operator;
  time: bigint;
  subaccount: [] | [Uint8Array | number[]];
  block_number: [] | [bigint];
  erc20_contract_address: string;
  actual_received: [] | [bigint];
  ledger_mint_index: [] | [bigint];
  chain_id: bigint;
  from_address: string;
  icrc_ledger_id: [] | [Principal];
  total_gas_spent: [] | [bigint];
}
export interface CandidEvmToken {
  decimals: number;
  logo: string;
  name: string;
  erc20_contract_address: string;
  chain_id: bigint;
  symbol: string;
}
export interface CandidIcpToEvm {
  effective_gas_price: [] | [bigint];
  status: IcpToEvmStatus;
  erc20_ledger_burn_index: [] | [bigint];
  destination: string;
  verified: boolean;
  transaction_hash: [] | [string];
  withdrawal_amount: bigint;
  from: Principal;
  operator: Operator;
  time: bigint;
  from_subaccount: [] | [Uint8Array | number[]];
  erc20_contract_address: string;
  actual_received: [] | [bigint];
  chain_id: bigint;
  max_transaction_fee: [] | [bigint];
  icrc_ledger_id: [] | [Principal];
  gas_used: [] | [bigint];
  total_gas_spent: [] | [bigint];
  native_ledger_burn_index: bigint;
}
export interface CandidIcpToken {
  fee: bigint;
  decimals: number;
  usd_price: string;
  logo: string;
  name: string;
  rank: [] | [number];
  ledger_id: Principal;
  token_type: IcpTokenType;
  symbol: string;
}
export type EvmToIcpStatus = { Invalid: string } | { PendingVerification: null } | { Minted: null } | { Accepted: null } | { Quarantined: null };
export interface GetEvmTokenArgs {
  chain_id: bigint;
  address: string;
}
export interface GetIcpTokenArgs {
  ledger_id: Principal;
}
export interface GetTxParams {
  chain_id: bigint;
  search_param: TransactionSearchParam;
}
export type IcpToEvmStatus = { Failed: null } | { SignedTransaction: null } | { ReplacedTransaction: null } | { QuarantinedReimbursement: null } | { PendingVerification: null } | { Accepted: null } | { Reimbursed: null } | { Successful: null } | { Created: null } | { FinalizedTransaction: null };
export type IcpTokenType = { ICRC1: null } | { ICRC2: null } | { ICRC3: null } | { DIP20: null } | { Other: string };
export interface Icrc28TrustedOriginsResponse {
  trusted_origins: Array<string>;
}
export interface InitArgs {
  minters: Array<MinterArgs>;
}
export type LoggerArgs = { Upgrade: UpgradeArg } | { Init: InitArgs };
export interface MinterArgs {
  last_observed_event: bigint;
  last_scraped_event: bigint;
  operator: Operator;
  chain_id: bigint;
  icp_to_evm_fee: bigint;
  evm_to_icp_fee: bigint;
  minter_id: Principal;
}
export type Operator = { AppicMinter: null } | { DfinityCkEthMinter: null };
export type Result = { Ok: null } | { Err: AddEvmToIcpTxError };
export type Result_1 = { Ok: null } | { Err: AddIcpToEvmTxError };
export interface TokenPair {
  operator: Operator;
  evm_token: CandidEvmToken;
  icp_token: CandidIcpToken;
}
export type Transaction = { EvmToIcp: CandidEvmToIcp } | { IcpToEvm: CandidIcpToEvm };
export type TransactionSearchParam = { TxWithdrawalId: bigint } | { TxMintId: bigint } | { TxHash: string };
export interface UpdateMinterArgs {
  operator: Operator;
  chain_id: bigint;
  icp_to_evm_fee: bigint;
  evm_to_icp_fee: bigint;
  minter_id: Principal;
}
export interface UpgradeArg {
  new_minters: [] | [Array<MinterArgs>];
  update_minters: [] | [Array<UpdateMinterArgs>];
}
export interface _SERVICE {
  get_bridge_pairs: ActorMethod<[], Array<TokenPair>>;
  get_evm_token: ActorMethod<[GetEvmTokenArgs], [] | [CandidEvmToken]>;
  get_icp_token: ActorMethod<[GetIcpTokenArgs], [] | [CandidIcpToken]>;
  get_icp_tokens: ActorMethod<[], Array<CandidIcpToken>>;
  get_transaction: ActorMethod<[GetTxParams], [] | [Transaction]>;
  get_txs_by_address: ActorMethod<[string], Array<Transaction>>;
  get_txs_by_principal: ActorMethod<[Principal], Array<Transaction>>;
  icrc28_trusted_origins: ActorMethod<[], Icrc28TrustedOriginsResponse>;
  new_evm_to_icp_tx: ActorMethod<[AddEvmToIcpTx], Result>;
  new_icp_to_evm_tx: ActorMethod<[AddIcpToEvmTx], Result_1>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
