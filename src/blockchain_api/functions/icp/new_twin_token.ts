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
import { generate_twin_token_symbol } from './generate_new_twin_token_symbol';

// 1st: Find the base token information from the appic helper contract
// 2nd: Approve icp spending for lsm canister
// 3rd: request a new twin token through lsm
// 4th: wait until the twin token is created(this step should be called on a minute interval basis)

export interface NewTwinMetadata {
  evm_base_token: CandidEvmToken;
  icp_twin_token: {
    decimals: number;
    logo: string;
    name: string;
    chain_id: number;
    symbol: string;
    transfer_fee: string;
    human_readable_transfer_fee: string;
  };
  creation_fee: string;
  human_readable_creation_fee: string;
}

// Step 1, get the target evm token
// Requires chain_id and contract address
export const get_evm_token_and_generate_twin_token = async (
  chain_id: string,
  contract_address: string,
  transfer_fee: string,
  unauthenticated_agent: HttpAgent,
): Promise<Response<NewTwinMetadata | undefined>> => {
  const lsm_actor = Actor.createActor(lsmIdlFactory, {
    agent: unauthenticated_agent,
    canisterId: lsm_ledger_id,
  });
  try {
    const lsm_info = (await lsm_actor.get_lsm_info()) as LedgerManagerInfo;
    const creation_fee = BigNumber(lsm_info.ls_creation_icp_fee.toString());
    const human_readable_creation_fee = creation_fee.dividedBy(10 ** 8).toFixed();
    const evm_token_result = await get_evm_token_info(contract_address, chain_id, unauthenticated_agent);

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
    const human_readable_transfer_fee = transfer_fee;
    const transfer_fee_with_decimals = BigNumber(human_readable_transfer_fee)
      .multipliedBy(10 ** candid_evm_token.decimals)
      .toFixed();
    return {
      message: '',
      result: {
        evm_base_token: candid_evm_token,
        creation_fee: creation_fee.toFixed(),
        human_readable_creation_fee,
        icp_twin_token: {
          chain_id: 0,
          decimals: candid_evm_token.decimals,
          logo,
          name: symbol,
          symbol,
          human_readable_transfer_fee,
          transfer_fee: transfer_fee_with_decimals,
        },
      },
      success: true,
    };
  } catch (error) {
    return {
      message: `${error}`,
      result: undefined,
      success: false,
    };
  }
};

// Step 2
export const approve_icp = async (
  new_twin_metadata: NewTwinMetadata,
  authenticated_agent: Agent,
): Promise<Response<string>> => {
  const icp_actor = Actor.createActor(IcrcIdlFactory, {
    agent: authenticated_agent,
    canisterId: icp_ledger,
  });

  try {
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
      return {
        result: '',
        success: false,
        message: `Failed to approve allowance:${JSON.stringify(icp_approve_result.Err)}`,
      };
    }
  } catch (error) {
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
  const lsm_actor = Actor.createActor(lsmIdlFactory, {
    agent: authenticated_agent,
    canisterId: lsm_ledger_id,
  });
  try {
    const new_lsm_twin_args = {
      contract: {
        address: new_twin_metadata.evm_base_token.erc20_contract_address,
        chain_id: new_twin_metadata.evm_base_token.chain_id,
      },
      ledger_init_arg: {
        decimals: new_twin_metadata.evm_base_token.decimals,
        token_logo: new_twin_metadata.icp_twin_token.logo,
        token_name: new_twin_metadata.icp_twin_token.name,
        token_symbol: new_twin_metadata.icp_twin_token.symbol,
        transfer_fee: BigInt(new_twin_metadata.icp_twin_token.transfer_fee),
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
  authenticated_agent: Agent,
): Promise<Response<string>> => {
  const lsm_actor = Actor.createActor(lsmIdlFactory, {
    agent: authenticated_agent,
    canisterId: lsm_ledger_id,
  });
  try {
    const erc2_contract = {
      address: new_twin_metadata.evm_base_token.erc20_contract_address,
      chain_id: new_twin_metadata.evm_base_token.chain_id,
    } as Erc20Contract;

    const new_lsm_twin_status = (await lsm_actor.add_erc20_ls(erc2_contract)) as [] | [ManagedCanisterIds];

    if (new_lsm_twin_status.length != 0) {
      return { result: 'Successfully created a new ledger suite', success: true, message: '' };
    } else {
      return {
        result: '',
        success: false,
        message: `Could not find any ls related to the request`,
      };
    }
  } catch (error) {
    return {
      result: '',
      success: false,
      message: `Could not find any ls related to the request ${error}`,
    };
  }
};
