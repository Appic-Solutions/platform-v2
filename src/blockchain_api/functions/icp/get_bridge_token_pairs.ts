import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as appicHelperIdlFactory } from "@/did/appic/appic_helper.did";
import { TokenPair, Operator as BackendOperator, IcpTokenType } from "@/did/appic/appic_helper_types";
import { Response } from "@/blockchain_api/types/response";
import BigNumber from "bignumber.js";
import { EvmToken, IcpToken, Operator, BridgePair } from "../../types/tokens";

import { appic_helper_casniter_id } from "@/canister_ids.json";
import { Principal } from "@dfinity/principal";
import { get_evm_token_price } from "../evm/get_tokens_price";

export const get_bridge_pairs = async (agent: HttpAgent): Promise<Response<Array<EvmToken | IcpToken>>> => {
  const appic_actor = Actor.createActor(appicHelperIdlFactory, {
    agent,
    canisterId: Principal.fromText(appic_helper_casniter_id),
  });

  try {
    const bridge_pairs = (await appic_actor.get_bridge_pairs()) as TokenPair[];
    const transformed_bridge_pairs = await parseBridgePairs(bridge_pairs);
    return {
      result: transformed_bridge_pairs,
      message: "",
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

function parseOperator(operator: BackendOperator): Operator {
  if ("AppicMinter" in operator) {
    return "Appic";
  } else if ("DfinityCkEthMinter" in operator) {
    return "Dfinity";
  }
  throw new Error("Unknown operator");
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
          chainType: "EVM",
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
          chainType: "EVM",
          operator: parsedOperator,
          bridgePairs: [],
          usdPrice: "0",
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
        tokenType: "",
        chainType: "ICP",
        operator: parsedOperator,
        bridgePairs: [],
        usdPrice: icp_token.usd_price || "0",
      });
    }

    // Add bridge pair information
    const evmToken = tokensMap.get(evmKey) as EvmToken;
    const icpToken = tokensMap.get(icpKey) as IcpToken;

    evmToken.bridgePairs!.push({
      contract_or_cansiter_id: icpToken.canisterId!,
      chain_id: icpToken.chainId,
    });

    icpToken.bridgePairs!.push({
      contract_or_cansiter_id: evmToken.contractAddress,
      chain_id: evmToken.chainId,
    });
  }

  // Return unique tokens as an array
  return Array.from(tokensMap.values());
}
