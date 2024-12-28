import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as appicHelperIdlFactory } from '@/blockchain_api/did/appic/appic_helper/appic_helper.did';
import { TokenPair, Operator as BackendOperator } from '@/blockchain_api/did/appic/appic_helper/appic_helper_types';
import { Response } from '@/blockchain_api/types/response';
import BigNumber from 'bignumber.js';
import { EvmToken, IcpToken, Operator } from '../../types/tokens';

import { appic_helper_canister_id } from '@/canister_ids.json';
import { Principal } from '@dfinity/principal';
import { get_evm_token_price } from '../evm/get_tokens_price';

export const get_bridge_pairs = async (agent: HttpAgent): Promise<Response<Array<EvmToken | IcpToken>>> => {
  const appic_actor = Actor.createActor(appicHelperIdlFactory, {
    agent,
    canisterId: Principal.fromText(appic_helper_canister_id),
  });

  try {
    const bridge_pairs = (await appic_actor.get_bridge_pairs()) as TokenPair[];
    const transformed_bridge_pairs = await parseBridgePairs(bridge_pairs);
    return {
      result: transformed_bridge_pairs,
      message: '',
      success: true,
    };

    // Error handling
  } catch (error) {
    return {
      result: [],
      success: false,
      message: `Error fetching bridge pairs ${error}`,
    };
  }
};

export const get_bridge_pairs_for_token = (
  bridge_tokens: (EvmToken | IcpToken)[],
  token_id: string,
  chain_id: number,
): (EvmToken | IcpToken)[] => {
  // Find the base token by matching `token_id` with `canisterId` or `contractAddress`
  const base_token = bridge_tokens.find((token) => token.canisterId === token_id || token.contractAddress === token_id);

  if (!base_token?.bridgePairs) {
    return []; // Early exit if no base token or bridge pairs exist
  }

  // Filter bridge pairs for the specified chain_id
  const pairs = base_token.bridgePairs.filter((pair) => pair.chain_id === chain_id);

  console.log(pairs);
  console.log(chain_id);

  // Map over pairs and gather matching tokens efficiently
  const filtered_token_pairs = pairs.flatMap((pair) =>
    bridge_tokens.filter(
      (token) =>
        token.canisterId === pair.contract_or_canister_id || token.contractAddress === pair.contract_or_canister_id,
    ),
  );

  return filtered_token_pairs;
};

function parseOperator(operator: BackendOperator): Operator {
  if ('AppicMinter' in operator) {
    return 'Appic';
  } else if ('DfinityCkEthMinter' in operator) {
    return 'Dfinity';
  }
  throw new Error('Unknown operator');
}

async function parseBridgePairs(response: TokenPair[]): Promise<Array<EvmToken | IcpToken>> {
  const tokensMap = new Map<string, EvmToken | IcpToken>();

  // Use a for...of loop to handle async/await properly
  for (const pair of response) {
    console.log(pair);
    const { operator, evm_token, icp_token } = pair;

    const parsedOperator = parseOperator(operator);

    const evmKey = evm_token.erc20_contract_address;
    const icpKey = icp_token.ledger_id.toString();

    const parsed_chain_id: number = BigNumber(evm_token.chain_id.toString()).toNumber();

    // Parse EVM token
    if (!tokensMap.has(evmKey)) {
      try {
        const usd_price = await get_evm_token_price(evm_token.erc20_contract_address, parsed_chain_id);
        tokensMap.set(evmKey, {
          name: evm_token.name,
          symbol: evm_token.symbol,
          logo: evm_token.logo,
          decimals: evm_token.decimals,
          chainId: parsed_chain_id,
          contractAddress: evm_token.erc20_contract_address,
          chain_type: 'EVM',
          operator: parsedOperator,
          bridgePairs: [],
          usdPrice: usd_price.result,
        });
      } catch (error) {
        tokensMap.set(evmKey, {
          name: evm_token.name,
          symbol: evm_token.symbol,
          logo: evm_token.logo,
          decimals: evm_token.decimals,
          chainId: parsed_chain_id,
          contractAddress: evm_token.erc20_contract_address,
          chain_type: 'EVM',
          operator: parsedOperator,
          bridgePairs: [],
          usdPrice: '0',
        });
        return [];
      }
    }

    // Parse ICP token
    if (!tokensMap.has(icpKey)) {
      tokensMap.set(icpKey, {
        name: icp_token.name,
        symbol: icp_token.symbol,
        logo: icp_token.logo, // Use the same logo for both
        decimals: icp_token.decimals,
        chainId: 0, // ICP chain ID is considered 0
        canisterId: icp_token.ledger_id.toString(),
        fee: icp_token.fee.toString(),
        tokenType: '',
        chain_type: 'ICP',
        operator: parsedOperator,
        bridgePairs: [],
        usdPrice: icp_token.usd_price || '0',
      });
    }

    // Add bridge pair information
    const evmToken = tokensMap.get(evmKey) as EvmToken;
    const icpToken = tokensMap.get(icpKey) as IcpToken;

    evmToken.bridgePairs!.push({
      contract_or_canister_id: icpToken.canisterId!,
      chain_id: icpToken.chainId,
    });

    icpToken.bridgePairs!.push({
      contract_or_canister_id: evmToken.contractAddress,
      chain_id: evmToken.chainId,
    });
  }

  // Return unique tokens as an array
  return Array.from(tokensMap.values());
}
