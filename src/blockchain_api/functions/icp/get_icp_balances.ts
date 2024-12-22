import BigNumber from "bignumber.js";
import { Principal } from "@dfinity/principal";
import { idlFactory as icrcIdlFactory } from "@/did/ledger/icrc.did";
import { idlFactory as dip20IdleFactory } from "@/did/ledger/dip20.did";
import { IcpToken } from "@/blockchain_api/types/tokens";
import { Response } from "@/blockchain_api/types/response";
import { Actor, HttpAgent } from "@dfinity/agent";

const waitWithTimeout = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface IcpTokensBalances {
  tokens: IcpToken[];
  totalBalanceUsd: string;
}

export async function get_icp_wallet_tokens_balances(principal_id: string, all_tokens: IcpToken[], unauthenticated_agent: HttpAgent): Promise<Response<IcpTokensBalances>> {
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
      result: {
        tokens: non_zero_balances,
        totalBalanceUsd: totalBalanceUsd.toString(),
      },
      message: "",
      success: true,
    };
  } catch (error) {
    return {
      result: {
        tokens: [],
        totalBalanceUsd: "",
      },
      message: `Failed to get user icp balance ${error}`,
      success: false,
    };
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
          const balance = new BigNumber(tokenBalance.toString()).dividedBy(new BigNumber(10).pow(decimals || 0));
          const usdBalance = balance.multipliedBy(usdPrice).toString();

          return {
            ...token,
            balance: balance.toString(),
            usdBalance,
            balanceRawInteger: tokenBalance.toString(),
          };
        }
        return { ...token, balance: "0", usdBalance: "0" };
      } catch (error) {
        return { ...token, balance: "0", usdBalance: "0" }; // Default values in case of error
      }
    })
  );

  return tokens;
};

const get_single_token_balance = async (canisterId: string, tokenType: string, userPrincipal: string, agent: HttpAgent): Promise<bigint> => {
  let tokenBalance: bigint = BigInt(0);
  const idleFactory = tokenType === "DIP20" || tokenType === "YC" ? dip20IdleFactory : icrcIdlFactory;

  try {
    const tokenActor = Actor.createActor(idleFactory, {
      agent,
      canisterId,
    });

    if (tokenType === "DIP20" || tokenType === "YC") {
      tokenBalance = (await Promise.race([tokenActor.balanceOf(Principal.fromText(userPrincipal)), waitWithTimeout(10000)])) as bigint;
    } else if (tokenType === "ICRC1" || tokenType === "ICRC2") {
      tokenBalance = (await Promise.race([
        tokenActor.icrc1_balance_of({
          owner: Principal.fromText(userPrincipal),
          subaccount: [],
        }),
        waitWithTimeout(10000),
      ])) as bigint;
    }
  } catch (error) {
    tokenBalance = BigInt(0);
  }
  return tokenBalance;
};
