import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { getStorageItem, setStorageItem } from '@/lib/helpers/localstorage';

export const setBridgePairsWithTime = (data: (EvmToken | IcpToken)[]) => {
  const currentTime = new Date().getTime();
  setStorageItem('bridge-pairs', JSON.stringify(data));
  setStorageItem('bridge-pairs-last-fetch-time', currentTime.toString());
};

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
