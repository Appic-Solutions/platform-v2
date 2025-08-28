import { EvmToken, IcpToken, Operator } from '@/blockchain_api/types/tokens';
import { idlFactory as AppicHelperIdlFactory } from '@/blockchain_api/did/appic/appic_helper/appic_helper.did';
import {
	CandidDexAction,
	CandidEvmToIcp,
	CandidIcpToEvm,
	CandidPositionKey,
	CandidSwapType,
	Transaction,
} from '@/blockchain_api/did/appic/appic_helper/appic_helper_types';
import { appic_helper_canister_id } from '@/canister_ids.json';
import { parse_evm_to_icp_tx_status, parse_icp_to_evm_tx_status } from './utils/tx_status_parser';
import BigNumber from 'bignumber.js';
import { Principal } from '@dfinity/principal';
import { NATIVE_TOKEN_ADDRESS } from './get_bridge_options';
import { chains } from '@/blockchain_api/lists/chains';
import { DepositTxStatus, WithdrawalTxStatus } from './bridge_transactions';
import { Response } from '@/blockchain_api/types/response';
import { Actor, HttpAgent } from '@dfinity/agent';
import { parseOperator } from './get_bridge_token_pairs';
import { lazy } from 'react';

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
	operator: Operator;
}

export type DexHistory =
	| SwapHistory
	| CreatedPoolHistory
	| BurntPositionHistory
	| IncreasedLiquidityHistory
	| CollectedFeesHistory
	| DecreasedLiquidityHistory
	| MintedPositionHistory;

export interface SwapHistory {
	type: 'Swap';
	label: "Swap";
	id: string;
	date_object: Date;
	date: string;
	time: string;
	token_in: IcpToken;
	token_out: IcpToken;
	final_amount_in: string;
	human_readable_final_amount_in: string;
	final_amount_out: string;
	human_readable_final_amount_out: string;
	swap_type: CandidSwapType;
	timestamp: bigint;
	status: Status;
}

export interface CreatedPoolHistory {
	type: 'CreatedPool';
	label: "Created Pool";
	id: string;
	date_object: Date;
	date: string;
	time: string;
	token0: IcpToken;
	token1: IcpToken;
	pool_fee: number;
	timestamp: bigint;
	status: Status;
}

export interface BurntPositionHistory {
	type: 'BurntPosition';
	label: "Burnt Position";
	id: string;
	date_object: Date;
	date: string;
	time: string;
	token0: IcpToken;
	token1: IcpToken;
	amount0_received: string;
	human_readable_amount0_received: string;
	amount1_received: string;
	human_readable_amount1_received: string;
	liquidity: string;
	position: CandidPositionKey;
	timestamp: bigint;
	status: Status;
}

export interface IncreasedLiquidityHistory {
	type: 'IncreasedLiquidity';
	label: "Increased Liquidity";
	id: string;
	date_object: Date;
	date: string;
	time: string;
	token0: IcpToken;
	token1: IcpToken;
	amount0_paid: string;
	human_readable_amount0_paid: string;
	amount1_paid: string;
	human_readable_amount1_paid: string;
	liquidity_delta: string;
	position: CandidPositionKey;
	timestamp: bigint;
	status: Status;
}

export interface CollectedFeesHistory {
	type: 'CollectedFees';
	label: "Collected Fees";
	id: string;
	date_object: Date;
	date: string;
	time: string;
	token0: IcpToken;
	token1: IcpToken;
	amount0_collected: string;
	human_readable_amount0_collected: string;
	amount1_collected: string;
	human_readable_amount1_collected: string;
	position: CandidPositionKey;
	timestamp: bigint;
	status: Status;
}

export interface DecreasedLiquidityHistory {
	type: 'DecreasedLiquidity';
	label: 'Decreased Liquidity';
	id: string;
	date_object: Date;
	date: string;
	time: string;
	token0: IcpToken;
	token1: IcpToken;
	amount0_received: string;
	human_readable_amount0_received: string;
	amount1_received: string;
	human_readable_amount1_received: string;
	liquidity_delta: string;
	position: CandidPositionKey;
	timestamp: bigint;
	status: Status;
}

