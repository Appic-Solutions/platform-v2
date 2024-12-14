import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

// Sonic type and did
import { idlFactory as sonicIdlFactory } from "@/did/sonic/sonic.did";
import { TokenInfoWithType, PairInfoExt } from "@/did/sonic/sonic_types";

// Icp swap types and did
import { idlFactory as IcpSwapNodeIdlFactory } from "@/did/icpswap/icp_swap_node.did";
import { PublicTokenOverview } from "@/did/icpswap/icp_swap_node_types";
import { idlFactory as IcpSwapTokenListIdlFactory } from "@/did/icpswap/icp_swap_token_list.did";
import { Tokens_result, TokenMetadata } from "@/did/icpswap/icp_swap_token_list_types";

import BigNumber from "bignumber.js";

import { get_icp_price } from "./get_icp_price";
import { IcpToken } from "@/blockchain_api/types/tokens";

import { sonic_dex_casniter_id, icp_swap_node_casniter_id, icp_swap_token_list_casniter_id, icp_ledger, wicp_ledger } from "@/canister_ids.json";

// Function to fetch and remove deduplicate tokens from Sonic Swap and ICP Swap
export const get_icp_tokens = async (agent: HttpAgent): Promise<IcpToken[]> => {
  try {
    // Fetch tokens from both Sonic Swap and ICP Swap
    const [sonicTokens, icpSwapTokens] = await Promise.all([
      get_sonic_transformed_tokens(agent), // Implement this function
      get_icp_swap_transformed_tokens(agent),
    ]);

    // Deduplicate tokens and calculate the better price
    const tokenMap = new Map<string, IcpToken>();

    [...sonicTokens, ...icpSwapTokens].forEach((token) => {
      const existingToken = tokenMap.get(token.canisterId);

      if (existingToken) {
        existingToken.usdPrice = choose_better_price(existingToken.sonicPrice || "0", token.IcpSwapPrice || "0");
        existingToken.IcpSwapPrice = token.IcpSwapPrice;
        tokenMap.set(existingToken.canisterId, existingToken);
      } else {
        tokenMap.set(token.canisterId, token);
      }
    });

    // Return the unique tokens as an array
    return Array.from(tokenMap.values());
  } catch (error) {
    console.error("Error fetching ICP tokens:", error);
    return [];
  }
};

// Get all icp swap tokens and convert them into standard IcpToken[]

// Step 1
// Get all tokens from icp swap
export const get_icpswap_tokens_usd_price = async (agent: HttpAgent): Promise<PublicTokenOverview[]> => {
  const icp_swap_node_actor = Actor.createActor(IcpSwapNodeIdlFactory, {
    agent,
    canisterId: Principal.fromText(icp_swap_node_casniter_id),
  });

  try {
    // Type assertion to let TypeScript know the return type is PublicTokenOverview[]
    const all_icp_swap_token = (await icp_swap_node_actor.getAllTokens()) as PublicTokenOverview[];
    // Filter possible scamor spam tokens
    return all_icp_swap_token.filter((token) => token.priceUSD != 0 && token.volumeUSD != 0);
  } catch (error) {
    console.error("Error fetching token list:", error);
    return [];
  }
};

// Step 2
export const get_icpswap_tokens_metadata = async (agent: HttpAgent): Promise<TokenMetadata[]> => {
  const icp_swap_token_list_actor = Actor.createActor(IcpSwapTokenListIdlFactory, {
    agent,
    canisterId: Principal.fromText(icp_swap_token_list_casniter_id),
  });

  try {
    const tokens_metadata_result = (await icp_swap_token_list_actor.getList()) as Tokens_result[];

    if ("ok" in tokens_metadata_result) {
      const tokenMetadata = tokens_metadata_result.ok as TokenMetadata[]; // Explicitly cast to TokenMetadata[]
      // Filter the tokens based on custom criteria (e.g., non-spam or valid metadata)
      return tokenMetadata;

      // Error handling
    } else if ("err" in tokens_metadata_result) {
      console.warn("Invalid token metadata received:", tokens_metadata_result.err);
      return [];
    } else {
      console.warn("Unexpected result format:", tokens_metadata_result);
      return [];
    }
  } catch (error) {
    console.error("Error fetching token list:", error);
    return [];
  }
};

