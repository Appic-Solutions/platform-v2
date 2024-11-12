import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as sonicIdlFactory, TokenInfoWithType, PairInfoExt } from "@/did/sonic/sonic.did";

import BigNumber from "bignumber.js";

import { Principal } from "@dfinity/principal";
import { get_icp_price } from "./get_icp_price";
import { IcpToken } from "@/blockchain_api/types/tokens";

// The main function to be called
export const get_all_icp_tokens = async (agent: HttpAgent): Promise<IcpToken[]> => {
  const all_sonic_tokens: TokenInfoWithType[] = await get_all_sonic_tokens(agent);

  if (all_sonic_tokens.length == 0) return [];

  const all_sonic_pairs: PairInfoExt[] = await get_all_sonic_pairs(agent);

  if (all_sonic_pairs.length == 0) return [];

  const icp_price: number | null = await get_icp_price();

  if (icp_price == null) return [];

  const all_tokens_with_prices: TokenWithPrice[] = calculatePrice(all_sonic_tokens, all_sonic_pairs, icp_price);

  if (all_tokens_with_prices.length == 0) return [];

  return transformToIcpTokens(all_tokens_with_prices);
};

// Transform TokenWithPrice[] to IcpToken[]
export const transformToIcpTokens = (tokensWithPrices: TokenWithPrice[]): IcpToken[] => {
  return tokensWithPrices.map(
    (token): IcpToken => ({
      name: token.name,
      symbol: token.symbol,
      logo: `'https://cdn.sonic.ooo/icons/'${token.id}`,
      usdPrice: token.price,
      decimals: token.decimals,
      chainId: 0, // Set to 0 for ICP tokens
      balance: "0",
      balanceRawInteger: "0",
      usdBalance: "0",
      chainTypes: "ICP",
      canisterId: token.id,
      fee: token.fee.toString(),
      tokenType: token.tokenType,
    })
  );
};

// Get all tokens from sonic dex
export const get_all_sonic_tokens = async (agent: HttpAgent): Promise<TokenInfoWithType[]> => {
  const sonic_actor = Actor.createActor(sonicIdlFactory, {
    agent,
    canisterId: Principal.fromText("3xwpq-ziaaa-aaaah-qcn4a-cai"),
  });

  try {
    // Type assertion to let TypeScript know the return type is TokenInfoWithType[]
    const allSonicTokens = (await sonic_actor.getSupportedTokenList()) as TokenInfoWithType[];
    // You can now use allIcpTokens here
    return allSonicTokens;
  } catch (error) {
    console.error("Error fetching token list:", error);
    return [];
  }
};

// Get all pairs from sonic dex
export const get_all_sonic_pairs = async (agent: HttpAgent): Promise<PairInfoExt[]> => {
  const sonic_actor = Actor.createActor(sonicIdlFactory, {
    agent,
    canisterId: Principal.fromText("3xwpq-ziaaa-aaaah-qcn4a-cai"),
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

const icp_canistersIDs = {
  WICP: "utozz-siaaa-aaaam-qaaxq-cai",
  ICP_LEDGER: "ryjl3-tyaaa-aaaaa-aaaba-cai",
};

export const calculatePrice = (allTokens: TokenInfoWithType[], allPairs: PairInfoExt[], icpPrice: number): TokenWithPrice[] => {
  const allTokensWithPrices: TokenWithPrice[] = [];

  allTokens.forEach((token) => {
    // Check if token is ICP or WICP
    if (token.id === icp_canistersIDs.WICP || token.id === icp_canistersIDs.ICP_LEDGER) {
      allTokensWithPrices.push({ ...token, price: icpPrice.toString() });
      return;
    }

    // Find the pair for ICP and Target token
    let pair = allPairs.find((pair) => pair.id === `${token.id}:${icp_canistersIDs.ICP_LEDGER}` || pair.id === `${icp_canistersIDs.ICP_LEDGER}:${token.id}`);

    // If there is no ICP pair, Check for WICP pairs
    if (!pair) {
      pair = allPairs.find((pair) => pair.id === `${token.id}:${icp_canistersIDs.WICP}` || pair.id === `${icp_canistersIDs.WICP}:${token.id}`);
    }

    // If there is no pair between ICP/WICP and the token, skip this token
    if (!pair) {
      return;
    }

    // Set Base Reserve (ICP) from Pair
    const baseReserve = pair.token0 === icp_canistersIDs.WICP || pair.token0 === icp_canistersIDs.ICP_LEDGER ? { value: pair.reserve0, decimals: 8 } : { value: pair.reserve1, decimals: 8 };

    // Set Token Reserve (Token) from pair
    const tokenReserve = pair.token0 === icp_canistersIDs.WICP || pair.token0 === icp_canistersIDs.ICP_LEDGER ? { value: pair.reserve1, decimals: token.decimals } : { value: pair.reserve0, decimals: token.decimals };

    // Calculate token price based on reserves and ICP price
    const price = new BigNumber(baseReserve.value.toString())
      .dividedBy(new BigNumber(10).pow(baseReserve.decimals))
      .multipliedBy(icpPrice)
      .dividedBy(new BigNumber(tokenReserve.value.toString()).dividedBy(new BigNumber(10).pow(tokenReserve.decimals)))
      .toString();

    if (new BigNumber(price).isGreaterThan(0)) allTokensWithPrices.push({ ...token, price });
  });

  return allTokensWithPrices;
};
