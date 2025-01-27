// The flow of a new twin token create is as follow

import { get_evm_token_info } from '../../evm/get_evm_token';
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
import { generate_twin_token_symbol, generate_twin_token_transfer_fee } from '../generate_new_twin_token_symbol';

const icp_transfer_fee = 10_000;

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
  icp_canister_id: string;
}

// Step 1, get the target evm token
// Requires chain_id and contract address
export const get_evm_token_and_generate_twin_token_success = async (
  chain_id: string,
  contract_address: string,
  unauthenticated_agent: HttpAgent,
): Promise<Response<NewTwinMetadata | undefined>> => {
  try {
    return {
      message: '',
      result: {
        evm_base_token: {
          chain_id: BigInt(56),
          decimals: 18,
          erc20_contract_address: '0x55d398326f99059fF775485246999027B3197955',
          logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
          name: 'USD Tether',
          symbol: 'USDT',
        },
        creation_fee: '3000000000',
        human_readable_creation_fee: '30',
        icp_canister_id: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
        icp_twin_token: {
          chain_id: 0,
          decimals: 18,
          logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
          name: 'icUSDT.bsc',
          symbol: 'icUSDT.bsc',
          human_readable_transfer_fee: '0.01',
          transfer_fee: '10000000000000000',
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

// Step 1, get the target evm token
// Requires chain_id and contract address
export const get_evm_token_and_generate_twin_token_failed = async (
  chain_id: string,
  contract_address: string,
  unauthenticated_agent: HttpAgent,
): Promise<Response<NewTwinMetadata | undefined>> => {
  try {
    return {
      message: 'No evm token available for provided info',
      result: undefined,
      success: false,
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
export const approve_icp_success = async (
  new_twin_metadata: NewTwinMetadata,
  authenticated_agent: Agent,
): Promise<Response<string>> => {
  const icp_actor = Actor.createActor(IcrcIdlFactory, {
    agent: authenticated_agent,
    canisterId: icp_ledger,
  });
  console.log(authenticated_agent.getPrincipal());

  return { result: 'Ok', success: true, message: '' };
};

// Step 2
export const approve_icp_fail = async (
  new_twin_metadata: NewTwinMetadata,
  authenticated_agent: Agent,
): Promise<Response<string>> => {
  const icp_actor = Actor.createActor(IcrcIdlFactory, {
    agent: authenticated_agent,
    canisterId: icp_ledger,
  });
  console.log(authenticated_agent.getPrincipal());

  return { result: 'Failed to approve', success: false, message: '' };
};

// Step 3
export const request_new_twin_success = async (
  new_twin_metadata: NewTwinMetadata,
  authenticated_agent: Agent,
): Promise<Response<string>> => {
  return { result: 'Successful', success: true, message: '' };
};

// Step 3
export const request_new_twin_fail = async (
  new_twin_metadata: NewTwinMetadata,
  authenticated_agent: Agent,
): Promise<Response<string>> => {
  return {
    result: '',
    success: false,
    message: `Failed to submit a request for new ledger suite:${JSON.stringify(new_lsm_twin_result.Err)}`,
  };
};

// Step 4
// Check the status for new ls
// Should be called on a 1 min interval basis
// Step 3
export const check_new_twin_ls_request_success = async (
  new_twin_metadata: NewTwinMetadata,
  unauthenticated_agent: HttpAgent,
): Promise<Response<string>> => {
  const lsm_actor = Actor.createActor(lsmIdlFactory, {
    agent: unauthenticated_agent,
    canisterId: lsm_ledger_id,
  });

  return { result: 'Successfully created a new ledger suite', success: true, message: '' };
};

// Step 4
// Check the status for new ls
// Should be called on a 1 min interval basis
// Step 3
export const check_new_twin_ls_request_pending = async (
  new_twin_metadata: NewTwinMetadata,
  unauthenticated_agent: HttpAgent,
): Promise<Response<string>> => {
  const lsm_actor = Actor.createActor(lsmIdlFactory, {
    agent: unauthenticated_agent,
    canisterId: lsm_ledger_id,
  });

  return {
    result: '',
    success: false,
    message: `Could not find any ls related to the request`,
  };
};
