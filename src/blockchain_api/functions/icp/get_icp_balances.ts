import { idlFactory as icrcIdlFactory } from '@/blockchain_api/did/ledger/icrc.did';
import { idlFactory as dip20IdleFactory } from '@/blockchain_api/did/ledger/dip20.did';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { Response } from '@/blockchain_api/types/response';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import BigNumber from 'bignumber.js';
import { appic_dex } from '@/canister_ids.json';
import { idlFactory as dexIdlFactory } from '@/blockchain_api/did/appic/appic_dex/appic_dex.did';
import { Balance } from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
export interface IcpTokensBalances {
  tokens: IcpToken[];
  totalBalanceUsd: string;
  dex_tokens: IcpToken[];
  totalDexBalances: string;
}
// Utility to reject a promise after a specified timeout
export const waitWithTimeout = (ms: number) =>
  new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Timeout after 10 seconds')), ms),
  );

export async function get_icp_wallet_tokens_balances(
  principal_id: string,
  all_tokens: IcpToken[],
  top_tokens: boolean,
  unAuthenticated_agent: HttpAgent,
): Promise<Response<IcpTokensBalances>> {
  if (all_tokens.length === 0) {
    return {
      result: {
        tokens: [],
        totalBalanceUsd: '',
        dex_tokens: [],
        totalDexBalances: '',
      },
      message: 'No ICP tokens provided',
      success: false,
    };
  }
  let totalBalanceUsd = new BigNumber(0);
  let totalDexUsd = new BigNumber(0);
  try {
    const dex_actor = Actor.createActor(dexIdlFactory, {
      agent: unAuthenticated_agent,
      canisterId: appic_dex,
    });
    const tokens_balances = await get_tokens_balances(
      all_tokens,
      principal_id,
      top_tokens,
      unAuthenticated_agent,
    );
    const non_zero_balances = tokens_balances.filter((token) => {
      if (token.balance && token.balance !== '0') {
        totalBalanceUsd = totalBalanceUsd.plus(token.usdBalance as string);
        return true;
      }
      return false;
    });
    const dex_balances_raw = (await dex_actor.user_balances(
      Principal.fromText(principal_id),
    )) as Array<Balance>;
    const dex_tokens_pre = dex_balances_raw
      .map((bal: Balance) => {
        const token = all_tokens.find((t) => t.canisterId === bal.token.toText());
        if (!token) return null;
        const balanceBN = new BigNumber(bal.amount.toString()).dividedBy(
          new BigNumber(10).pow(token.decimals || 0),
        );
        const usdBalance = balanceBN.multipliedBy(token.usdPrice).toFixed(2);
        if (BigNumber(usdBalance).lt(BigNumber(0.01))) return null;
        return {
          ...token,
          balance: balanceBN.toString(),
          usdBalance,
          balanceRawInteger: bal.amount.toString(),
        };
      })
      .filter((t: IcpToken | null) => t !== null);
    const non_zero_dex = dex_tokens_pre.filter((token) => {
      if (token !== null && token.balance && token.balance !== '0') {
        totalDexUsd = totalDexUsd.plus(token.usdBalance as string);
        return true;
      }
      return false;
    }) as IcpToken[];
    return {
      result: {
        tokens: non_zero_balances,
        totalBalanceUsd: totalBalanceUsd.toString(),
        dex_tokens: non_zero_dex,
        totalDexBalances: totalDexUsd.toString(),
      },
      message: '',
      success: true,
    };
  } catch (error) {
    console.error('Error fetching ICP wallet balances:', error);
    return {
      result: {
        tokens: [],
        totalBalanceUsd: '',
        dex_tokens: [],
        totalDexBalances: '',
      },
      message: `Failed to fetch ICP wallet balances: ${error}`,
      success: false,
    };
  }
}
export const get_tokens_balances = async (
  all_tokens: IcpToken[],
  userPrincipal: string,
  top_tokens: boolean,
  agent: HttpAgent,
): Promise<IcpToken[]> => {
  const tokens = await Promise.all(
    all_tokens
      .filter((token) => (top_tokens ? token.rank == 1 || token.listed_on_appic_dex == true : true))
      .map(async (token) => {
        const { canisterId, tokenType, decimals, usdPrice } = token;
        try {
          // Fetch token balance with a 5-second timeout
          const tokenBalance = await Promise.race([
            get_single_token_balance(canisterId, tokenType, userPrincipal, agent),
            waitWithTimeout(10000),
          ]);
          // Calculate USD balance
          const balance = new BigNumber(tokenBalance.toString()).dividedBy(
            new BigNumber(10).pow(decimals || 0),
          );
          const usdBalance = balance.multipliedBy(usdPrice).toString();
          return {
            ...token,
            balance: balance.toString(),
            usdBalance,
            balanceRawInteger: tokenBalance.toString(),
          };
        } catch (error) {
          console.error(`Failed to fetch balance for token ${canisterId}:`, error);
          return { ...token, balance: '0', usdBalance: '0', balanceRawInteger: '0' };
        }
      }),
  );
  return tokens;
};
const get_single_token_balance = async (
  canisterId: string,
  tokenType: string,
  userPrincipal: string,
  agent: HttpAgent,
): Promise<bigint> => {
  const idleFactory =
    tokenType === 'DIP20' || tokenType === 'YC' ? dip20IdleFactory : icrcIdlFactory;
  try {
    const tokenActor = Actor.createActor(idleFactory, {
      agent,
      canisterId,
    });
    if (tokenType === 'DIP20' || tokenType === 'YC') {
      return (await tokenActor.balanceOf(Principal.fromText(userPrincipal))) as bigint;
    } else if (tokenType === 'ICRC1' || tokenType === 'ICRC2') {
      return (await tokenActor.icrc1_balance_of({
        owner: Principal.fromText(userPrincipal),
        subaccount: [],
      })) as bigint;
    }
    return BigInt(0);
  } catch (error) {
    console.error(`Error querying balance for canister ${canisterId}:`, error);
    return BigInt(0);
  }
};
