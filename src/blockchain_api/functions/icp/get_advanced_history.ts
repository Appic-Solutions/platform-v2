import { Principal } from '@dfinity/principal';
import { parse_new_twin_request_status, twinLsRequest } from './utils/ls_twin_status_parser';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as AppicHelperIdlFactory } from '@/blockchain_api/did/appic/appic_helper/appic_helper.did';
import { appic_helper_canister_id } from '@/canister_ids.json';
import { CandidLedgerSuiteRequest } from '@/blockchain_api/did/appic/appic_helper/appic_helper_types';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import BigNumber from 'bignumber.js';
import { parse_candid_evm_token_to_evm_token, parse_candid_icp_token_to_icp_token } from './utils/token_parser';
import { Response } from '@/blockchain_api/types/response';
export interface NewTwinRequest {
  status: twinLsRequest;
  erc20_contract: string;
  creator: Principal;
  evm_token: EvmToken | undefined;
  date: string;
  time: string;
  date_object: Date;
  fee_charged: string;
  fee_token_symbol: string;
  human_readable_fee_charged: string;
  chain_id: number;
  icp_token: IcpToken | undefined;
}

export const get_advanced_history = async (
  principal_id: Principal,
  unauthenticated_agent: HttpAgent,
): Promise<Response<NewTwinRequest[]>> => {
  const appic_helper_actor = Actor.createActor(AppicHelperIdlFactory, {
    canisterId: Principal.fromText(appic_helper_canister_id),
    agent: unauthenticated_agent,
  });
  try {
    const requests = (await appic_helper_actor.get_erc20_twin_ls_requests_by_creator(
      principal_id,
    )) as CandidLedgerSuiteRequest[];

    return { result: transform_ls_request_response(requests), message: '', success: true };
  } catch (error) {
    console.log(error);
    console.error(error);
    return {
      result: [],
      message: `Failed to get user twin token creation history ${error}`,
      success: false,
    };
  }
};

const transform_ls_request_response = (requests: CandidLedgerSuiteRequest[]): NewTwinRequest[] => {
  const mapped_results = requests.map((request): NewTwinRequest => {
    const epoch = Math.floor(BigNumber(request.created_at.toString()).dividedBy(1_000_000).toNumber());
    const date_object = new Date(epoch);
    const date = date_object.toLocaleDateString('en-GB');
    const time = date_object.toLocaleTimeString();
    const fee_charged =
      'Icp' in request.fee_charged ? request.fee_charged.Icp.toString() : request.fee_charged.Appic.toString();
    const fee_token_symbol = 'Icp' in request.fee_charged ? 'ICP' : 'APPIC';

    const human_readable_fee_charged = BigNumber(fee_charged)
      .dividedBy(8 ** 10)
      .toFixed();
    return {
      chain_id: Number(request.chain_id.toString()),
      creator: request.creator,
      date,
      time,
      date_object,
      erc20_contract: request.erc20_contract,
      evm_token: request.evm_token.length != 0 ? parse_candid_evm_token_to_evm_token(request.evm_token[0]) : undefined,
      fee_charged: fee_charged,
      human_readable_fee_charged,
      fee_token_symbol,
      icp_token: request.icp_token.length != 0 ? parse_candid_icp_token_to_icp_token(request.icp_token[0]) : undefined,
      status: parse_new_twin_request_status(request.status),
    };
  });
  return mapped_results.sort((a, b) => b.date_object.getTime() - a.date_object.getTime());
};
