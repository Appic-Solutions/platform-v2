import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

// Sonic type and did
import { idlFactory as sonicIdlFactory } from "@/did/sonic/sonic.did";
import { TokenInfoWithType, PairInfoExt } from "@/did/sonic/sonic_types";

// Icp swap types and did
import { idlFactory as IcpSwapNodeIdlFactory } from "@/did/icpswap/icp_swap_node.did";
import { PublicTokenOverview } from "@/did/icpswap/icp_swap_node_types";

// Appic helper types and did
import { idlFactory as AppicIdlFactory } from "@/did/appic/appic_helper.did";
import { CandidIcpToken } from "@/did/appic/appic_helper_types";

import BigNumber from "bignumber.js";

import { get_icp_price } from "./get_icp_price";
import { IcpToken } from "@/blockchain_api/types/tokens";

import { sonic_dex_casniter_id, icp_swap_node_casniter_id, appic_helper_casniter_id, icp_ledger, wicp_ledger } from "@/canister_ids.json";

// The flow is as follow
// 1: The validated tokens are fetched from appic helper cansiter(Appic helper makes sure that the token cansiter exsists and vlaidates their wasm module)
// 2: Icp Swap tokens with their prices are fethced and filtered out by valid tokens from appic
// 3: Sonic swap tokens are fethced with ther prices and then filtered out by valid tokens from appic
// 4: Remove duplicates and select the better price then retuen valid tokens with prices from both swapers

// Step 1
// Get valid appic tokens
export const get_valid_icp_tokens_from_appic_helper = async (agent: HttpAgent): Promise<CandidIcpToken[]> => {
  const appic_actor = Actor.createActor(AppicIdlFactory, {
    agent,
    canisterId: Principal.fromText(appic_helper_casniter_id),
  });

  try {
    const validated_icp_tokens = (await appic_actor.get_icp_tokens()) as CandidIcpToken[];

    return validated_icp_tokens;

    // Error handling
  } catch (error) {
    console.error("Error fetching token list:", error);
    return [];
  }
};

// Step 2.0
// Get icp swap tokens
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

// Step 2.1 Helper function
// Validate function to combine PublicTokenOverview and ValidTokens from Appic into IcpToken[]
export const filter_icp_swap_tokens = (publicTokens: PublicTokenOverview[], validTokens: CandidIcpToken[]): IcpToken[] => {
  const TokensMap = new Map(
    validTokens
      .filter((token) => BigNumber(token.decimals.toString()).toString() !== "0" && BigNumber(token.fee.toString()).toString() !== "0") // Exclude tokens with decimals or fee equal to 0
      .map((token) => [token.ledger_id.toString(), token])
  );

  return publicTokens
    .filter((publicToken) => TokensMap.has(publicToken.address)) // Match by canisterId/address
    .map((publicToken) => {
      const token = TokensMap.get(publicToken.address)!; // Metadata is guaranteed to exist at this point
      return {
        name: publicToken.name,
        symbol: publicToken.symbol,
        logo: `https://wqfao-piaaa-aaaag-qj5ba-cai.raw.icp0.io/${publicToken.address}`, // Placeholder for logo if needed
        usdPrice: publicToken.priceUSD.toString(),
        decimals: BigNumber(token.decimals.toString()).toNumber(),
        chainId: 0, // Chain ID for ICP
        chainType: "ICP", // Chain type is ICP
        canisterId: token.ledger_id.toString(),
        fee: token.fee.toString(),
        tokenType: publicToken.standard,
        IcpSwapPrice: publicToken.priceUSD.toString(),
        balance: undefined, // Optional, can be added later
        balanceRawInteger: undefined,
        usdBalance: undefined, // Optional, can be added later
      };
    });
};

// Step 2.3
// Fetch and transform all icp_swap tokens and filter them wiht validated appic tokens
export const get_icp_swap_transformed_tokens = async (agent: HttpAgent, valid_appic_tokens: CandidIcpToken[]): Promise<IcpToken[]> => {
  // Fetch token usd price and metadata
  const [icp_swap_tokens_usd_price] = await Promise.all([
    get_icpswap_tokens_usd_price(agent), // Implement this function
  ]);

  if (icp_swap_tokens_usd_price.length == 0) return [];
  if (valid_appic_tokens.length == 0) return [];

  const filtered_icp_swap_tokens = filter_icp_swap_tokens(icp_swap_tokens_usd_price, valid_appic_tokens);
  if (filtered_icp_swap_tokens.length == 0) return [];

  return filtered_icp_swap_tokens;
};

// Step 3
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

// Step 3.1
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

// Step 3.3
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

// Step 3.4
// Transform TokenWithPrice[] to IcpToken[]
export const transform_sonic_tokens = (tokensWithPrices: TokenWithPrice[], valid_appic_tokens: CandidIcpToken[]): IcpToken[] => {
  const TokensMap = new Map(
    valid_appic_tokens
      .filter((token) => BigNumber(token.decimals.toString()).toString() !== "0" && BigNumber(token.fee.toString()).toString() !== "0") // Exclude tokens with decimals or fee equal to 0
      .map((token) => [token.ledger_id.toString(), token])
  );

  return tokensWithPrices
    .filter((tokensWithPrice) => TokensMap.has(tokensWithPrice.id)) // Match by canisterId/address
    .map(
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

// Step 3.5
// Fetch and transform all sonic tokens and filter them by validated appic tokens
export const get_sonic_transformed_tokens = async (agent: HttpAgent, valid_appic_tokens: CandidIcpToken[]): Promise<IcpToken[]> => {
  // Fetch tokens and pairs from sonic swap
  const [sonic_tokens, sonic_pairs, icp_price, validated_appic_icp_tokens] = await Promise.all([
    get_sonic_tokens(agent), // Implement this function
    get_sonic_pairs(agent),
    get_icp_price(),
    get_valid_icp_tokens_from_appic_helper(agent),
  ]);

  if (sonic_tokens.length == 0) return [];
  if (sonic_pairs.length == 0) return [];
  if (icp_price == null) return [];
  if (validated_appic_icp_tokens.length == 0) return [];

  const tokens_with_prices: TokenWithPrice[] = calculate_sonic_price(sonic_tokens, sonic_pairs, icp_price);
  if (tokens_with_prices.length == 0) return [];

  return transform_sonic_tokens(tokens_with_prices, valid_appic_tokens);
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

// Step 4(Finall Step)
// Function to fetch and remove deduplicate tokens from Sonic Swap and ICP Swap
export const get_icp_tokens = async (agent: HttpAgent): Promise<IcpToken[]> => {
  try {
    const valid_appic_tokens = await get_valid_icp_tokens_from_appic_helper(agent);

    // Fetch tokens from both Sonic Swap and ICP Swap
    const [sonicTokens, icpSwapTokens] = await Promise.all([
      get_sonic_transformed_tokens(agent, valid_appic_tokens), // Implement this function
      get_icp_swap_transformed_tokens(agent, valid_appic_tokens),
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
