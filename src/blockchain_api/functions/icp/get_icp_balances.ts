import BigNumber from 'bignumber.js';
import { Principal } from '@dfinity/principal';
import { idlFactory as icrcIdlFactory } from '@/blockchain_api/did/ledger/icrc.did';
import { idlFactory as dip20IdleFactory } from '@/blockchain_api/did/ledger/dip20.did';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { Response } from '@/blockchain_api/types/response';
import { Actor, HttpAgent } from '@dfinity/agent';

// const waitWithTimeout = (ms: number) =>
//   new Promise<bigint>((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));

export interface IcpTokensBalances {
  tokens: IcpToken[];
  totalBalanceUsd: string;
}

export async function get_icp_wallet_tokens_balances(
  principal_id: string,
  all_tokens: IcpToken[],
  unAuthenticated_agent: HttpAgent,
): Promise<Response<IcpTokensBalances>> {
  if (all_tokens.length == 0) {
    return {
      result: {
        tokens: [],
        totalBalanceUsd: '',
      },
      message: `No icp tokens passed`,
      success: false,
    };
  }
  let totalBalanceUsd = new BigNumber(0);

  try {
    const tokens_balances = await get_tokens_balances(all_tokens, principal_id, unAuthenticated_agent);

    const non_zero_balances = tokens_balances.filter((token) => {
      if (token.balance !== undefined && token.balance !== '0') {
        totalBalanceUsd = totalBalanceUsd.plus(token.usdBalance as string); // Ensure `usdBalance` matches expected type
        return true;
      }
      return false;
    });

    return {
      result: {
        tokens: non_zero_balances,
        totalBalanceUsd: totalBalanceUsd.toString(),
      },
      message: '',
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      result: {
        tokens: [],
        totalBalanceUsd: '',
      },
      message: `Failed to get user icp balance ${error}`,
      success: false,
    };
  }
}

export const get_tokens_balances = async (
  all_token: IcpToken[],
  userPrincipal: string,
  agent: HttpAgent,
): Promise<IcpToken[]> => {
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
        return { ...token, balance: '0', usdBalance: '0' };
      } catch (error) {
        console.error(error);
        return { ...token, balance: '0', usdBalance: '0' }; // Default values in case of error
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
  let tokenBalance: bigint = BigInt(0);
  const idleFactory = tokenType === 'DIP20' || tokenType === 'YC' ? dip20IdleFactory : icrcIdlFactory;

  try {
    const tokenActor = Actor.createActor(idleFactory, {
      agent,
      canisterId,
    });

    if (tokenType === 'DIP20' || tokenType === 'YC') {
      tokenBalance = (await tokenActor.balanceOf(Principal.fromText(userPrincipal))) as bigint;
    } else if (tokenType === 'ICRC1' || tokenType === 'ICRC2') {
      tokenBalance = (await tokenActor.icrc1_balance_of({
        owner: Principal.fromText(userPrincipal),
        subaccount: [],
      })) as bigint;
    }
  } catch (error) {
    console.error(error);
    tokenBalance = BigInt(0);
  }
  return tokenBalance;
};
