import { get_bridge_pairs } from '@/blockchain_api/functions/icp/get_bridge_token_pairs';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { getStorageItem, setStorageItem } from '@/lib/localstorage';
import { HttpAgent } from '@dfinity/agent';
import { useQuery } from '@tanstack/react-query';

// set data and last fetch time in localstorage
const setBridgePairsWithTime = (data: (EvmToken | IcpToken)[]) => {
  const currentTime = new Date().getTime();
  setStorageItem('bridge-pairs', JSON.stringify(data));
  setStorageItem('bridge-pairs-last-fetch-time', currentTime.toString());
};

// get data and last fetch time from localstorage
const getBridgePairsWithTime = () => {
  const data = getStorageItem('bridge-pairs');
  const lastFetchTime = getStorageItem('bridge-pairs-last-fetch-time');
  return { data: data ? JSON.parse(data) : null, lastFetchTime: lastFetchTime ? parseInt(lastFetchTime) : null };
};

const useGetBridgePairs = () => {
  const fetchBridgePairs = async () => {
    const { data, lastFetchTime } = getBridgePairsWithTime();
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastFetchTime!;

    if (data && timeDiff < 1000 * 60 * 10) {
      return data;
    } else {
      console.log('ahhhhhhhhh');
      const agent = await HttpAgent.create({ host: process.env.NEXT_PUBLIC_ICP_API_HOST });
      const response = await get_bridge_pairs(agent);
      setBridgePairsWithTime(response.result);
      return response.result;
    }
  };

  return useQuery({
    queryKey: ['bridge-pairs'],
    queryFn: fetchBridgePairs,
    refetchInterval: 1000 * 60 * 10,
  });
};

export { useGetBridgePairs };
