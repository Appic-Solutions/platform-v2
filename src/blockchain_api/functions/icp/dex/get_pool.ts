import { Actor, Agent, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../did/appic/appic_dex/appic_dex.did";
import { CandidPoolState, CandidPoolId } from "../../../did/appic/appic_dex/appic_dex_types";
import { appic_dex } from "../../../../canister_ids.json";
import { Response } from "@/blockchain_api/types/response";
import { FEE_TIERS } from "./constants";
import { Principal } from "@dfinity/principal";
import { sortTokens } from "./utils/token_order";
import BigNumber from 'bignumber.js';
import { IcpToken } from "@/blockchain_api/types/tokens";

export interface Pool {
    pool_id: CandidPoolId,
    sqrt_price_x96: string,
    pool_reserves0: string,
    pool_reserves1: string,
    fee_protocol: string,
    token0_transfer_fee: string,
    swap_volume1_all_time: string,
    fee_growth_global_1_x128: string,
    tick: string,
    liquidity: string,
    generated_swap_fee0: string,
    generated_swap_fee1: string,
    swap_volume0_all_time: string,
    fee_growth_global_0_x128: string,
    max_liquidity_per_tick: string,
    token1_transfer_fee: string,
    tick_spacing: string,
    // Optional USD fields
    reserves0_usd?: string,
    reserves1_usd?: string,
    tvl_usd?: string,
    swap_volume_all_time_usd?: string,
    generated_swap_fee0_usd?: string,
    generated_swap_fee1_usd?: string,
    generated_swap_fee_all_time_usd?: string,
}

export async function get_all_pools(
    unAuthenticated_agent: HttpAgent,
    all_icp_tokens: IcpToken[]
): Promise<Response<Pool[]>> {
    const dex_actor = Actor.createActor(idlFactory, {
        agent: unAuthenticated_agent,
        canisterId: appic_dex,
    });

    try {
        let pools = await dex_actor.get_pools() as [CandidPoolId, CandidPoolState][];

        const tokenMap = new Map<string, IcpToken>();
        all_icp_tokens.forEach(token => {
            tokenMap.set(token.canisterId, token);
        });

        let transformed_pools = pools.map(([poolId, poolState]) => {
            const pool: Pool = {
                pool_id: poolId,
                sqrt_price_x96: poolState.sqrt_price_x96.toString(),
                pool_reserves0: poolState.pool_reserves0.toString(),
                pool_reserves1: poolState.pool_reserves1.toString(),
                fee_protocol: poolState.fee_protocol.toString(),
                token0_transfer_fee: poolState.token0_transfer_fee.toString(),
                swap_volume1_all_time: poolState.swap_volume1_all_time.toString(),
                fee_growth_global_1_x128: poolState.fee_growth_global_1_x128.toString(),
                tick: poolState.tick.toString(),
                liquidity: poolState.liquidity.toString(),
                generated_swap_fee0: poolState.generated_swap_fee0.toString(),
                generated_swap_fee1: poolState.generated_swap_fee1.toString(),
                swap_volume0_all_time: poolState.swap_volume0_all_time.toString(),
                fee_growth_global_0_x128: poolState.fee_growth_global_0_x128.toString(),
                max_liquidity_per_tick: poolState.max_liquidity_per_tick.toString(),
                token1_transfer_fee: poolState.token1_transfer_fee.toString(),
                tick_spacing: poolState.tick_spacing.toString(),
            };

            const token0Info = tokenMap.get(poolId.token0.toText());
            const token1Info = tokenMap.get(poolId.token1.toText());
            if (token0Info && token1Info) {
                const reserves0 = new BigNumber(pool.pool_reserves0).dividedBy(new BigNumber(10).pow(token0Info.decimals));
                const reserves1 = new BigNumber(pool.pool_reserves1).dividedBy(new BigNumber(10).pow(token1Info.decimals));
                const price0 = new BigNumber(token0Info.usdPrice);
                const price1 = new BigNumber(token1Info.usdPrice);

                pool.reserves0_usd = reserves0.multipliedBy(price0).toString();
                pool.reserves1_usd = reserves1.multipliedBy(price1).toString();
                pool.tvl_usd = reserves0.multipliedBy(price0).plus(reserves1.multipliedBy(price1)).toString();

                const swap_volume0 = new BigNumber(pool.swap_volume0_all_time).dividedBy(new BigNumber(10).pow(token0Info.decimals));
                const swap_volume1 = new BigNumber(pool.swap_volume1_all_time).dividedBy(new BigNumber(10).pow(token1Info.decimals));
                pool.swap_volume_all_time_usd = swap_volume0.multipliedBy(price0).plus(swap_volume1.multipliedBy(price1)).toString();

                const generated_swap_fee0 = new BigNumber(pool.generated_swap_fee0).dividedBy(new BigNumber(10).pow(token0Info.decimals));
                const generated_swap_fee1 = new BigNumber(pool.generated_swap_fee1).dividedBy(new BigNumber(10).pow(token1Info.decimals));
                pool.generated_swap_fee0_usd = generated_swap_fee0.multipliedBy(price0).toString();
                pool.generated_swap_fee1_usd = generated_swap_fee1.multipliedBy(price1).toString();
                pool.generated_swap_fee_all_time_usd = generated_swap_fee0.multipliedBy(price0).plus(generated_swap_fee1.multipliedBy(price1)).toString();
            }

            return pool;
        });

        return { success: true, result: transformed_pools, message: "" };
    } catch (error) {
        return {
            success: false,
            result: [],
            message: String(error)
        };
    }
}

export async function get_pool_by_id(
    token_a: IcpToken,
    token_b: IcpToken,
    pool_fee: string,
    unAuthenticated_agent: HttpAgent
): Promise<Pool | undefined> {
    const dex_actor = Actor.createActor(idlFactory, {
        agent: unAuthenticated_agent,
        canisterId: appic_dex,
    });

    try {
        const principal_a = Principal.fromText(token_a.canisterId);
        const principal_b = Principal.fromText(token_b.canisterId);
        const { token0, token1 } = sortTokens(principal_a, principal_b);
        const pool_id: CandidPoolId = {
            token0,
            token1,
            fee:BigInt(pool_fee),
        };

        const result = await dex_actor.get_pool(pool_id) as [CandidPoolState] | [];

        if (result.length === 0) {
            return undefined;
        }

        const poolState = result[0];

        const pool: Pool = {
            pool_id: pool_id,
            sqrt_price_x96: poolState.sqrt_price_x96.toString(),
            pool_reserves0: poolState.pool_reserves0.toString(),
            pool_reserves1: poolState.pool_reserves1.toString(),
            fee_protocol: poolState.fee_protocol.toString(),
            token0_transfer_fee: poolState.token0_transfer_fee.toString(),
            swap_volume1_all_time: poolState.swap_volume1_all_time.toString(),
            fee_growth_global_1_x128: poolState.fee_growth_global_1_x128.toString(),
            tick: poolState.tick.toString(),
            liquidity: poolState.liquidity.toString(),
            generated_swap_fee0: poolState.generated_swap_fee0.toString(),
            generated_swap_fee1: poolState.generated_swap_fee1.toString(),
            swap_volume0_all_time: poolState.swap_volume0_all_time.toString(),
            fee_growth_global_0_x128: poolState.fee_growth_global_0_x128.toString(),
            max_liquidity_per_tick: poolState.max_liquidity_per_tick.toString(),
            token1_transfer_fee: poolState.token1_transfer_fee.toString(),
            tick_spacing: poolState.tick_spacing.toString(),
        };

        const token0Info = [token_a, token_b].find(t => t.canisterId === pool_id.token0.toText());
        const token1Info = [token_a, token_b].find(t => t.canisterId === pool_id.token1.toText());
        if (token0Info && token1Info) {
            const reserves0 = new BigNumber(pool.pool_reserves0).dividedBy(new BigNumber(10).pow(token0Info.decimals));
            const reserves1 = new BigNumber(pool.pool_reserves1).dividedBy(new BigNumber(10).pow(token1Info.decimals));
            const price0 = new BigNumber(token0Info.usdPrice);
            const price1 = new BigNumber(token1Info.usdPrice);

            pool.reserves0_usd = reserves0.multipliedBy(price0).toString();
            pool.reserves1_usd = reserves1.multipliedBy(price1).toString();
            pool.tvl_usd = reserves0.multipliedBy(price0).plus(reserves1.multipliedBy(price1)).toString();

            const swap_volume0 = new BigNumber(pool.swap_volume0_all_time).dividedBy(new BigNumber(10).pow(token0Info.decimals));
            const swap_volume1 = new BigNumber(pool.swap_volume1_all_time).dividedBy(new BigNumber(10).pow(token1Info.decimals));
            pool.swap_volume_all_time_usd = swap_volume0.multipliedBy(price0).plus(swap_volume1.multipliedBy(price1)).toString();

            const generated_swap_fee0 = new BigNumber(pool.generated_swap_fee0).dividedBy(new BigNumber(10).pow(token0Info.decimals));
            const generated_swap_fee1 = new BigNumber(pool.generated_swap_fee1).dividedBy(new BigNumber(10).pow(token1Info.decimals));
            pool.generated_swap_fee0_usd = generated_swap_fee0.multipliedBy(price0).toString();
            pool.generated_swap_fee1_usd = generated_swap_fee1.multipliedBy(price1).toString();
            pool.generated_swap_fee_all_time_usd = generated_swap_fee0.multipliedBy(price0).plus(generated_swap_fee1.multipliedBy(price1)).toString();
        }

        return pool;
    } catch (error) {
        console.error("Error fetching pool:", error);
        return undefined;
    }
}

export async function get_pools_by_tokens(
    token_a: IcpToken,
    token_b: IcpToken,
    unAuthenticated_agent:HttpAgent
): Promise<Pool[]> {
    const dex_actor = Actor.createActor(idlFactory, {
        agent: unAuthenticated_agent,
        canisterId: appic_dex,
    });

    const pools: Pool[] = [];

    try {
        const principal_a = Principal.fromText(token_a.canisterId);
        const principal_b = Principal.fromText(token_b.canisterId);
        const { token0, token1 } = sortTokens(principal_a, principal_b);

        for (const fee of FEE_TIERS) {
            const poolId0: CandidPoolId = {
                token0,
                token1,
                fee: BigInt(fee),
            };
            const poolId1: CandidPoolId = {
                token0: token1,
                token1: token0,
                fee: BigInt(fee),
            };

            const poolIds = [poolId0, poolId1];

            for (const pool_id of poolIds) {
                const result = await dex_actor.get_pool(pool_id) as [CandidPoolState] | [];

                if (result.length !== 0) {
                    const poolState = result[0];
                    const pool: Pool = {
                        pool_id,
                        sqrt_price_x96: poolState.sqrt_price_x96.toString(),
                        pool_reserves0: poolState.pool_reserves0.toString(),
                        pool_reserves1: poolState.pool_reserves1.toString(),
                        fee_protocol: poolState.fee_protocol.toString(),
                        token0_transfer_fee: poolState.token0_transfer_fee.toString(),
                        swap_volume1_all_time: poolState.swap_volume1_all_time.toString(),
                        fee_growth_global_1_x128: poolState.fee_growth_global_1_x128.toString(),
                        tick: poolState.tick.toString(),
                        liquidity: poolState.liquidity.toString(),
                        generated_swap_fee0: poolState.generated_swap_fee0.toString(),
                        generated_swap_fee1: poolState.generated_swap_fee1.toString(),
                        swap_volume0_all_time: poolState.swap_volume0_all_time.toString(),
                        fee_growth_global_0_x128: poolState.fee_growth_global_0_x128.toString(),
                        max_liquidity_per_tick: poolState.max_liquidity_per_tick.toString(),
                        token1_transfer_fee: poolState.token1_transfer_fee.toString(),
                        tick_spacing: poolState.tick_spacing.toString(),
                    };

                    const token0Info = [token_a, token_b].find(t => t.canisterId === pool_id.token0.toText());
                    const token1Info = [token_a, token_b].find(t => t.canisterId === pool_id.token1.toText());
                    if (token0Info && token1Info) {
                        const reserves0 = new BigNumber(pool.pool_reserves0).dividedBy(new BigNumber(10).pow(token0Info.decimals));
                        const reserves1 = new BigNumber(pool.pool_reserves1).dividedBy(new BigNumber(10).pow(token1Info.decimals));
                        const price0 = new BigNumber(token0Info.usdPrice);
                        const price1 = new BigNumber(token1Info.usdPrice);

                        pool.reserves0_usd = reserves0.multipliedBy(price0).toString();
                        pool.reserves1_usd = reserves1.multipliedBy(price1).toString();
                        pool.tvl_usd = reserves0.multipliedBy(price0).plus(reserves1.multipliedBy(price1)).toString();

                        const swap_volume0 = new BigNumber(pool.swap_volume0_all_time).dividedBy(new BigNumber(10).pow(token0Info.decimals));
                        const swap_volume1 = new BigNumber(pool.swap_volume1_all_time).dividedBy(new BigNumber(10).pow(token1Info.decimals));
                        pool.swap_volume_all_time_usd = swap_volume0.multipliedBy(price0).plus(swap_volume1.multipliedBy(price1)).toString();

                        const generated_swap_fee0 = new BigNumber(pool.generated_swap_fee0).dividedBy(new BigNumber(10).pow(token0Info.decimals));
                        const generated_swap_fee1 = new BigNumber(pool.generated_swap_fee1).dividedBy(new BigNumber(10).pow(token1Info.decimals));
                        pool.generated_swap_fee0_usd = generated_swap_fee0.multipliedBy(price0).toString();
                        pool.generated_swap_fee1_usd = generated_swap_fee1.multipliedBy(price1).toString();
                        pool.generated_swap_fee_all_time_usd = generated_swap_fee0.multipliedBy(price0).plus(generated_swap_fee1.multipliedBy(price1)).toString();
                    }

                    pools.push(pool);
                }
            }
        }
    } catch (error) {
        console.error("Error fetching pools for tokens:", error);
        return pools;
    }

    return pools;
}
