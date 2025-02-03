import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as AppicHelperIdlFactory } from '@/blockchain_api/did/appic/appic_helper/appic_helper.did';
import { CandidEvmToken, GetEvmTokenArgs } from '@/blockchain_api/did/appic/appic_helper/appic_helper_types';
import { appic_helper_canister_id } from '@/canister_ids.json';
import { Principal } from '@dfinity/principal';
import { Response } from '@/blockchain_api/types/response';

export const get_evm_token_info = async (
  token_address: string,
  chain_id: string,
  unauthenticated_agent: HttpAgent,
): Promise<Response<CandidEvmToken[]>> => {
  const appic_helper_actor = Actor.createActor(AppicHelperIdlFactory, {
    canisterId: Principal.fromText(appic_helper_canister_id),
    agent: unauthenticated_agent,
  });

  const evm_token = (await appic_helper_actor.get_evm_token({
    chain_id: BigInt(chain_id),
    address: token_address,
  } as GetEvmTokenArgs)) as [] | [CandidEvmToken];

  if (evm_token.length == 0) {
    return {
      message: 'Token not found',
      result: [],
      success: false,
    };
  } else {
    return {
      message: '',
      result: evm_token,
      success: true,
    };
  }
};
