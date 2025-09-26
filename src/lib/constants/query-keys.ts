export const queryKeys = {
  icpPools: ['icp-pools'],
	dexData: ['dex-data'],
	bridgePairs: ['bridge-pairs'],
	positions: ['fetch-positions'],
	icpPoolsCreatePosition: ['icp-pools-create-position'], // this query has an interval. so we should separate it from another queries.
} as const;

export type QueryKeys = typeof queryKeys;
export type QueryKeyName = keyof QueryKeys;
