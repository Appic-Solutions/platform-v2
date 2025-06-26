import { Principal } from '@dfinity/principal';

/**
 * Sorts two token principal IDs based on their byte representations, following Uniswap's logic.
 * Returns an object with token0 and token1, where token0 has the lexicographically smaller byte representation.
 * Throws an error if the two tokens are the same.
 * @param tokenA The first token principal ID.
 * @param tokenB The second token principal ID.
 * @returns An object containing token0 and token1 in sorted order.
 */
export function sortTokens(tokenA: Principal, tokenB: Principal): { token0: Principal; token1: Principal } {
    // Validate that tokens are different
    if (tokenA.compareTo(tokenB) == "eq") {
        throw new Error('Tokens must be different');
    }

    // Use ltEq to determine if tokenA is lexicographically less than or equal to tokenB
    if (tokenA.ltEq(tokenB)) {
        return { token0: tokenA, token1: tokenB };
    } else {
        return { token0: tokenB, token1: tokenA };
    }
}