export interface MintedPositionHistory {
	type: 'MintedPosition';
	label: 'Minted Position';
	id: string;
	date_object: Date;
	date: string;
	time: string;
	token0: IcpToken;
	token1: IcpToken;
	amount0_paid: string;
	human_readable_amount0_paid: string;
	amount1_paid: string;
	human_readable_amount1_paid: string;
	liquidity: string;
	position: CandidPositionKey;
	timestamp: bigint;
	status: Status;
}

export const get_transaction_history = async (
	evm_wallet_address: string | undefined,
	principal_id: Principal | undefined,
	unauthenticated_agent: HttpAgent,
	bridge_tokens: (EvmToken | IcpToken)[],
	all_icp_tokens: IcpToken[],
): Promise<Response<{ bridge_history: BridgeHistory[]; dex_history: DexHistory[] }>> => {
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
			return {
				result: transform_txs(txs, bridge_tokens, all_icp_tokens),
				message: '',
				success: true,
			};
		} else if (evm_wallet_address) {
			const txs = (await appic_helper_actor.get_txs_by_address(
				evm_wallet_address,
			)) as Transaction[];
			return {
				result: transform_txs(txs, bridge_tokens, all_icp_tokens),
				message: '',
				success: true,
			};
		} else if (principal_id) {
			const txs = (await appic_helper_actor.get_txs_by_principal(principal_id)) as Transaction[];
			return {
				result: transform_txs(txs, bridge_tokens, all_icp_tokens),
				message: '',
				success: true,
			};
		} else {
			return {
				result: { bridge_history: [], dex_history: [] },
				message: 'At least one principal id or evm address should be provided',
				success: false,
			};
		}
	} catch (error) {
		console.error(error);
		return {
			result: { bridge_history: [], dex_history: [] },
			message: `Failed to get user transaction history ${error}`,
			success: false,
		};
	}
};

