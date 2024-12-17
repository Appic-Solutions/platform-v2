import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as appicHelperIdlFactory } from "@/did/appic/appic_helper.did";
import { TokenPair, Operator as BackendOperator, IcpTokenType } from "@/did/appic/appic_helper_types";

import BigNumber from "bignumber.js";
import { EvmToken, IcpToken, Operator, BridgePair } from "../../types/tokens";

import { appic_helper_casniter_id } from "@/canister_ids.json";
import { Principal } from "@dfinity/principal";
import { get_evm_token_price } from "../evm/get_tokens_price";
import { ICPToken } from "@dfinity/utils";

export const get_bridge_pairs = async (agent: HttpAgent, icp_tokens: IcpToken[]): Promise<Array<EvmToken | IcpToken>> => {
  const appic_actor = Actor.createActor(appicHelperIdlFactory, {
    agent,
    canisterId: Principal.fromText(appic_helper_casniter_id),
  });

  try {
    const bridge_pairs = (await appic_actor.get_icp_tokens()) as TokenPair[];

    return parseBridgePairs(bridge_pairs, icp_tokens);

    // Error handling
  } catch (error) {
    console.error("Error fetching token list:", error);
    return [];
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

async function parseBridgePairs(response: TokenPair[], icp_tokens: IcpToken[]): Promise<Array<EvmToken | IcpToken>> {
  try {
    const tokensMap = new Map<string, EvmToken | IcpToken>();
    const icpTokensMap = new Map<string, IcpToken>(icp_tokens.map((token) => [token.canisterId, token]));
    // Use a for...of loop to handle async/await properly
    for (const pair of response) {
      const { operator, evm_token, icp_token } = pair;

      const parsedOperator = parseOperator(operator);

      const evmKey = evm_token.erc20_contract_address;
      const icpKey = icp_token.ledger_id.toString();

      const parsed_chain_id: number = BigNumber(evm_token.chain_id.toString()).toNumber();

      // Parse EVM token
      if (!tokensMap.has(evmKey)) {
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
          usdPrice: usd_price,
        });
      }

      // Parse ICP token
      if (!tokensMap.has(icpKey)) {
        let icp_token_data = icpTokensMap.get(icpKey);

        tokensMap.set(icpKey, {
          name: icp_token.name,
          symbol: icp_token.symbol,
          logo: icp_token_data?.logo || "", // Use the same logo for both
          decimals: icp_token.decimals,
          chainId: 0, // ICP chain ID is considered 0
          canisterId: icp_token.ledger_id.toString(),
          fee: icp_token.fee.toString(),
          tokenType: "",
          chainType: "ICP",
          operator: parsedOperator,
          bridgePairs: [],
          usdPrice: icp_token_data?.usdPrice || "0",
          sonicPrice: icp_token_data?.sonicPrice || "0",
          icpSwapPrice: icp_token_data?.icpSwapPrice || "0",
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
  } catch (error) {
    console.error("Error parsing bridge pairs:", error);
    return [];
  }
}
