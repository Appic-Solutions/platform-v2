// The flow of a new twin token create is as follow

import { get_evm_token_info } from '../evm/get_evm_token';
import { CandidEvmToken } from '@/blockchain_api/did/appic/appic_helper/appic_helper_types';
import { Response } from '@/blockchain_api/types/response';
import { Actor, HttpAgent, Agent } from '@dfinity/agent';
import { idlFactory as IcrcIdlFactory } from '@/blockchain_api/did/ledger/icrc.did';
import { idlFactory as lsmIdlFactory } from '@/blockchain_api/did/appic/lsm/lsm.did';
import {
	AddErc20Arg,
	Result,
	Erc20Contract,
	ManagedCanisterIds,
	LedgerManagerInfo,
} from '@/blockchain_api/did/appic/lsm/lsm_types';

import { Account, ApproveArgs, Result_2 } from '@/blockchain_api/did/ledger/icrc_types';
import { icp_ledger, lsm_ledger_id } from '@/canister_ids.json';
import BigNumber from 'bignumber.js';
import { Principal } from '@dfinity/principal';
import { convert_png_to_data_uri } from '@/blockchain_api/utils/png_to_data_uri';
import {
	generate_twin_token_symbol,
	generate_twin_token_transfer_fee,
} from './generate_new_twin_token_symbol';
import { Chain } from '@/blockchain_api/types/chains';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { encode_deploy_erc20_function_data, get_gas_price } from './get_bridge_options';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { principal_to_bytes32 } from './utils/principal_to_hex';


const erc20_deployment_gas_limit = 1_300_000;

const icp_transfer_fee = 10_000;

// 1st: Find the base token information from the appic helper canister or icrc token metadata
// 2nd: Approve icp spending for lsm canister
// 3rd: request a new twin token through lsm
// 4th: wait until the twin token is created(this step should be called on a minute interval basis)

export interface NewTwinMetadata {
	base_token: IcpToken | CandidEvmToken;
	twin_token: {
		decimals: number;
		logo: string;
		name: string;
		symbol: string;
		transfer_fee: string;
		human_readable_transfer_fee: string;
	};
	base_chain: Chain,
	twin_chain: Chain,
	creation_fee: string;
	creation_fee_token: string;
	creation_fee_token_address: string;
	human_readable_creation_fee: string;
	max_fee_per_gas: string;
	max_priority_fee_per_gas: string;
}

