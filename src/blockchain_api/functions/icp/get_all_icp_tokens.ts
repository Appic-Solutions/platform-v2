import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { Response } from '@/blockchain_api/types/response';
// Appic helper types and did
import { idlFactory as AppicIdlFactory } from '@/blockchain_api/did/appic/appic_helper/appic_helper.did';
import { CandidIcpToken, IcpTokenType } from '@/blockchain_api/did/appic/appic_helper/appic_helper_types';

import BigNumber from 'bignumber.js';

import { IcpToken } from '@/blockchain_api/types/tokens';

import { appic_helper_canister_id } from '@/canister_ids.json';

// The flow is as follow
// 1: The validated tokens are fetched from appic helper canister(Appic helper makes sure that the token canister exists and validates their wasm module)
// 2: The response is transformed into icp token interface

// Step 1
// Get valid appic tokens
export const get_icp_tokens = async (agent: HttpAgent): Promise<Response<IcpToken[]>> => {
  const appic_actor = Actor.createActor(AppicIdlFactory, {
    agent,
    canisterId: Principal.fromText(appic_helper_canister_id),
  });

  try {
    const validated_icp_tokens = (await appic_actor.get_icp_tokens()) as CandidIcpToken[];

    return {
      result: transform_icp_tokens(validated_icp_tokens),
      success: true,
      message: '',
    };

    // Error handling
  } catch (error) {
    return {
      result: [],
      message: `Error fetching icp token list, ${error}`,
      success: false,
    };
  }
};

// Step 2.1 Helper function
// transform response into icp response
export const transform_icp_tokens = (icp_tokens: CandidIcpToken[]): IcpToken[] => {
  return icp_tokens
    .filter((token) => BigNumber(token.usd_price).isGreaterThan(0) || token.rank.length == 1) // Match by canisterId/address
    .map((token) => {
      return {
        name: token.name,
        symbol: token.symbol,
        logo: token.logo,
        usdPrice: token.usd_price,
        decimals: token.decimals,
        chainId: 0, // Chain ID for ICP
        chain_type: 'ICP', // Chain type is ICP
        canisterId: token.ledger_id.toString(),
        fee: BigNumber(token.fee.toString()).toString(),
        tokenType: parse_token_type(token.token_type),
        balance: undefined, // Optional, can be added later
        balanceRawInteger: undefined,
        usdBalance: undefined, // Optional, can be added later
      };
    });
};

// Helper converts token_type into supported token_type
export const parse_token_type = (type: IcpTokenType): string => {
  if ('ICRC1' in type) {
    return 'ICRC1';
  } else if ('ICRC2' in type) {
    return 'ICRC2';
  } else if ('ICRC3' in type) {
    return 'ICRC2';
  } else if ('DIP20' in type) {
    return 'DIP20';
  } else {
    return 'Not Supported';
  }
};
