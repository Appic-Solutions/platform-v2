// import { Actor, Agent } from '@dfinity/agent';
// import { appic_dex } from '@/canister_ids.json';
// import { Result_1 as CollectFeeResult, Balance } from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
// import { idlFactory } from '@/blockchain_api/did/appic/appic_dex/appic_dex.did';
// import { Response } from '@/blockchain_api/types/response';
// import { IcpToken } from '@/blockchain_api/types/tokens';
// import { Principal } from '@dfinity/principal';
//
// // export interface WithdrawFundsArgs {
// // 	token: IcpToken,
// // 	amount: string,
// // }
// //
// //
// // // Step one
// // export async function withdraw_funds_from_appic_dex(
// // 	all_icp_tokens: IcpToken[],
// // 	authenticated_agent: Agent,
// // ): Promise<Response<string | undefined>> {
// // 	const dex_actor = Actor.createActor(idlFactory, {
// // 		agent: authenticated_agent,
// // 		canisterId: appic_dex,
// // 	});
// //
// // 	try {
// // 	let user_principal = authenticated_agent.getPrincipal();
// // 		let user_balances_result= (await dex_actor.withdraw({ amount: BigInt(withdraw_amount), token: Principal.fromText(token.canisterId) } as Balance)) as CollectFeeResult;
// // 		if ('Err' in withdraw_result) {
// // 			console.log(withdraw_result.Err);
// // 			return {
// // 				message: `${withdraw_result.Err}`,
// // 				result: undefined,
// // 				success: false,
// // 			};
// // 		}
// // 		return {
// // 			message: '',
// // 			result: `${withdraw_result.Ok}`,
// // 			success: true,
// // 		};
// // 	} catch (error) {
// // 		return {
// // 			message: `Failed to call appic dex canister: ${error}`,
// // 			result: undefined,
// // 			success: false,
// // 		};
// // 	}
// // }