// Step 1, get the target evm token
// Requires chain_id and contract address
export const get_evm_token_and_generate_twin_token = async (
	base_chain: Chain,
	twin_chain: Chain,
	canister_id_or_token_address: string,
	unauthenticated_agent: HttpAgent,
	all_icp_tokens: IcpToken[]
): Promise<Response<NewTwinMetadata | undefined>> => {


	const lsm_actor = Actor.createActor(lsmIdlFactory, {
		agent: unauthenticated_agent,
		canisterId: lsm_ledger_id,
	});

	try {
		if (base_chain.type == "EVM") {
			if (twin_chain.type != "ICP") throw "EVM tokens can only be wrapped on ICP";

			const lsm_info = (await lsm_actor.get_lsm_info()) as LedgerManagerInfo;
			const creation_fee = new BigNumber(lsm_info.ls_creation_icp_fee.toString()).plus(
				icp_transfer_fee * 2,
			);
			const human_readable_creation_fee = creation_fee.dividedBy(10 ** 8).toFixed();
			const evm_token_result = await get_evm_token_info(
				canister_id_or_token_address,
				twin_chain.chainId.toString(),
				unauthenticated_agent,
			);
			if (evm_token_result.result.length == 0) {
				return {
					message: 'No evm token available for provided info',
					result: undefined,
					success: false,
				};
			}

			// Generating icp twin side info
			const candid_evm_token = evm_token_result.result[0];

			const logo = await convert_png_to_data_uri(candid_evm_token.logo);
			const symbol = await generate_twin_token_symbol(
				candid_evm_token.symbol,
				Number(candid_evm_token.chain_id.toString()),
			);

			const transfer_fee = await generate_twin_token_transfer_fee(candid_evm_token);

			const name = `${candid_evm_token.name} on ICP`;
			const human_readable_transfer_fee = new BigNumber(transfer_fee)
				.dividedBy(10 ** candid_evm_token.decimals)
				.toFixed();

			return {
				message: '',
				result: {
					base_token: candid_evm_token,
					twin_token: {
						decimals: candid_evm_token.decimals,
						logo,
						name,
						symbol,
						human_readable_transfer_fee,
						transfer_fee,
					},
					base_chain,
					twin_chain,
					creation_fee_token: "ICP",
					creation_fee: creation_fee.toFixed(),
					human_readable_creation_fee,
					creation_fee_token_address: "ryjl3-tyaaa-aaaaa-aaaba-cai",
					max_fee_per_gas: "0",
					max_priority_fee_per_gas: "0"
				},
				success: true,
			}

		} else {

			let icp_topken = all_icp_tokens.find(token => token.canisterId == canister_id_or_token_address);
			if (typeof icp_topken == undefined) {
				throw "Failed to find ICP token for canister_id";
			} else {

			}

			let creation_fee_token = twin_chain.nativeTokenSymbol;
			const { max_fee_per_gas, max_priority_fee_per_gas } = await get_gas_price(
				twin_chain.viem_config!,
				twin_chain.rpc_url,
			);

			let creation_fee = new BigNumber(erc20_deployment_gas_limit).multipliedBy(max_fee_per_gas).toFixed();
			let human_readable_creation_fee = BigNumber(creation_fee).dividedBy(BigNumber(10).pow(18));


			return {
				message: '',
				result: {
					base_token: icp_topken!,
					twin_token: {
						decimals: icp_topken!.decimals,
						logo: icp_topken!.logo,
						name: icp_topken!.name,
						symbol: icp_topken!.symbol,
						human_readable_transfer_fee: "0",
						transfer_fee: "0",
					},
					base_chain,
					twin_chain,
					creation_fee_token,
					creation_fee: creation_fee,
					human_readable_creation_fee: human_readable_creation_fee.toFixed(),
					creation_fee_token_address: creation_fee_token,
					max_fee_per_gas,
					max_priority_fee_per_gas
				},
				success: true,

			}

		}

	} catch (error) {
		return {
			message: `${error}`,
			result: undefined,
			success: false,
		};
	}
};






// Step 2
export const approve_icp_or_native_token = async (
	new_twin_metadata: NewTwinMetadata,
	authenticated_agent: Agent,
): Promise<Response<string>> => {
	try {

		if (new_twin_metadata.base_chain.type == "EVM") {
			const icp_actor = Actor.createActor(IcrcIdlFactory, {
				agent: authenticated_agent,
				canisterId: icp_ledger,
			});
			console.log(authenticated_agent.getPrincipal());
			const icp_approve_result = (await icp_actor.icrc2_approve({
				amount: BigInt(new_twin_metadata.creation_fee),
				created_at_time: [],
				expected_allowance: [],
				expires_at: [],
				fee: [],
				from_subaccount: [],
				memo: [],
				spender: { owner: Principal.fromText(lsm_ledger_id), subaccount: [] } as Account,
			} as ApproveArgs)) as Result_2;

			if ('Ok' in icp_approve_result) {
				return { result: icp_approve_result.Ok.toString(), success: true, message: '' };
			} else {
				console.log(JSON.stringify(icp_approve_result.Err));
				return {
					result: '',
					success: false,
					message: `Failed to approve allowance:${JSON.stringify(icp_approve_result.Err)}`,
				};
			}
		}
		else {
			return { result: '', success: true, message: '' };
		}

	} catch (error) {
		console.log(error);
		return {
			result: '',
			success: false,
			message: `Failed to approve allowance:${JSON.stringify(error)}`,
		};
	}
};

