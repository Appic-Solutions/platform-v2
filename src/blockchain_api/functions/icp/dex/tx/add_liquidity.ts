import {
	IncreaseLiquidityArgs,
	Result_6 as IncreaseLiquidityResult,
} from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
import { idlFactory as appicDexIdlFactory } from '@/blockchain_api/did/appic/appic_dex/appic_dex.did';

import { idlFactory as IcrcIdlFactory } from '@/blockchain_api/did/ledger/icrc.did';
import {
	Account,
	ApproveArgs,
	Result_2 as ApprvalResult,
	Allowance,
	AllowanceArgs,
} from '@/blockchain_api/did/ledger/icrc_types';
import { Agent, HttpAgent, Actor } from '@dfinity/agent';
import { Response } from '@/blockchain_api/types/response';
import { appic_dex } from '@/canister_ids.json';
import { Principal } from '@dfinity/principal';
import { AddLiquidityArgs, generate_increase_liquidty_args } from '../add_liquidity';
import BigNumber from 'bignumber.js';

// step 1
// for minting position first we need to generate the mint_position args and then approve the token 0 and token 1 spending
export async function generate_args_and_approve_add_liquidity(
	args: AddLiquidityArgs,
	authenticated_agent: Agent, // HttpAgent , Agent
	unauthenticated_agent: HttpAgent,
): Promise<Response<IncreaseLiquidityArgs | undefined>> {
	let { increase_liquidty_args, token1_approval_amount, token0_approval_amount } =
		generate_increase_liquidty_args(args);


	// approval tx
	const token0_actor = Actor.createActor(IcrcIdlFactory, {
		agent: authenticated_agent,
		canisterId: increase_liquidty_args.pool.token0,
	});

	const token0_actor_unauthenticated = Actor.createActor(IcrcIdlFactory, {
		agent: unauthenticated_agent,
		canisterId: increase_liquidty_args.pool.token0,
	});

	const token1_actor = Actor.createActor(IcrcIdlFactory, {
		agent: authenticated_agent,
		canisterId: increase_liquidty_args.pool.token1,
	});

	const token1_actor_unauthenticated = Actor.createActor(IcrcIdlFactory, {
		agent: unauthenticated_agent,
		canisterId: increase_liquidty_args.pool.token1,
	});

	try {
		const sender_principal = await authenticated_agent.getPrincipal();

		// Check the allowances
		const token0_allowance = (await token0_actor_unauthenticated.icrc2_allowance({
			account: {
				owner: sender_principal,
				subaccount: [],
			},
			spender: { owner: Principal.fromText(appic_dex), subaccount: [] },
		} as AllowanceArgs)) as Allowance;

		const token1_allowance = (await token1_actor_unauthenticated.icrc2_allowance({
			account: {
				owner: sender_principal,
				subaccount: [],
			},
			spender: { owner: Principal.fromText(appic_dex), subaccount: [] },
		} as AllowanceArgs)) as Allowance;

		// Check if  appic dex alread has enough allowance
		//
		// token0
		if (
			BigNumber(token0_allowance.allowance.toString()).isLessThan(BigNumber(token0_approval_amount))
		) {
			// In case of Native withdrawal
			const token0_approval_result = (await token0_actor.icrc2_approve({
				amount: BigInt(new BigNumber(token0_approval_amount).toString()),
				created_at_time: [],
				expected_allowance: [],
				expires_at: [],
				fee: [],
				from_subaccount: [],
				memo: [],
				spender: { owner: Principal.fromText(appic_dex), subaccount: [] } as Account,
			} as ApproveArgs)) as ApprvalResult;

			if ('Err' in token0_approval_result) {
				return {
					result: undefined,
					success: false,
					message: `Failed to approve allowance:${token0_approval_result.Err}`,
				};
			}
		}

		// token1
		if (
			BigNumber(token1_allowance.allowance.toString()).isLessThan(BigNumber(token1_approval_amount))
		) {
			// In case of Native withdrawal
			const token1_approval_result = (await token1_actor.icrc2_approve({
				amount: BigInt(new BigNumber(token1_approval_amount).toString()),
				created_at_time: [],
				expected_allowance: [],
				expires_at: [],
				fee: [],
				from_subaccount: [],
				memo: [],
				spender: { owner: Principal.fromText(appic_dex), subaccount: [] } as Account,
			} as ApproveArgs)) as ApprvalResult;

			if ('Err' in token1_approval_result) {
				return {
					result: undefined,
					success: false,
					message: `Failed to approve allowance:${token1_approval_result.Err}`,
				};
			}
		}

		return {
			success: true,
			result: increase_liquidty_args,
			message: '',
		};
	} catch (error) {

		console.log(error);
		return {
			success: false,
			result: undefined,
			message: `Failed to approve token spendings, please try again later. ${error}`,
		};
	}
}

// Step 2 increase liquidty(add liquidty)
export async function increase_liquidity(
	args: IncreaseLiquidityArgs,
	authenticated_agent: Agent,
): Promise<Response<string | undefined>> {
	const dex_actor = Actor.createActor(appicDexIdlFactory, {
		agent: authenticated_agent,
		canisterId: appic_dex,
	});

	try {
		let increase_liquidity_result = (await dex_actor.increase_liquidity(
			args as IncreaseLiquidityArgs,
		)) as IncreaseLiquidityResult;
		if ('Err' in increase_liquidity_result) {
			console.log(increase_liquidity_result.Err);
			return {
				message: `${increase_liquidity_result.Err}`,
				result: undefined,
				success: false,
			};
		} else {
			return {
				result: '',
				success: true,
				message: 'success',
			};
		}
	} catch (error) {
		console.log(error);
		return {
			message: `Failed to increase liquidty: ${error}`,
			result: undefined,
			success: false,
		};
	}
}
