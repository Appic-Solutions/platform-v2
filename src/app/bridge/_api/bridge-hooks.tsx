import { get_bridge_options } from '@/blockchain_api/functions/icp/get_bridge_options';
import { get_bridge_pairs } from '@/blockchain_api/functions/icp/get_bridge_token_pairs';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { getStorageItem, setStorageItem } from '@/lib/localstorage';
import { HttpAgent } from '@dfinity/agent';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BridgeOptionsListRequest } from './types/request';

// GET AND CACHE BRIDGE PAIRS LOGIC ==================>
// set data and last fetch time in localstorage
const setBridgePairsWithTime = (data: (EvmToken | IcpToken)[]) => {
  const currentTime = new Date().getTime();
  setStorageItem('bridge-pairs', JSON.stringify(data));
  setStorageItem('bridge-pairs-last-fetch-time', currentTime.toString());
};

// get data and last fetch time from localstorage
const getBridgePairsFromLocalStorage = () => {
  const rawData = getStorageItem('bridge-pairs');
  const lastFetchTime = getStorageItem('bridge-pairs-last-fetch-time');
  let parsedData: (EvmToken | IcpToken)[] | null = null;
  try {
    if (rawData?.length && rawData?.length > 0) {
      console.log(rawData);
      const data = JSON.parse(rawData);
      if (Array.isArray(data)) {
        parsedData = data as (EvmToken | IcpToken)[];
      }
    }
  } catch (error) {
    console.error('Invalid data format in localStorage:', error);
  }

  return {
    data: parsedData,
    lastFetchTime: lastFetchTime ? parseInt(lastFetchTime) : null,
  };
};

const useGetBridgePairs = (agent: HttpAgent | undefined) => {
  const refetchTime = 1000 * 60 * 10;
  const fetchBridgePairs = async () => {
    const { data, lastFetchTime } = getBridgePairsFromLocalStorage();
    const currentTime = new Date().getTime();
    const timeDiff = lastFetchTime ? currentTime - lastFetchTime : Infinity;

    if (data && timeDiff < refetchTime) {
      return data;
    } else {
      if (!agent) throw new Error('Agent is not available!');

      const response = await get_bridge_pairs(agent);
      setBridgePairsWithTime(response.result);
      return response.result;
    }
  };

  return useQuery({
    queryKey: ['bridge-pairs'],
    queryFn: fetchBridgePairs,
    refetchInterval: refetchTime,
    enabled: !!agent,
  });
};

const useGetBridgeOptions = () => {
  return useMutation({
    mutationKey: ['bridge-options'],
    mutationFn: (params: BridgeOptionsListRequest) =>
      get_bridge_options(params.from_token, params.to_token, params.amount, params.agent, params.bridge_pairs),
  });
};

export { useGetBridgePairs, useGetBridgeOptions };