// Step 3
// Validate function to combine PublicTokenOverview and TokenMetadata into IcpToken[]
export const validate_icp_swap_tokens = (publicTokens: PublicTokenOverview[], metadataTokens: TokenMetadata[]): IcpToken[] => {
  const metadataMap = new Map(
    metadataTokens
      .filter((meta) => BigNumber(meta.decimals.toString()).toString() !== "0" && BigNumber(meta.fee.toString()).toString() !== "0") // Exclude tokens with decimals or fee equal to 0
      .map((meta) => [meta.canisterId, meta])
  );

  return publicTokens
    .filter((publicToken) => metadataMap.has(publicToken.address)) // Match by canisterId/address
    .map((publicToken) => {
      const meta = metadataMap.get(publicToken.address)!; // Metadata is guaranteed to exist at this point
      return {
        name: publicToken.name,
        symbol: publicToken.symbol,
        logo: `https://wqfao-piaaa-aaaag-qj5ba-cai.raw.icp0.io/${publicToken.address}`, // Placeholder for logo if needed
        usdPrice: publicToken.priceUSD.toString(),
        decimals: BigNumber(meta.decimals.toString()).toNumber(),
        chainId: 0, // Chain ID for ICP
        chainType: "ICP", // Chain type is ICP
        canisterId: meta.canisterId,
        fee: meta.fee.toString(),
        tokenType: publicToken.standard,
        IcpSwapPrice: publicToken.priceUSD.toString(),
        balance: undefined, // Optional, can be added later
        balanceRawInteger: undefined,
        usdBalance: undefined, // Optional, can be added later
      };
    });
};

// Step 4
// Fetch and transform all sonic tokens
export const get_icp_swap_transformed_tokens = async (agent: HttpAgent): Promise<IcpToken[]> => {
  // Fetch token usd price and metadata
  const [icp_swap_tokens_usd_price, icp_swap_tokens_metadata] = await Promise.all([
    get_icpswap_tokens_usd_price(agent), // Implement this function
    get_icpswap_tokens_metadata(agent),
  ]);

  if (icp_swap_tokens_usd_price.length == 0) return [];
  if (icp_swap_tokens_metadata.length == 0) return [];

  const validated_icp_swap_tokens = validate_icp_swap_tokens(icp_swap_tokens_usd_price, icp_swap_tokens_metadata);
  if (validated_icp_swap_tokens.length == 0) return [];

  return validated_icp_swap_tokens;
};

// Get all sonic dex tokens and convert them into standard IcpToken[]

// Step 1
// Get all tokens from sonic dex
export const get_sonic_tokens = async (agent: HttpAgent): Promise<TokenInfoWithType[]> => {
  const sonic_actor = Actor.createActor(sonicIdlFactory, {
    agent,
    canisterId: Principal.fromText(sonic_dex_casniter_id),
  });

  try {
    // Type assertion to let TypeScript know the return type is TokenInfoWithType[]
    const all_sonic_tokens = (await sonic_actor.getSupportedTokenList()) as TokenInfoWithType[];
    // You can now use allIcpTokens here
    return all_sonic_tokens;
  } catch (error) {
    console.error("Error fetching token list:", error);
    return [];
  }
};

// Step 2
// Get all pairs from sonic dex
export const get_sonic_pairs = async (agent: HttpAgent): Promise<PairInfoExt[]> => {
  const sonic_actor = Actor.createActor(sonicIdlFactory, {
    agent,
    canisterId: Principal.fromText(sonic_dex_casniter_id),
  });

  try {
    // Type assertion to let TypeScript know the return type is PairInfoExt[]
    const allSonicPairs = (await sonic_actor.getAllPairs()) as PairInfoExt[];
    // You can now use allIcpTokens here
    return allSonicPairs;
  } catch (error) {
    console.error("Error fetching sonic pairs list:", error);
    return [];
  }
};

interface TokenWithPrice extends TokenInfoWithType {
  price: string;
}

