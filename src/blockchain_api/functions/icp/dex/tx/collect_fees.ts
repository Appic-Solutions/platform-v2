import { Actor, Agent } from '@dfinity/agent';
import { appic_dex } from '@/canister_ids.json';
import { Position } from '@/blockchain_api/functions/icp/dex/get_positions';
import { Result_1 as CollectFeeResult } from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
import { idlFactory } from '@/blockchain_api/did/appic/appic_dex/appic_dex.did';
import { Response } from '@/blockchain_api/types/response';
export interface CollectFeesArgs {
  position: Position;
}

// Step one
export async function collect_fees(
  { position }: CollectFeesArgs,
  authenticated_agent: Agent,
): Promise<Response<string | undefined>> {
  const dex_actor = Actor.createActor(idlFactory, {
    agent: authenticated_agent,
    canisterId: appic_dex,
  });

  try {
    let collect_fees_result = (await dex_actor.collect_fees(position.key)) as CollectFeeResult;
    if ('Err' in collect_fees_result) {
      console.log(collect_fees_result.Err);
      return {
        message: `${collect_fees_result.Err}`,
        result: undefined,
        success: false,
      };
    }
    return {
      message: '',
      result: `${collect_fees_result.Ok}`,
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to call appic dex canister: ${error}`,
      result: undefined,
      success: false,
    };
  }
}
