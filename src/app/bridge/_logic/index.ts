import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { getStorageItem, setStorageItem } from '@/common/helpers/localstorage';

// GET AND CACHE BRIDGE PAIRS LOGIC ==================>
// set data and last fetch time in localstorage
export const setBridgePairsWithTime = (data: (EvmToken | IcpToken)[]) => {
  const currentTime = new Date().getTime();
  setStorageItem('bridge-pairs', JSON.stringify(data));
  setStorageItem('bridge-pairs-last-fetch-time', currentTime.toString());
};

// get data and last fetch time from localstorage
export const getBridgePairsFromLocalStorage = () => {
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
    data: parsedData,
    lastFetchTime: lastFetchTime ? parseInt(lastFetchTime) : null,
  };
};
