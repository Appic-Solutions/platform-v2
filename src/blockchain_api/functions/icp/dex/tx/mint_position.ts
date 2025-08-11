import {
  MintPositionArgs,
  Result_6 as MintPositionResult,
  CreatePoolArgs,
  Result_2 as CreatePoolResult,
} from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
import { idlFactory as appicDexIdlFactory } from '@/blockchain_api/did/appic/appic_dex/appic_dex.did';

import {
  GenerateMintPositionArgsParams,
  generate_mint_position_args,
} from '../calculate_mint_amounts';
import { idlFactory as IcrcIdlFactory } from '@/blockchain_api/did/ledger/icrc.did';
import {
  Account,
  ApproveArgs,
  Result_2 as ApprvalResult,
  Allowance,
  AllowanceArgs,
} from '@/blockchain_api/did/ledger/icrc_types';
import { Agent, HttpAgent, Actor } from '@dfinity/agent';
import { Response } from '@/blockchain_api/types/response';
import { appic_dex } from '@/canister_ids.json';
import { Principal } from '@dfinity/principal';
import BigNumber from 'bignumber.js';

// step 1
// for minting position first we need to generate the mint_position args and then approve the token 0 and token 1 spending
export async function generate_args_and_approve_mint_position(
  args: GenerateMintPositionArgsParams,
  authenticated_agent: Agent, // HttpAgent , Agent
  unauthenticated_agent: HttpAgent,
): Promise<Response<MintPositionArgs | undefined>> {
  let { mint_position_args, token1_approval_amount, token0_approval_amount } =
    generate_mint_position_args(args);

  // approval tx

  const token0_actor = Actor.createActor(IcrcIdlFactory, {
    agent: authenticated_agent,
    canisterId: mint_position_args.pool.token0,
  });

  const token0_actor_unauthenticated = Actor.createActor(IcrcIdlFactory, {
    agent: unauthenticated_agent,
    canisterId: mint_position_args.pool.token0,
  });

  const token1_actor = Actor.createActor(IcrcIdlFactory, {
    agent: authenticated_agent,
    canisterId: mint_position_args.pool.token1,
  });

  const token1_actor_unauthenticated = Actor.createActor(IcrcIdlFactory, {
    agent: unauthenticated_agent,
    canisterId: mint_position_args.pool.token1,
  });

  try {
    const sender_principal = await authenticated_agent.getPrincipal();

    // Check the allowances
    const token0_allowance = (await token0_actor_unauthenticated.icrc2_allowance({
      account: {
        owner: sender_principal,
        subaccount: [],
      },
      spender: { owner: Principal.fromText(appic_dex), subaccount: [] },
    } as AllowanceArgs)) as Allowance;

    const token1_allowance = (await token1_actor_unauthenticated.icrc2_allowance({
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
      BigNumber(token0_allowance.allowance.toString()).isLessThan(BigNumber(token0_approval_amount))
    ) {
      // In case of Native withdrawal
      const token0_approval_result = (await token0_actor.icrc2_approve({
        amount: BigInt(new BigNumber(token0_approval_amount).toString()),
        created_at_time: [],
        expected_allowance: [],
        expires_at: [],
        fee: [],
        from_subaccount: [],
        memo: [],
        spender: { owner: Principal.fromText(appic_dex), subaccount: [] } as Account,
      } as ApproveArgs)) as ApprvalResult;

      if ('Err' in token0_approval_result) {
        return {
          result: undefined,
          success: false,
          message: `Failed to approve allowance:${token0_approval_result.Err}`,
        };
      }
    }

    // token1
    if (
      BigNumber(token1_allowance.allowance.toString()).isLessThan(BigNumber(token1_approval_amount))
    ) {
      // In case of Native withdrawal
      const token1_approval_result = (await token1_actor.icrc2_approve({
        amount: BigInt(new BigNumber(token1_approval_amount).toString()),
        created_at_time: [],
        expected_allowance: [],
        expires_at: [],
        fee: [],
        from_subaccount: [],
        memo: [],
        spender: { owner: Principal.fromText(appic_dex), subaccount: [] } as Account,
      } as ApproveArgs)) as ApprvalResult;

      if ('Err' in token1_approval_result) {
        return {
          result: undefined,
          success: false,
          message: `Failed to approve allowance:${token1_approval_result.Err}`,
        };
      }
    }

    return {
      success: true,
      result: mint_position_args,
      message: '',
    };
  } catch (error) {
    return {
      success: false,
      result: undefined,
      message: `Failed to approve token spendings, please try again later. ${error}`,
    };
  }
}

// step 2
export async function mint_position(
  pool_exists: boolean,
  sqrt_price_x96: string,
  mint_position_args: MintPositionArgs,
  authenticated_agent: Agent,
): Promise<Response<string | undefined>> {
  const dex_actor = Actor.createActor(appicDexIdlFactory, {
    agent: authenticated_agent,
    canisterId: appic_dex,
  });

  try {
    if (pool_exists) {
      let mint_position_result = (await dex_actor.mint_position(
        mint_position_args,
      )) as MintPositionResult;
      if ('Err' in mint_position_result) {
        return {
          message: `Failed to mint position please try again. ${mint_position_result.Err}`,
          result: undefined,
          success: false,
        };
      }
      return {
        message: '',
        result: mint_position_result.Ok.toString(),
        success: true,
      };

      // first create the pool and then mint the position
    } else {
      const transformed_args: CreatePoolArgs = {
        token_a: mint_position_args.pool.token0,
        token_b: mint_position_args.pool.token1,
        fee: mint_position_args.pool.fee,
        sqrt_price_x96: BigInt(sqrt_price_x96),
      };

      let create_pool_result = (await dex_actor.create_pool(transformed_args)) as CreatePoolResult;
      if ('Err' in create_pool_result && !('PoolAlreadyExists' in create_pool_result.Err)) {
        return {
          message: `Failed to create the pool please try again later. ${create_pool_result.Err}`,
          result: undefined,
          success: false,
        };
      }

      let mint_position_result = (await dex_actor.mint_position(
        mint_position_args,
      )) as MintPositionResult;
      if ('Err' in mint_position_result) {
        return {
          message: `Failed to mint position please try again later. ${mint_position_result.Err}`,
          result: undefined,
          success: false,
        };
      }
      return {
        message: '',
        result: mint_position_result.Ok.toString(),
        success: true,
      };
    }
  } catch (error) {
    return {
      message: `Failed to mint position please try again later. ${error}`,
      result: undefined,
      success: false,
    };
  }
}
