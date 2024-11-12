import BigNumber from "bignumber.js";
import { Principal } from "@dfinity/principal";
import { icrcIdlFactory } from "@/did/ledger/icrc1.did";
import { dip20IdleFactory } from "@/did/ledger/dip20.did";
import { IcpToken } from "@/blockchain_api/types/tokens";
import { Actor, Agent, HttpAgent } from "@dfinity/agent";

const waitWithTimeout = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface IcpTokensBalances {
  tokens: IcpToken[];
  totalBalanceUsd: string;
}

export async function get_icp_wallet_tokens_balances(principal_id: string, all_tokens: IcpToken[], unauthenticated_agent: HttpAgent): Promise<IcpTokensBalances> {
  let totalBalanceUsd = new BigNumber(0);

  try {
    const tokens_balances = await get_tokens_balances(all_tokens, principal_id, unauthenticated_agent);
    const non_zero_balances = tokens_balances.filter((token) => {
      if (token.balance != "0") {
        totalBalanceUsd = totalBalanceUsd.plus(token.usdBalance as unknown as number);
        return true;
      }
    });
    return {
      tokens: non_zero_balances,
      totalBalanceUsd: totalBalanceUsd.toString(),
    };
  } catch (error) {
    console.error("Error fetching account balance:", error);
    throw error;
  }
}

export const get_tokens_balances = async (all_token: IcpToken[], userPrincipal: string, agent: HttpAgent): Promise<IcpToken[]> => {
  const tokens = await Promise.all(
    all_token.map(async (token) => {
      const { canisterId, tokenType, decimals, usdPrice } = token;

      try {
        // Fetch token balance
        const tokenBalance = await get_single_token_balance(canisterId, tokenType, userPrincipal, agent);
        if (tokenBalance) {
          // Calculate USD balance
          const usdBalance = new BigNumber(tokenBalance.toString()).dividedBy(10).pow(decimals).multipliedBy(usdPrice).toString();

          return { ...token, balance: tokenBalance.toString(), usdBalance, balanceRawInteger: tokenBalance.toString() };
        }
        return { ...token, balance: "0", usdBalance: "0" };
      } catch (error) {
        console.error(`Error fetching balance for token ${canisterId}:`, error);
        return { ...token, balance: "0", usdBalance: "0" }; // Default values in case of error
      }
    })
  );

  return tokens;
};

const get_single_token_balance = async (canisterId: string, tokenType: string, userPrincipal: string, agent: HttpAgent): Promise<bigint> => {
  const tokenTypeLower = tokenType.toLowerCase();
  let tokenBalance: bigint = BigInt(0);
  const idleFactory = tokenTypeLower === "dip20" || tokenTypeLower === "yc" ? dip20IdleFactory : icrcIdlFactory;

  try {
    const tokenActor = Actor.createActor(idleFactory, {
      agent,
      canisterId,
    });

    if (tokenTypeLower === "dip20" || tokenTypeLower === "yc") {
      tokenBalance = (await Promise.race([tokenActor.balanceOf(Principal.fromText(userPrincipal)), waitWithTimeout(10000)])) as bigint;
    } else if (tokenTypeLower === "icrc1" || tokenTypeLower === "icrc2") {
      tokenBalance = (await Promise.race([tokenActor.icrc1_balance_of({ owner: Principal.fromText(userPrincipal), subaccount: [] }), waitWithTimeout(10000)])) as bigint;
    }
  } catch (error) {
    console.error(`Error in get_single_token_balance for canisterId ${canisterId}:`, error);
    tokenBalance = BigInt(0);
  }
  return tokenBalance;
};
