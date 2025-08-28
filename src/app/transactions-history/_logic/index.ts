import { useSharedStore } from '@/store/store';
import { getStorageItem } from '@/lib/helpers/localstorage';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { useQuery } from '@tanstack/react-query';
import { get_transaction_history } from '@/blockchain_api/functions/icp/get_bridge_history';
import { HttpAgent } from '@dfinity/agent';

export default function useLogic() {
	const { unAuthenticatedAgent, icpIdentity, evmAddress, icpTokens } = useSharedStore();

	// get data and last fetch time from localstorage
	const getBridgePairsFromLocalStorage = () => {
		const rawData = getStorageItem('bridge-pairs');
		const lastFetchTime = getStorageItem('bridge-pairs-last-fetch-time');
		let parsedData: (EvmToken | IcpToken)[] | null = null;
		try {
			if (rawData?.length && rawData?.length > 0) {
				const data = JSON.parse(rawData);
				if (Array.isArray(data)) {
					parsedData = data as (EvmToken | IcpToken)[];
				}
			}
		} catch (error) {
			console.error('Invalid data format in localStorage:', error);
		}

		return {
			data: parsedData as (EvmToken | IcpToken)[],
			lastFetchTime: lastFetchTime ? parseInt(lastFetchTime) : null,
		};
	};

	const { data: bridgePairs } = getBridgePairsFromLocalStorage();

	const { data, isLoading, isError } = useQuery({
		queryKey: ['bridge-dex-history'],
		queryFn: async () =>
			get_transaction_history(
				evmAddress,
				icpIdentity,
				unAuthenticatedAgent as HttpAgent,
				bridgePairs,
				icpTokens as IcpToken[],
			),
		refetchInterval: 1000 * 60,
		enabled: !!(bridgePairs && icpTokens && unAuthenticatedAgent && (evmAddress || icpIdentity)),
	});

	console.log(data);

	return {
		bridgeData: data?.result.bridge_history,
		dexData: data?.result.dex_history,
		isLoading,
		isError,
		icpIdentity,
		unAuthenticatedAgent,
	};
}
