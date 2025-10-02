import {
  CandidPathKey,
  CandidPoolId,
  ExactInputParams,
  ExactInputSingleParams,
  SwapArgs,
} from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
import { IcpQuote } from '@/blockchain_api/quoter/icp';
import { Principal } from '@dfinity/principal';
import { sortTokens } from '../utils/token_order';
import { HttpAgent, Agent, Actor } from '@dfinity/agent';
import { idlFactory as IcrcIdlFactory } from '@/blockchain_api/did/ledger/icrc.did';
import {
  Account,
  ApproveArgs,
  Result_2 as ApprvalResult,
  Allowance,
  AllowanceArgs,
} from '@/blockchain_api/did/ledger/icrc_types';
import { appic_dex } from '@/canister_ids.json';
import { Response } from '@/blockchain_api/types/response';
import { Result_10 as SwapResult } from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
import { idlFactory } from '@/blockchain_api/did/appic/appic_dex/appic_dex.did';
import { BigNumber } from 'bignumber.js';

// step 1
// for swapping first we need to generate the swap args and then approve the token in spending
export async function approve_token_in(
  quote: IcpQuote,
  authenticated_agent: Agent, // HttpAgent , Agent
  unauthenticated_agent: HttpAgent,
): Promise<Response<SwapArgs | undefined>> {
  let swap_args = createSwapArgs(quote);

  // approval tx
  const token_in_actor = Actor.createActor(IcrcIdlFactory, {
    agent: authenticated_agent,
    canisterId: Principal.fromText(quote.tokenIn.canisterId),
  });

  const token_in_actor_unauthenticated = Actor.createActor(IcrcIdlFactory, {
    agent: unauthenticated_agent,
    canisterId: Principal.fromText(quote.tokenIn.canisterId),
  });

  try {
    const sender_principal = await authenticated_agent.getPrincipal();

    // Check the allowances
    const token_in_allowance = (await token_in_actor_unauthenticated.icrc2_allowance({
      account: {
        owner: sender_principal,
        subaccount: [],
      },
      spender: { owner: Principal.fromText(appic_dex), subaccount: [] },
    } as AllowanceArgs)) as Allowance;

    // Check if  appic dex alread has enough allowance
    //
    // token0
    if (
      BigNumber(token_in_allowance.allowance.toString()).isLessThan(BigNumber(quote.approvalAmount))
    ) {
      // In case of Native withdrawal
      const token_in_approval_result = (await token_in_actor.icrc2_approve({
        amount: BigInt(new BigNumber(quote.approvalAmount).toString()),
        created_at_time: [],
        expected_allowance: [],
        expires_at: [],
        fee: [],
        from_subaccount: [],
        memo: [],
        spender: { owner: Principal.fromText(appic_dex), subaccount: [] } as Account,
      } as ApproveArgs)) as ApprvalResult;

      if ('Err' in token_in_approval_result) {
        console.log(token_in_approval_result.Err);
        return {
          result: undefined,
          success: false,
          message: `Failed to approve allowance:${token_in_approval_result.Err}`,
        };
      }
    }

    return {
      success: true,
      result: swap_args,
      message: '',
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      result: undefined,
      message: `Failed to approve token spendings, please try again later. ${error}`,
    };
  }
}

// step 2
export async function swap(
  swap_args: SwapArgs,
  authenticated_agent: Agent,
): Promise<Response<string | undefined>> {
  debugger;
  const dex_actor = Actor.createActor(idlFactory, {
    agent: authenticated_agent,
    canisterId: appic_dex,
  });

  try {
    let swap_result = (await dex_actor.swap(swap_args)) as SwapResult;
    if ('Err' in swap_result) {
      console.log(swap_result.Err);
      return {
        message: `${swap_result.Err}`,
        result: undefined,
        success: false,
      };
    }
    return {
      message: '',
      result: `${swap_result.Ok}`,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message: `Failed to call appic dex canister: ${error}`,
      result: undefined,
      success: false,
    };
  }
}

/**
 * Creates the SwapArgs candid type from the given IcpQuote.
 * @param tokenIn The input token object
 * @param tokenOut The output token object
 * @param quote The ICP quote object
 * @returns The SwapArgs object
 */
export function createSwapArgs(quote: IcpQuote): SwapArgs {
  if (quote.route.length === 0) {
    throw new Error('No route available in quote');
  }

  const amountIn = BigInt(quote.amountInRaw);
  const amountOutMinimum = BigInt(quote.minAmountOutRaw);
  const fromSubaccount: [] = []; // Assuming no subaccount
  const tokenIn = quote.tokenIn;
  const tokenOut = quote.tokenOut;

  const prinIn = Principal.fromText(tokenIn.canisterId);

  if (quote.route.length === 1) {
    // Single hop: ExactInputSingle
    const routeItem = quote.route[0];
    const fee = BigInt(routeItem.fee);

    const { token0, token1 } = sortTokens(tokenIn, tokenOut);
    const zero_for_one = tokenIn.canisterId === token0.canisterId;

    const poolId: CandidPoolId = {
      fee,
      token0: Principal.fromText(token0.canisterId),
      token1: Principal.fromText(token1.canisterId),
    };

    const params: ExactInputSingleParams = {
      zero_for_one: zero_for_one,
      from_subaccount: fromSubaccount,
      amount_out_minimum: amountOutMinimum,
      amount_in: amountIn,
      pool_id: poolId,
    };

    return { ExactInputSingle: params };
  } else {
    // Multi hop: ExactInput
    const path: Array<CandidPathKey> = quote.route.map((routeItem) => ({
      fee: BigInt(routeItem.fee),
      intermediary_token: Principal.fromText(routeItem.buy_token),
    }));

    const params: ExactInputParams = {
      token_in: prinIn,
      path,
      from_subaccount: fromSubaccount,
      amount_out_minimum: amountOutMinimum,
      amount_in: amountIn,
    };

    return { ExactInput: params };
  }
}
