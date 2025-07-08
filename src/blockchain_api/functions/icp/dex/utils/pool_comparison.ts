import { CandidPoolId } from "@/blockchain_api/did/appic/appic_dex/appic_dex_types";

export function arePoolsEqual(pool1: CandidPoolId, pool2: CandidPoolId): boolean{

	// Check if both objects are null or not objects
	if (pool1 === pool2) return true;
	if (!pool1 || !pool2 || typeof pool1 !== 'object' || typeof pool2 !== 'object') return false;

	// Compare fee (bigint)
	if (pool1.fee !== pool2.fee) return false;

	// Compare token0 and token1 (assuming Principal has toText() or can be compared directly)
	// Adjust based on how Principal is represented in your environment
	const token0Equal = pool1.token0.toText ? pool1.token0.toText() === pool2.token0.toText() : pool1.token0 === pool2.token0;
	const token1Equal = pool1.token1.toText ? pool1.token1.toText() === pool2.token1.toText() : pool1.token1 === pool2.token1;

	return token0Equal && token1Equal;
}