// Step 3
export const request_new_twin = async (
	new_twin_metadata: NewTwinMetadata,
	authenticated_agent: Agent,
): Promise<Response<string>> => {


	try {
		if (new_twin_metadata.base_chain.type == "EVM") {
			const lsm_actor = Actor.createActor(lsmIdlFactory, {
				agent: authenticated_agent,
				canisterId: lsm_ledger_id,
			});
			let base_token = new_twin_metadata.base_token as CandidEvmToken;

			const new_lsm_twin_args = {
				contract: {
					address: base_token.erc20_contract_address,
					chain_id: base_token.chain_id,
				},
				ledger_init_arg: {
					decimals: new_twin_metadata.twin_token.decimals,
					token_logo: new_twin_metadata.twin_token.logo,
					token_name: new_twin_metadata.twin_token.name,
					token_symbol: new_twin_metadata.twin_token.symbol,
					transfer_fee: BigInt(new_twin_metadata.twin_token.transfer_fee),
				},
			} as AddErc20Arg;

			const new_lsm_twin_result = (await lsm_actor.add_erc20_ls(new_lsm_twin_args)) as Result;

			if ('Ok' in new_lsm_twin_result) {
				return { result: 'Successful', success: true, message: '' };
			} else {
				return {
					result: '',
					success: false,
					message: `Failed to submit a request for new ledger suite:${JSON.stringify(new_lsm_twin_result.Err)}`,
				};
			}
		} else {
			const ethereum = (window as any).ethereum;

			if (!ethereum) {
				throw new Error('MetaMask is not installed or ethereum object is not available');
			}
			const walletClient = createWalletClient({
				transport: custom(ethereum!),
			});



			//await walletClient.addChain({ chain: bridge_option.viem_chain });

			await walletClient.switchChain({ id: new_twin_metadata.twin_chain.chainId });
			// const addresses = await walletClient.requestAddresses();
			let base_token = new_twin_metadata.base_token as IcpToken;
			let base_token_bytes = principal_to_bytes32(base_token.canisterId);

			let encoded_data = encode_deploy_erc20_function_data(base_token.name, base_token.symbol, base_token.decimals, base_token_bytes);

			const [account] = await walletClient.getAddresses();



			const prepared_transaction = await walletClient.prepareTransactionRequest({
				chain: new_twin_metadata.twin_chain.viem_config,
				account: account as `0x${string}`,
				to: new_twin_metadata.twin_chain.appic_deposit_helper_contract_v2 as `0x${string}`,
				data: encoded_data as `0x${string}`,
				// maxFeePerGas: BigInt(bridge_option.fees.max_fee_per_gas),
				// maxPriorityFeePerGas:BigInt(bridge_option.fees.max)
				maxFeePerGas: BigInt(new_twin_metadata.max_fee_per_gas),
				maxPriorityFeePerGas: BigInt(new_twin_metadata.max_priority_fee_per_gas),
				gas: BigInt(erc20_deployment_gas_limit),
				value: BigInt(0),
				type: 'eip1559',
			});

			const hash = await walletClient.sendTransaction({
				account: account,
				...prepared_transaction,
			});

			const public_client = createPublicClient({
				transport: http(new_twin_metadata.twin_chain.rpc_url),
				chain: new_twin_metadata.twin_chain.viem_config,
			});

			// TODO: to be changed later
			const confirmations_required = 1;

			const tx_status = await public_client.waitForTransactionReceipt({
				hash,
				confirmations: confirmations_required,
			});

			if (tx_status.status == 'success') {
				return {
					result: hash,
					message: 'Failed to request deposit',
					success: true,
				};
			} else {
				return {
					result: hash,
					message: '',
					success: false,
				};
			}

		}
	} catch (error) {
		return {
			result: '',
			success: false,
			message: `Failed to submit a request for new ledger suite:${JSON.stringify(error)}`,
		};
	}
};

// Step 4
// Check the status for new ls
// Should be called on a 1 min interval basis
// Step 3
export const check_new_twin_ls_request = async (
	new_twin_metadata: NewTwinMetadata,
	unauthenticated_agent: HttpAgent,
): Promise<Response<string>> => {
	const lsm_actor = Actor.createActor(lsmIdlFactory, {
		agent: unauthenticated_agent,
		canisterId: lsm_ledger_id,
	});
	try {
		if (new_twin_metadata.base_chain.type == "EVM") {
			let base_token = new_twin_metadata.base_token as CandidEvmToken;
			const erc2_contract = {
				address: base_token.erc20_contract_address,
				chain_id: base_token.chain_id,
			} as Erc20Contract;

			const new_lsm_twin_status = (await lsm_actor.twin_canister_ids_by_contract(erc2_contract)) as
				| []
				| [ManagedCanisterIds];

			if (new_lsm_twin_status.length != 0) {
				return { result: 'Successfully created a new ledger suite', success: true, message: '' };
			} else {
				return {
					result: '',
					success: false,
					message: `Could not find any ls related to the request`,
				};
			}
		} else {
			return { result: 'Successfully new twin token for the icp token', success: true, message: '' };
		}
	} catch (error) {
		return {
			result: '',
			success: false,
			message: `Could not find any ls related to the request ${error}`,
		};
	}
};
