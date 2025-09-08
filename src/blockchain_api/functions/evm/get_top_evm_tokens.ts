import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as appicHelperIdlFactory } from '@/blockchain_api/did/appic/appic_helper/appic_helper.did';
import {
  TopVolumeTokens,
  CandidEvmToken,
} from '@/blockchain_api/did/appic/appic_helper/appic_helper_types';
import { Response } from '@/blockchain_api/types/response';
import BigNumber from 'bignumber.js';
import { EvmToken } from '../../types/tokens';
import { get_evm_token_price } from '../evm/get_tokens_price';
import { Principal } from '@dfinity/principal';
import { appic_helper_canister_id } from '@/canister_ids.json';

export const get_top_evm_tokens = async (agent: HttpAgent): Promise<Response<EvmToken[]>> => {
  const appic_actor = Actor.createActor(appicHelperIdlFactory, {
    agent,
    canisterId: Principal.fromText(appic_helper_canister_id),
  });

  try {
    const topEvmTokens =
      (await appic_actor.get_top_100_tokens_by_volume_per_chain()) as TopVolumeTokens[];

    const transformedTokens = await parseTopTokens(topEvmTokens);

    return {
      result: transformedTokens,
      message: '',
      success: true,
    };
  } catch (error) {
    return {
      result: [],
      success: false,
      message: `Error fetching top 100 EVM tokens: ${error}`,
    };
  }
};

async function parseTopTokens(response: TopVolumeTokens[]): Promise<EvmToken[]> {
  const tokensMap = new Map<string, EvmToken>();

  // Collect all price fetch promises
  const pricePromises = response.flatMap((chainData) =>
    chainData.tokens.map(async (evmToken: CandidEvmToken) => {
      const parsedChainId: number = new BigNumber(evmToken.chain_id.toString()).toNumber();
      const usdPrice =
        evmToken.usd_price.length === 1
          ? { result: evmToken.usd_price[0], message: '', success: true }
          : await get_evm_token_price(evmToken.erc20_contract_address, parsedChainId);

      return {
        evmToken,
        chainId: parsedChainId,
        usdPrice,
      };
    }),
  );

  // Execute all price fetches in parallel
  const priceResults = await Promise.all(pricePromises);

  // Process tokens with their fetched prices
  for (const { evmToken, chainId, usdPrice } of priceResults) {
    const evmKey = `${evmToken.erc20_contract_address}-${evmToken.chain_id}`;
    // Default operator to 'Appic' since no bridge pair or operator is provided
    const operator = 'Appic';

    try {
      const finalUsdPrice = usdPrice.result === '0' ? '0' : usdPrice.result;

      // Parse EVM token
      if (!tokensMap.has(evmKey)) {
        tokensMap.set(evmKey, {
          name: evmToken.name,
          symbol: evmToken.symbol,
          logo: evmToken.logo,
          decimals: evmToken.decimals,
          chainId,
          contractAddress: evmToken.erc20_contract_address,
          chain_type: 'EVM',
          operator,
          bridgePairs: [],
          is_wrapped_icrc: evmToken.is_wrapped_icrc,
          usdPrice: finalUsdPrice,
        });
      }
    } catch (error) {
      console.error(`Error processing token ${evmKey}: ${error}`);
      continue;
    }
  }

  return Array.from(tokensMap.values()).sort((a, b) => {
    if (a.operator === 'Appic' && b.operator !== 'Appic') {
      return -1;
    }
    if (a.operator !== 'Appic' && b.operator === 'Appic') {
      return 1;
    }
    return 0;
  });
}
