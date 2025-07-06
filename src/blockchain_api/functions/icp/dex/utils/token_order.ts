import { IcpToken } from '@/blockchain_api/types/tokens';
import { Principal } from '@dfinity/principal';

/**
 * Sorts two token principal IDs based on their byte representations, following Uniswap's logic.
 * Returns an object with token0 and token1, where token0 has the lexicographically smaller byte representation.
 * Throws an error if the two tokens are the same.
 * @param tokenA The first token principal ID.
 * @param tokenB The second token principal ID.
 * @returns An object containing token0 and token1 in sorted order.
 */
export function sortTokens(tokenA: IcpToken, tokenB: IcpToken): { token0: IcpToken; token1: IcpToken } {
    // Validate that tokens are different
    if (Principal.fromText(tokenA.canisterId).compareTo(Principal.fromText(tokenB.canisterId)) == "eq") {
        throw new Error('Tokens must be different');
    }

    // Use ltEq to determine if tokenA is lexicographically less than or equal to tokenB
    if (Principal.fromText(tokenA.canisterId).ltEq(Principal.fromText(tokenB.canisterId))) {
        return { token0: tokenA, token1: tokenB };
    } else {
        return { token0: tokenB, token1: tokenA };
    }
}