const transform_txs = (
	txs: Transaction[],
	bridge_tokens: (EvmToken | IcpToken)[],
	all_icp_tokens: IcpToken[],
): { bridge_history: BridgeHistory[]; dex_history: DexHistory[] } => {
	const bridge_txs = txs.filter(
		(tx): tx is { EvmToIcp: CandidEvmToIcp } | { IcpToEvm: CandidIcpToEvm } =>
			'EvmToIcp' in tx || 'IcpToEvm' in tx,
	);
	const bridge_history = transform_bridge_tx(bridge_txs, bridge_tokens);

	const dex: DexHistory[] = [];
	const dex_txs = txs.filter((tx): tx is { DexAction: CandidDexAction } => 'DexAction' in tx);
	for (const tx of dex_txs) {
		const action = tx.DexAction;
		let timestamp: bigint;
		let action_type: string;
		let date_object: Date;
		let date: string;
		let time: string;
		let id: string;
		const status: Status = 'Successful'; // Assuming all DEX actions in history are successful

		if ('Swap' in action) {
			action_type = 'Swap';
			timestamp = action.Swap.timestamp;
		} else if ('CreatedPool' in action) {
			action_type = 'CreatedPool';
			timestamp = action.CreatedPool.timestamp;
		} else if ('BurntPosition' in action) {
			action_type = 'BurntPosition';
			timestamp = action.BurntPosition.timestamp;
		} else if ('IncreasedLiquidity' in action) {
			action_type = 'IncreasedLiquidity';
			timestamp = action.IncreasedLiquidity.timestamp;
		} else if ('CollectedFees' in action) {
			action_type = 'CollectedFees';
			timestamp = action.CollectedFees.timestamp;
		} else if ('DecreasedLiquidity' in action) {
			action_type = 'DecreasedLiquidity';
			timestamp = action.DecreasedLiquidity.timestamp;
		} else if ('MintedPosition' in action) {
			action_type = 'MintedPosition';
			timestamp = action.MintedPosition.timestamp;
		} else {
			continue; // Unknown action, skip
		}

		const epoch = Number(timestamp / 1000000n);
		date_object = new Date(epoch);
		date = date_object.toLocaleDateString('en-GB');
		time = date_object.toLocaleTimeString();
		id = `${action_type}_${timestamp.toString()}`;

		if ('Swap' in action) {
			const swap = action.Swap;
			const token_in = find_icp_token(all_icp_tokens, swap.token_in);
			const token_out = find_icp_token(all_icp_tokens, swap.token_out);
			const final_amount_in = swap.final_amount_in.toString();
			const human_readable_final_amount_in = new BigNumber(final_amount_in)
				.dividedBy(new BigNumber(10).pow(token_in.decimals))
				.toString();
			const final_amount_out = swap.final_amount_out.toString();
			const human_readable_final_amount_out = new BigNumber(final_amount_out)
				.dividedBy(new BigNumber(10).pow(token_out.decimals))
				.toString();
			dex.push({
				type: 'Swap',
				label: "Swap",
				id,
				date_object,
				date,
				time,
				token_in,
				token_out,
				final_amount_in,
				human_readable_final_amount_in,
				final_amount_out,
				human_readable_final_amount_out,
				swap_type: swap.swap_type,
				timestamp,
				status,
			});
		} else if ('CreatedPool' in action) {
			const createdPool = action.CreatedPool;
			const token0 = find_icp_token(all_icp_tokens, createdPool.token0);
			const token1 = find_icp_token(all_icp_tokens, createdPool.token1);
			dex.push({
				type: 'CreatedPool',
				label: "Created Pool",
				id,
				date_object,
				date,
				time,
				token0,
				token1,
				pool_fee: createdPool.pool_fee,
				timestamp,
				status,
			});
		} else if ('BurntPosition' in action) {
			const burntPosition = action.BurntPosition;
			const pool_id = burntPosition.burnt_position.pool_id;
			const token0 = find_icp_token(all_icp_tokens, pool_id.token0);
			const token1 = find_icp_token(all_icp_tokens, pool_id.token1);
			const amount0_received = burntPosition.amount0_received.toString();
			const human_readable_amount0_received = new BigNumber(amount0_received)
				.dividedBy(new BigNumber(10).pow(token0.decimals))
				.toString();
			const amount1_received = burntPosition.amount1_received.toString();
			const human_readable_amount1_received = new BigNumber(amount1_received)
				.dividedBy(new BigNumber(10).pow(token1.decimals))
				.toString();
			const liquidity = burntPosition.liquidity.toString();
			dex.push({
				type: 'BurntPosition',
				label: "Burnt Position",
				id,
				date_object,
				date,
				time,
				token0,
				token1,
				amount0_received,
				human_readable_amount0_received,
				amount1_received,
				human_readable_amount1_received,
				liquidity,
				position: burntPosition.burnt_position,
				timestamp,
				status,
			});
		} else if ('IncreasedLiquidity' in action) {
			const increasedLiquidity = action.IncreasedLiquidity;
			const pool_id = increasedLiquidity.modified_position.pool_id;
			const token0 = find_icp_token(all_icp_tokens, pool_id.token0);
			const token1 = find_icp_token(all_icp_tokens, pool_id.token1);
			const amount0_paid = increasedLiquidity.amount0_paid.toString();
			const human_readable_amount0_paid = new BigNumber(amount0_paid)
				.dividedBy(new BigNumber(10).pow(token0.decimals))
				.toString();
			const amount1_paid = increasedLiquidity.amount1_paid.toString();
			const human_readable_amount1_paid = new BigNumber(amount1_paid)
				.dividedBy(new BigNumber(10).pow(token1.decimals))
				.toString();
			const liquidity_delta = increasedLiquidity.liquidity_delta.toString();
			dex.push({
				type: 'IncreasedLiquidity',
				label: "Increased Liquidity",
				id,
				date_object,
				date,
				time,
				token0,
				token1,
				amount0_paid,
				human_readable_amount0_paid,
				amount1_paid,
				human_readable_amount1_paid,
				liquidity_delta,
				position: increasedLiquidity.modified_position,
				timestamp,
				status,
			});
		} else if ('CollectedFees' in action) {
			const collectedFees = action.CollectedFees;
			const pool_id = collectedFees.position.pool_id;
			const token0 = find_icp_token(all_icp_tokens, pool_id.token0);
			const token1 = find_icp_token(all_icp_tokens, pool_id.token1);
			const amount0_collected = collectedFees.amount0_collected.toString();
			const human_readable_amount0_collected = new BigNumber(amount0_collected)
				.dividedBy(new BigNumber(10).pow(token0.decimals))
				.toString();
			const amount1_collected = collectedFees.amount1_collected.toString();
			const human_readable_amount1_collected = new BigNumber(amount1_collected)
				.dividedBy(new BigNumber(10).pow(token1.decimals))
				.toString();
			dex.push({
				type: 'CollectedFees',
				label: "Collected Fees",
				id,
				date_object,
				date,
				time,
				token0,
				token1,
				amount0_collected,
				human_readable_amount0_collected,
				amount1_collected,
				human_readable_amount1_collected,
				position: collectedFees.position,
				timestamp,
				status,
			});
		} else if ('DecreasedLiquidity' in action) {
			const decreasedLiquidity = action.DecreasedLiquidity;
			const pool_id = decreasedLiquidity.modified_position.pool_id;
			const token0 = find_icp_token(all_icp_tokens, pool_id.token0);
			const token1 = find_icp_token(all_icp_tokens, pool_id.token1);
			const amount0_received = decreasedLiquidity.amount0_received.toString();
			const human_readable_amount0_received = new BigNumber(amount0_received)
				.dividedBy(new BigNumber(10).pow(token0.decimals))
				.toString();
			const amount1_received = decreasedLiquidity.amount1_received.toString();
			const human_readable_amount1_received = new BigNumber(amount1_received)
				.dividedBy(new BigNumber(10).pow(token1.decimals))
				.toString();
			const liquidity_delta = decreasedLiquidity.liquidity_delta.toString();
			dex.push({
				type: 'DecreasedLiquidity',
				label: "Decreased Liquidity",
				id,
				date_object,
				date,
				time,
				token0,
				token1,
				amount0_received,
				human_readable_amount0_received,
				amount1_received,
				human_readable_amount1_received,
				liquidity_delta,
				position: decreasedLiquidity.modified_position,
				timestamp,
				status,
			});
		} else if ('MintedPosition' in action) {
			const mintedPosition = action.MintedPosition;
			const pool_id = mintedPosition.created_position.pool_id;
			const token0 = find_icp_token(all_icp_tokens, pool_id.token0);
			const token1 = find_icp_token(all_icp_tokens, pool_id.token1);
			const amount0_paid = mintedPosition.amount0_paid.toString();
			const human_readable_amount0_paid = new BigNumber(amount0_paid)
				.dividedBy(new BigNumber(10).pow(token0.decimals))
				.toString();
			const amount1_paid = mintedPosition.amount1_paid.toString();
			const human_readable_amount1_paid = new BigNumber(amount1_paid)
				.dividedBy(new BigNumber(10).pow(token1.decimals))
				.toString();
			const liquidity = mintedPosition.liquidity.toString();
			dex.push({
				type: 'MintedPosition',
				label: "Minted Position",
				id,
				date_object,
				date,
				time,
				token0,
				token1,
				amount0_paid,
				human_readable_amount0_paid,
				amount1_paid,
				human_readable_amount1_paid,
				liquidity,
				position: mintedPosition.created_position,
				timestamp,
				status,
			});
		}
	}

	const dex_history = dex.sort((a, b) => Number(b.timestamp - a.timestamp));

	return { bridge_history, dex_history };
};

