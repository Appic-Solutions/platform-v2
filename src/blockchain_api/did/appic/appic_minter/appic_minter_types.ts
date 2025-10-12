import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AccessListItem {
	'storage_keys': Array<Uint8Array | number[]>,
	'address': string,
}
export interface Account {
	'owner': Principal,
	'subaccount': [] | [Uint8Array | number[]],
}
export interface ActivateSwapReqest {
	'twin_usdc_ledger_id': Principal,
	'swap_contract_address': string,
	'dex_canister_id': Principal,
	'twin_usdc_decimals': number,
	'canister_signing_fee_twin_usdc_value': bigint,
}
export interface AddErc20Token {
	'erc20_ledger_id': Principal,
	'erc20_token_symbol': string,
	'chain_id': bigint,
	'address': string,
}
export type CandidBlockTag = { 'Safe': null } |
{ 'Finalized': null } |
{ 'Latest': null };
export interface CandidTwinUsdcInfo {
	'decimals': number,
	'ledger_id': Principal,
	'address': string,
}
export interface ChainData {
	'fee_history': string,
	'latest_block_number': bigint,
	'native_token_usd_price': [] | [number],
}
export type DepositStatus = { 'Released': null } |
{ 'Minted': null } |
{ 'Accepted': null } |
{ 'InvalidDeposit': null } |
{ 'Quarantined': null };
export interface DexOrderArgs {
	'erc20_ledger_burn_index': bigint,
	'min_amount_out': bigint,
	'tx_id': string,
	'recipient': string,
	'max_gas_fee_usd': [] | [string],
	'deadline': bigint,
	'is_refund': boolean,
	'gas_limit': bigint,
	'amount_in': bigint,
	'commands': Uint8Array | number[],
	'signing_fee': [] | [string],
	'commands_data': Array<string>,
}
export type DexOrderError = { 'InvalidMaxUsdFeeAmount': string } |
{ 'UsdcAmountInTooLow': null } |
{ 'InvalidDeadline': string } |
{ 'NotEnoughGasInGasTank': { 'requested': bigint, 'available': bigint } } |
{ 'InvalidAmount': null } |
{ 'TemporarilyUnavailable': string } |
{ 'InvalidGasLimit': string } |
{ 'MaxUsdFeeTooLow': null } |
{ 'InvalidRecipient': string } |
{ 'InvalidMinAmountIn': null } |
{ 'InvalidCommand': string } |
{ 'InvalidCommandData': string };
export interface Eip1559TransactionPrice {
	'max_priority_fee_per_gas': bigint,
	'max_fee_per_gas': bigint,
	'max_transaction_fee': bigint,
	'timestamp': [] | [bigint],
	'gas_limit': bigint,
}
export interface Eip1559TransactionPriceArg { 'erc20_ledger_id': Principal }
export interface Erc20Balance {
	'balance': bigint,
	'erc20_contract_address': string,
}
export interface Erc20Token {
	'erc20_token_symbol': string,
	'erc20_contract_address': string,
	'ledger_canister_id': Principal,
}
export interface Event { 'timestamp': bigint, 'payload': EventPayload }
export type EventPayload = {
	'QuarantinedSwapRequest': {
		'erc20_ledger_burn_index': bigint,
		'min_amount_out': bigint,
		'erc20_ledger_id': Principal,
		'from': Principal,
		'recipient': string,
		'swap_contract': string,
		'swap_tx_id': string,
		'deadline': bigint,
		'created_at': bigint,
		'from_subaccount': [] | [Uint8Array | number[]],
		'withdrawal_fee': [] | [bigint],
		'erc20_amount_in': bigint,
		'max_transaction_fee': bigint,
		'l1_fee': [] | [bigint],
		'is_refund': boolean,
		'gas_limit': bigint,
		'erc20_token_in': string,
		'native_ledger_burn_index': bigint,
	}
} |
{ 'SkippedBlock': { 'block_number': bigint } } |
{
	'AcceptedErc20Deposit': {
		'principal': Principal,
		'transaction_hash': string,
		'value': bigint,
		'log_index': bigint,
		'subaccount': [] | [Uint8Array | number[]],
		'block_number': bigint,
		'erc20_contract_address': string,
		'from_address': string,
	}
} |
{
	'ReceivedSwapOrder': {
		'encoded_swap_data': string,
		'transaction_hash': string,
		'token_in': string,
		'log_index': bigint,
		'recipient': string,
		'block_number': bigint,
		'amount_out': bigint,
		'from_address': string,
		'amount_in': bigint,
		'token_out': string,
		'bridged_to_minter': boolean,
	}
} |
{
	'FailedIcrcLockRequest': {
		'to': Principal,
		'withdrawal_id': bigint,
		'reimbursed_amount': bigint,
		'to_subaccount': [] | [Uint8Array | number[]],
	}
} |
{
	'SignedTransaction': {
		'raw_transaction': string,
		'withdrawal_id': bigint,
	}
} |
{
	'ReleasedIcrcToken': {
		'transfer_fee': bigint,
		'release_block_index': bigint,
		'event_source': EventSource,
	}
} |
{
	'SwapContractActivated': {
		'twin_usdc_ledger_id': Principal,
		'usdc_contract_address': string,
		'swap_contract_address': string,
		'dex_canister_id': Principal,
		'twin_usdc_decimals': bigint,
		'canister_signing_fee_twin_usdc_value': bigint,
	}
} |
{ 'Upgrade': UpgradeArg } |
{ 'Init': InitArg } |
{ 'QuarantinedRelease': { 'event_source': EventSource } } |
{ 'AddedErc20Token': AddErc20Token } |
{ 'QuarantinedDeposit': { 'event_source': EventSource } } |
{ 'SyncedToBlock': { 'block_number': bigint } } |
{
	'AcceptedDeposit': {
		'principal': Principal,
		'transaction_hash': string,
		'value': bigint,
		'log_index': bigint,
		'subaccount': [] | [Uint8Array | number[]],
		'block_number': bigint,
		'from_address': string,
	}
} |
{
	'ReplacedTransaction': {
		'withdrawal_id': bigint,
		'transaction': UnsignedTransaction,
	}
} |
{
	'MintedToAppicDex': {
		'tx_id': string,
		'event_source': EventSource,
		'erc20_contract_address': string,
		'mint_block_index': bigint,
		'minted_token': Principal,
	}
} |
{ 'QuarantinedReimbursement': { 'index': ReimbursementIndex } } |
{
	'AcceptedSwapRequest': {
		'erc20_ledger_burn_index': bigint,
		'min_amount_out': bigint,
		'erc20_ledger_id': Principal,
		'from': Principal,
		'recipient': string,
		'swap_contract': string,
		'swap_tx_id': string,
		'deadline': bigint,
		'created_at': bigint,
		'from_subaccount': [] | [Uint8Array | number[]],
		'withdrawal_fee': [] | [bigint],
		'erc20_amount_in': bigint,
		'max_transaction_fee': bigint,
		'l1_fee': [] | [bigint],
		'is_refund': boolean,
		'gas_limit': bigint,
		'erc20_token_in': string,
		'native_ledger_burn_index': bigint,
	}
} |
{
	'DeployedWrappedIcrcToken': {
		'transaction_hash': string,
		'log_index': bigint,
		'deployed_wrapped_erc20': string,
		'block_number': bigint,
		'base_token': Principal,
	}
} |
{
	'ReimbursedNativeWithdrawal': {
		'transaction_hash': [] | [string],
		'withdrawal_id': bigint,
		'reimbursed_amount': bigint,
		'reimbursed_in_block': bigint,
	}
} |
{
	'FailedErc20WithdrawalRequest': {
		'to': Principal,
		'withdrawal_id': bigint,
		'reimbursed_amount': bigint,
		'to_subaccount': [] | [Uint8Array | number[]],
	}
} |
{
	'MintedErc20': {
		'erc20_token_symbol': string,
		'event_source': EventSource,
		'erc20_contract_address': string,
		'mint_block_index': bigint,
	}
} |
{
	'ReimbursedErc20Withdrawal': {
		'burn_in_block': bigint,
		'transaction_hash': [] | [string],
		'withdrawal_id': bigint,
		'reimbursed_amount': bigint,
		'ledger_id': Principal,
		'reimbursed_in_block': bigint,
	}
} |
{
	'ReimbursedIcrcWrap': {
		'transaction_hash': [] | [string],
		'transfer_fee': [] | [bigint],
		'reimbursed_amount': bigint,
		'lock_in_block': bigint,
		'reimbursed_icrc_token': Principal,
		'reimbursed_in_block': bigint,
		'native_ledger_burn_index': bigint,
	}
} |
{
	'NotifiedSwapEventOrderToAppicDex': {
		'tx_id': string,
		'event_source': EventSource,
	}
} |
{
	'AcceptedNativeWithdrawalRequest': {
		'ledger_burn_index': bigint,
		'destination': string,
		'withdrawal_amount': bigint,
		'from': Principal,
		'created_at': [] | [bigint],
		'from_subaccount': [] | [Uint8Array | number[]],
		'withdrawal_fee': [] | [bigint],
		'l1_fee': [] | [bigint],
	}
} |
{
	'CreatedTransaction': {
		'withdrawal_id': bigint,
		'transaction': UnsignedTransaction,
	}
} |
{ 'InvalidDeposit': { 'event_source': EventSource, 'reason': string } } |
{
	'AcceptedErc20WithdrawalRequest': {
		'erc20_ledger_burn_index': bigint,
		'destination': string,
		'withdrawal_amount': bigint,
		'erc20_ledger_id': Principal,
		'from': Principal,
		'created_at': bigint,
		'from_subaccount': [] | [Uint8Array | number[]],
		'erc20_contract_address': string,
		'withdrawal_fee': [] | [bigint],
		'max_transaction_fee': bigint,
		'l1_fee': [] | [bigint],
		'is_wrapped_mint': boolean,
		'native_ledger_burn_index': bigint,
	}
} |
{
	'GasTankUpdate': { 'native_deposited': bigint, 'usdc_withdrawn': bigint }
} |
{ 'InvalidEvent': { 'event_source': EventSource, 'reason': string } } |
{
	'FinalizedTransaction': {
		'withdrawal_id': bigint,
		'transaction_receipt': TransactionReceipt,
	}
} |
{
	'AcceptedWrappedIcrcBurn': {
		'principal': Principal,
		'transaction_hash': string,
		'value': bigint,
		'wrapped_erc20_contract_address': string,
		'log_index': bigint,
		'subaccount': [] | [Uint8Array | number[]],
		'block_number': bigint,
		'icrc_token_principal': Principal,
		'from_address': string,
	}
} |
{ 'AcceptedSwapActivationRequest': null } |
{
	'ReleasedGasFromGasTankWithUsdc': {
		'usdc_amount': bigint,
		'gas_amount': bigint,
		'swap_tx_id': string,
	}
} |
{
	'MintedNative': {
		'event_source': EventSource,
		'mint_block_index': bigint,
	}
} |
{ 'QuarantinedDexOrder': DexOrderArgs };
export interface EventSource {
	'transaction_hash': string,
	'log_index': bigint,
}
export type EvmNetwork = { 'BSC': null } |
{ 'Fantom': null } |
{ 'Base': null } |
{ 'Ethereum': null } |
{ 'BSCTestnet': null } |
{ 'ArbitrumOne': null } |
{ 'Sepolia': null } |
{ 'Polygon': null } |
{ 'Optimism': null } |
{ 'Avalanche': null };
export type FeeError = { 'TemporarilyUnavailable': string } |
{
	'InsufficientAllowance': {
		'token_symbol': string,
		'ledger_id': Principal,
		'allowance': bigint,
		'failed_transfer_amount': bigint,
	}
} |
{
	'AmountTooLow': {
		'token_symbol': string,
		'ledger_id': Principal,
		'minimum_transfer_amount': bigint,
		'failed_transfer_amount': bigint,
	}
} |
{
	'InsufficientFunds': {
		'balance': bigint,
		'token_symbol': string,
		'ledger_id': Principal,
		'failed_transfer_amount': bigint,
	}
};
export type FeeError_1 = { 'TemporarilyUnavailable': string } |
{
	'InsufficientAllowance': {
		'token_symbol': string,
		'ledger_id': Principal,
		'allowance': bigint,
		'failed_transfer_amount': bigint,
	}
} |
{
	'AmountTooLow': {
		'token_symbol': string,
		'ledger_id': Principal,
		'minimum_transfer_amount': bigint,
		'failed_transfer_amount': bigint,
	}
} |
{
	'InsufficientFunds': {
		'balance': bigint,
		'token_symbol': string,
		'ledger_id': Principal,
		'failed_transfer_amount': bigint,
	}
};
export interface GasFeeEstimate {
	'max_priority_fee_per_gas': bigint,
	'max_fee_per_gas': bigint,
	'timestamp': bigint,
}
export interface GasTankBalance {
	'native_balance': bigint,
	'usdc_balance': bigint,
}
export interface GetEventsArg { 'start': bigint, 'length': bigint }
export interface GetEventsResult {
	'total_event_count': bigint,
	'events': Array<Event>,
}
export interface Icrc28TrustedOriginsResponse {
	'trusted_origins': Array<string>,
}
export interface IcrcBalance { 'icrc_token': Principal, 'balance': bigint }
export interface InitArg {
	'last_scraped_block_number': bigint,
	'ecdsa_key_name': string,
	'next_transaction_nonce': bigint,
	'native_minimum_withdrawal_amount': bigint,
	'native_symbol': string,
	'helper_contract_address': [] | [string],
	'deposit_native_fee': bigint,
	'native_ledger_transfer_fee': bigint,
	'native_index_id': Principal,
	'withdrawal_native_fee': bigint,
	'native_ledger_id': Principal,
	'block_height': CandidBlockTag,
	'evm_network': EvmNetwork,
	'min_max_priority_fee_per_gas': bigint,
	'ledger_suite_manager_id': Principal,
}
export type LedgerError = { 'TemporarilyUnavailable': string } |
{
	'InsufficientAllowance': {
		'token_symbol': string,
		'ledger_id': Principal,
		'allowance': bigint,
		'failed_burn_amount': bigint,
	}
} |
{
	'AmountTooLow': {
		'minimum_burn_amount': bigint,
		'token_symbol': string,
		'ledger_id': Principal,
		'failed_burn_amount': bigint,
	}
} |
{
	'InsufficientFunds': {
		'balance': bigint,
		'token_symbol': string,
		'ledger_id': Principal,
		'failed_burn_amount': bigint,
	}
};
export type LedgerError_1 = { 'TemporarilyUnavailable': string } |
{
	'InsufficientAllowance': {
		'token_symbol': string,
		'ledger_id': Principal,
		'allowance': bigint,
		'failed_burn_amount': bigint,
	}
} |
{
	'AmountTooLow': {
		'minimum_burn_amount': bigint,
		'token_symbol': string,
		'ledger_id': Principal,
		'failed_burn_amount': bigint,
	}
} |
{
	'InsufficientFunds': {
		'balance': bigint,
		'token_symbol': string,
		'ledger_id': Principal,
		'failed_burn_amount': bigint,
	}
};
export type MinterArg = { 'UpgradeArg': UpgradeArg } |
{ 'InitArg': InitArg };
export interface MinterInfo {
	'icrc_balances': [] | [Array<IcrcBalance>],
	'last_scraped_block_number': [] | [bigint],
	'last_observed_block_number': [] | [bigint],
	'wrapped_icrc_tokens': [] | [Array<WrappedIcrcToken>],
	'twin_usdc_info': [] | [CandidTwinUsdcInfo],
	'swap_contract_address': [] | [string],
	'supported_erc20_tokens': [] | [Array<Erc20Token>],
	'last_native_token_usd_price_estimate': [] | [NativeTokenUsdPriceEstimate],
	'is_swapping_active': boolean,
	'helper_smart_contract_addresses': [] | [Array<string>],
	'deposit_native_fee': [] | [bigint],
	'dex_canister_id': [] | [Principal],
	'last_gas_fee_estimate': [] | [GasFeeEstimate],
	'native_twin_token_ledger_id': [] | [Principal],
	'helper_smart_contract_address': [] | [string],
	'next_swap_ledger_burn_index': [] | [bigint],
	'swap_canister_id': [] | [Principal],
	'minimum_withdrawal_amount': [] | [bigint],
	'withdrawal_native_fee': [] | [bigint],
	'gas_tank': [] | [GasTankBalance],
	'erc20_balances': [] | [Array<Erc20Balance>],
	'minter_address': [] | [string],
	'block_height': [] | [CandidBlockTag],
	'canister_signing_fee_twin_usdc_value': [] | [bigint],
	'total_collected_operation_fee': [] | [bigint],
	'native_balance': [] | [bigint],
	'ledger_suite_manager_id': [] | [Principal],
}
export interface NativeTokenUsdPriceEstimate {
	'timestamp': bigint,
	'price': string,
}
export type ReimbursementIndex = {
	'Erc20': {
		'erc20_ledger_burn_index': bigint,
		'ledger_id': Principal,
		'native_ledger_burn_index': bigint,
	}
} |
{
	'IcrcWrap': {
		'icrc_token': Principal,
		'icrc_ledger_lock_index': bigint,
		'native_ledger_burn_index': bigint,
	}
} |
{ 'Native': { 'ledger_burn_index': bigint } };
export type RequestScrapingError = { 'BlockAlreadyObserved': null } |
{ 'CalledTooManyTimes': null } |
{ 'InvalidBlockNumber': null };
export type Result = { 'Ok': null } |
{ 'Err': DexOrderError };
export type Result_1 = { 'Ok': null } |
{ 'Err': RequestScrapingError };
export type Result_2 = { 'Ok': RetrieveErc20Request } |
{ 'Err': WithdrawErc20Error };
export type Result_3 = { 'Ok': RetrieveNativeRequest } |
{ 'Err': WithdrawalError };
export type Result_4 = { 'Ok': RetrieveWrapIcrcRequest } |
{ 'Err': WrapIcrcError };
export interface RetrieveErc20Request {
	'erc20_block_index': bigint,
	'native_block_index': bigint,
}
export interface RetrieveNativeRequest { 'block_index': bigint }
export type RetrieveWithdrawalStatus = { 'NotFound': null } |
{ 'TxFinalized': TxFinalizedStatus } |
{ 'TxSent': Transaction } |
{ 'TxCreated': null } |
{ 'Pending': null };
export interface RetrieveWrapIcrcRequest {
	'icrc_block_index': bigint,
	'native_block_index': bigint,
}
export interface SwapDetails {
	'min_amount_out': bigint,
	'tx_id': string,
	'token_in': string,
	'withdrawal_id': bigint,
	'recipient': string,
	'deadline': bigint,
	'is_refund': boolean,
	'amount_in': bigint,
}
export type SwapStatus = { 'SwapTxCreated': SwapDetails } |
{ 'AcceptedSwap': null } |
{ 'SwapTxSent': Transaction } |
{ 'RefundSwapTxCreated': SwapDetails } |
{ 'MintedToAppicDex': string } |
{ 'QuarantinedSwap': null } |
{ 'RefundSwapTxFinalized': TxFinalizedStatus } |
{ 'NotifiedAppicDex': string } |
{ 'SwapTxFinalized': TxFinalizedStatus } |
{ 'PendingRefundSwap': SwapDetails } |
{ 'PendingSwap': SwapDetails } |
{ 'RefundSwapTxSent': Transaction } |
{ 'PendingFailedSwap': SwapDetails };
export interface Transaction { 'transaction_hash': string }
export interface TransactionReceipt {
	'effective_gas_price': bigint,
	'status': TransactionStatus,
	'transaction_hash': string,
	'block_hash': string,
	'block_number': bigint,
	'gas_used': bigint,
}
export type TransactionStatus = { 'Success': null } |
{ 'Failure': null };
export type TxFinalizedStatus = {
	'Success': {
		'transaction_hash': string,
		'effective_transaction_fee': [] | [bigint],
	}
} |
{
	'Reimbursed': {
		'transaction_hash': string,
		'reimbursed_amount': bigint,
		'reimbursed_in_block': bigint,
	}
} |
{ 'PendingReimbursement': Transaction };
export interface UnsignedTransaction {
	'destination': string,
	'value': bigint,
	'max_priority_fee_per_gas': bigint,
	'data': Uint8Array | number[],
	'max_fee_per_gas': bigint,
	'chain_id': bigint,
	'nonce': bigint,
	'gas_limit': bigint,
	'access_list': Array<AccessListItem>,
}
export interface UpgradeArg {
	'last_scraped_block_number': [] | [bigint],
	'next_transaction_nonce': [] | [bigint],
	'evm_rpc_id': [] | [Principal],
	'native_minimum_withdrawal_amount': [] | [bigint],
	'helper_contract_address': [] | [string],
	'deposit_native_fee': [] | [bigint],
	'native_ledger_transfer_fee': [] | [bigint],
	'withdrawal_native_fee': [] | [bigint],
	'block_height': [] | [CandidBlockTag],
	'min_max_priority_fee_per_gas': [] | [bigint],
}
export interface WithdrawErc20Arg {
	'erc20_ledger_id': Principal,
	'recipient': string,
	'amount': bigint,
}
export type WithdrawErc20Error = {
	'TokenNotSupported': { 'supported_tokens': Array<Erc20Token> }
} |
{ 'TemporarilyUnavailable': string } |
{ 'InvalidDestination': string } |
{ 'NativeLedgerError': { 'error': LedgerError } } |
{ 'NativeFeeTransferError': { 'error': FeeError } } |
{
	'Erc20LedgerError': {
		'error': LedgerError,
		'native_block_index': bigint,
	}
};
export interface WithdrawalArg { 'recipient': string, 'amount': bigint }
export interface WithdrawalDetail {
	'status': WithdrawalStatus,
	'token_symbol': string,
	'withdrawal_amount': bigint,
	'withdrawal_id': bigint,
	'from': Principal,
	'from_subaccount': [] | [Uint8Array | number[]],
	'max_transaction_fee': [] | [bigint],
	'recipient_address': string,
}
export type WithdrawalError = { 'TemporarilyUnavailable': string } |
{ 'InvalidDestination': string } |
{ 'InsufficientAllowance': { 'allowance': bigint } } |
{ 'AmountTooLow': { 'min_withdrawal_amount': bigint } } |
{ 'InsufficientFunds': { 'balance': bigint } };
export type WithdrawalSearchParameter = { 'ByRecipient': string } |
{ 'BySenderAccount': Account } |
{ 'ByWithdrawalId': bigint };
export type WithdrawalStatus = { 'TxFinalized': TxFinalizedStatus } |
{ 'TxSent': Transaction } |
{ 'TxCreated': null } |
{ 'Pending': null };
export interface WrapIcrcArg {
	'recipient': string,
	'icrc_ledger_id': Principal,
	'amount': bigint,
}
export type WrapIcrcError = { 'TransferFeeUnknow': string } |
{ 'TokenNotSupported': { 'supported_tokens': Array<WrappedIcrcToken> } } |
{ 'TemporarilyUnavailable': string } |
{ 'InvalidDestination': string } |
{ 'NativeLedgerError': { 'error': LedgerError_1 } } |
{ 'NativeFeeTransferError': { 'error': FeeError_1 } } |
{ 'AmountTooLow': null } |
{
	'IcrcLedgerError': {
		'error': LedgerError_1,
		'native_block_index': bigint,
	}
};
export interface WrappedIcrcToken {
	'deployed_wrapped_erc20': string,
	'base_token': Principal,
}
export interface _SERVICE {
	'activate_swap_feature': ActorMethod<[ActivateSwapReqest], bigint>,
	'add_erc20_token': ActorMethod<[AddErc20Token], undefined>,
	'charge_gas_tank': ActorMethod<[bigint], undefined>,
	'check_new_deposits': ActorMethod<[], undefined>,
	'dex_order': ActorMethod<[DexOrderArgs], Result>,
	'eip_1559_transaction_price': ActorMethod<
		[[] | [Eip1559TransactionPriceArg]],
		Eip1559TransactionPrice
	>,
	'get_events': ActorMethod<[GetEventsArg], GetEventsResult>,
	'get_minter_info': ActorMethod<[], MinterInfo>,
	'icrc28_trusted_origins': ActorMethod<[], Icrc28TrustedOriginsResponse>,
	'minter_address': ActorMethod<[], string>,
	'request_scraping_logs': ActorMethod<[], Result_1>,
	'retrieve_deposit_status': ActorMethod<[string], [] | [DepositStatus]>,
	'retrieve_swap_status_by_hash': ActorMethod<[string], [] | [SwapStatus]>,
	'retrieve_swap_status_by_swap_tx_id': ActorMethod<
		[string],
		[] | [SwapStatus]
	>,
	'retrieve_withdrawal_status': ActorMethod<
		[bigint],
		RetrieveWithdrawalStatus
	>,
	'smart_contract_address': ActorMethod<[], [] | [Array<string>]>,
	'update_chain_data': ActorMethod<[ChainData], undefined>,
	'withdraw_erc20': ActorMethod<[WithdrawErc20Arg], Result_2>,
	'withdraw_native_token': ActorMethod<[WithdrawalArg], Result_3>,
	'withdrawal_status': ActorMethod<
		[WithdrawalSearchParameter],
		Array<WithdrawalDetail>
	>,
	'wrap_icrc': ActorMethod<[WrapIcrcArg], Result_4>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
