import { useSharedStore } from '@/store/store';
import { getStorageItem } from '@/lib/helpers/localstorage';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';

export default function useLogic() {
  const { unAuthenticatedAgent, icpIdentity, evmAddress } = useSharedStore();

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

  return {
    unAuthenticatedAgent,
    bridgePairs,
    evmAddress,
    icpIdentity,
  };
}