const find_icp_token = (tokens: IcpToken[], principal: Principal): IcpToken => {
	const token = tokens.find(
		(t) => t.canisterId.toLowerCase() === principal.toString().toLowerCase(),
	);
	if (!token) {
		throw new Error(`ICP token not found for principal: ${principal.toString()}`);
	}
	return token;
};

// convert Transaction into BridgeHistory
const transform_bridge_tx = (
	txs: Transaction[],
	bridge_tokens: (EvmToken | IcpToken)[],
): BridgeHistory[] => {
	return txs
		.map((tx): BridgeHistory => {
			if ('EvmToIcp' in tx) {
				const transaction = tx.EvmToIcp;
				const id = `${transaction.transaction_hash}-${transaction.chain_id}`;
				const epoch = Math.floor(
					new BigNumber(transaction.time.toString()).dividedBy(1_000_000).toNumber(),
				);
				const date_object = new Date(epoch);
				const date = date_object.toLocaleDateString('en-GB');
				const time = date_object.toLocaleTimeString();
				const from_token = bridge_tokens.find(
					(token) =>
						token.chain_type == 'EVM' &&
						token.contractAddress == transaction.erc20_contract_address &&
						token.chainId == Number(transaction.chain_id.toString()),
				)!;
				const to_token = bridge_tokens.find(
					(token) =>
						token.chain_type == 'ICP' &&
						token.canisterId!.toLocaleLowerCase() ==
						transaction.icrc_ledger_id[0]?.toString().toLowerCase(),
				)!;
				const native_currency = bridge_tokens.find(
					(token) =>
						token.chain_type == 'EVM' &&
						token.contractAddress == NATIVE_TOKEN_ADDRESS &&
						token.chainId == Number(transaction.chain_id.toString()),
				)!;
				const tx_type = 'Deposit';
				const fee = transaction.total_gas_spent[0]?.toString() || '0';
				const human_readable_fee =
					fee == '0'
						? 'Undefined'
						: new BigNumber(fee).dividedBy(new BigNumber(10).pow(18)).toString();
				const fee_token_symbol = native_currency.symbol;
				let base_value = new BigNumber(transaction.value.toString()).toFixed();
				if (
					from_token.contractAddress == NATIVE_TOKEN_ADDRESS ||
					to_token.contractAddress == NATIVE_TOKEN_ADDRESS
				) {
					base_value = new BigNumber(base_value).plus(fee).toFixed();
				}
				const human_readable_base_value = new BigNumber(base_value)
					.dividedBy(new BigNumber(10).pow(from_token.decimals))
					.toString();
				const final_value = transaction.actual_received[0]?.toString() || '0';
				const human_readable_final_value = new BigNumber(final_value)
					.dividedBy(new BigNumber(10).pow(to_token.decimals || 0))
					.toString();
				const scanner = chains.find(
					(chain) => chain.chainId.toString() == transaction.chain_id.toString(),
				)!.scannerAddress;
				const bridge_steps = transform_tx_history_to_steps(
					tx,
					scanner,
					human_readable_final_value,
					to_token.symbol,
				);
				const bridge_status = map_tx_status_to_status(
					parse_evm_to_icp_tx_status(transaction.status),
				);
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
					operator: parseOperator(tx.EvmToIcp.operator),
				};
			} else if ('IcpToEvm' in tx) {
				const transaction = tx.IcpToEvm;
				const id = `${transaction.native_ledger_burn_index}-${transaction.chain_id}`;
				const epoch = Math.floor(
					new BigNumber(transaction.time.toString()).dividedBy(1_000_000).toNumber(),
				);
				const date_object = new Date(epoch);
				const date = date_object.toLocaleDateString('en-GB');
				const time = date_object.toLocaleTimeString();
				const from_token = bridge_tokens.find(
					(token) =>
						token.chain_type == 'ICP' &&
						token.canisterId!.toLocaleLowerCase() ==
						transaction.icrc_ledger_id[0]?.toString().toLowerCase(),
				)!;
				const to_token = bridge_tokens.find(
					(token) =>
						token.chain_type == 'EVM' &&
						token.contractAddress == transaction.erc20_contract_address &&
						token.chainId == Number(transaction.chain_id.toString()),
				)!;
				const chain = chains.find(
					(chain) => chain.chainId.toString() == transaction.chain_id.toString(),
				)!;
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
					fee == '0'
						? 'Calculating fees'
						: new BigNumber(fee).dividedBy(new BigNumber(10).pow(18)).toString();
				const fee_token_symbol = native_currency.symbol;
				const base_value = new BigNumber(transaction.withdrawal_amount.toString()).toFixed();
				const human_readable_base_value = new BigNumber(base_value)
					.dividedBy(new BigNumber(10).pow(from_token.decimals))
					.toString();
				const final_value = transaction.actual_received[0]?.toString() || '0';
				const human_readable_final_value = new BigNumber(final_value)
					.dividedBy(new BigNumber(10).pow(to_token.decimals))
					.toString();
				const scanner = chain.scannerAddress;
				const bridge_steps = transform_tx_history_to_steps(
					tx,
					scanner,
					human_readable_final_value,
					to_token.symbol,
				);
				const bridge_status = map_tx_status_to_status(
					parse_icp_to_evm_tx_status(transaction.status),
				);
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
					operator: parseOperator(tx.IcpToEvm.operator),
				};
			} else {
				throw 'Wrong Transaction type';
			}
		})
		.sort((a, b) => b.date_object.getTime() - a.date_object.getTime());
};

// Convert tx_status to BridgeStep[]
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
				return [
					steps[0],
					create_bridge_step('Successful', 'Transaction verified by minter'),
					steps[2],
				];
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
			create_bridge_step(
				'Successful',
				`Transaction submitted with Id: ${tx.IcpToEvm.native_ledger_burn_index}`,
			),
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