// Calculate price for sonic tokens
export const calculate_sonic_price = (all_tokens: TokenInfoWithType[], all_pairs: PairInfoExt[], icp_price: number): TokenWithPrice[] => {
  const allTokensWithPrices: TokenWithPrice[] = [];

  all_tokens.forEach((token) => {
    // Check if token is ICP or WICP
    if (token.id === wicp_ledger || token.id === icp_ledger) {
      allTokensWithPrices.push({ ...token, price: icp_price.toString() });
      return;
    }

    // Find the pair for ICP and Target token
    let pair = all_pairs.find((pair) => pair.id === `${token.id}:${icp_ledger}` || pair.id === `${icp_ledger}:${token.id}`);

    // If there is no ICP pair, Check for wicp_ledger pairs
    if (!pair) {
      pair = all_pairs.find((pair) => pair.id === `${token.id}:${wicp_ledger}` || pair.id === `${wicp_ledger}:${token.id}`);
    }

    // If there is no pair between ICP/wicp_ledger and the token, skip this token
    if (!pair) {
      return;
    }

    // Set Base Reserve (ICP) from Pair
    const baseReserve = pair.token0 === wicp_ledger || pair.token0 === icp_ledger ? { value: pair.reserve0, decimals: 8 } : { value: pair.reserve1, decimals: 8 };

    // Set Token Reserve (Token) from pair
    const tokenReserve = pair.token0 === wicp_ledger || pair.token0 === icp_ledger ? { value: pair.reserve1, decimals: token.decimals } : { value: pair.reserve0, decimals: token.decimals };

    // Calculate token price based on reserves and ICP price
    const price = new BigNumber(baseReserve.value.toString())
      .dividedBy(new BigNumber(10).pow(baseReserve.decimals))
      .multipliedBy(icp_price)
      .dividedBy(new BigNumber(tokenReserve.value.toString()).dividedBy(new BigNumber(10).pow(tokenReserve.decimals)))
      .toString();

    if (new BigNumber(price).isGreaterThan(0)) allTokensWithPrices.push({ ...token, price });
  });

  return allTokensWithPrices;
};

// Step 3
// Transform TokenWithPrice[] to IcpToken[]
export const transform_sonic_tokens = (tokensWithPrices: TokenWithPrice[]): IcpToken[] => {
  return tokensWithPrices.map(
    (token): IcpToken => ({
      name: token.name,
      symbol: token.symbol,
      logo: `https://cdn.sonic.ooo/icons/${token.id}`,
      usdPrice: "",
      sonicPrice: token.price,
      decimals: token.decimals,
      chainId: 0, // Set to 0 for ICP tokens
      balance: "0",
      balanceRawInteger: "0",
      usdBalance: "0",
      chainType: "ICP",
      canisterId: token.id,
      fee: token.fee.toString(),
      tokenType: token.tokenType,
    })
  );
};

// Step 4
// Fetch and transform all sonic tokens
export const get_sonic_transformed_tokens = async (agent: HttpAgent): Promise<IcpToken[]> => {
  // Fetch tokens and pairs from sonic swap
  const [sonic_tokens, sonic_pairs, icp_price] = await Promise.all([
    get_sonic_tokens(agent), // Implement this function
    get_sonic_pairs(agent),
    get_icp_price(),
  ]);

  if (sonic_tokens.length == 0) return [];
  if (sonic_pairs.length == 0) return [];
  if (icp_price == null) return [];

  const tokens_with_prices: TokenWithPrice[] = calculate_sonic_price(sonic_tokens, sonic_pairs, icp_price);
  if (tokens_with_prices.length == 0) return [];

  return transform_sonic_tokens(tokens_with_prices);
};

// Function to determine the better price between two values provided as strings
function choose_better_price(sonicDexPrice: string, icpSwapPrice: string) {
  // Parse the prices into BigNumber instances. If the input is falsy (e.g., null or undefined), default to 0.
  const sonicPrice = new BigNumber(sonicDexPrice || 0);
  const icpPrice = new BigNumber(icpSwapPrice || 0);

  // If sonicPrice is zero, icpPrice is returned as the better price.
  if (sonicPrice.isZero()) {
    return icpPrice.toString();
  }

  // If icpPrice is zero, sonicPrice is returned as the better price.
  if (icpPrice.isZero()) {
    return sonicPrice.toString();
  }

  // Compare the two prices and return the smaller one as the better price.
  return sonicPrice.isLessThan(icpPrice) ? sonicPrice.toString() : icpPrice.toString();
}
