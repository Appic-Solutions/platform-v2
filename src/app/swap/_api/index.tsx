import { useMutation } from '@tanstack/react-query';

import { GetICPSwapQuoteRequest } from '../_types';
import { fetchICPQuote } from '@/blockchain_api/quoter/icp';
import {
  GetNewEvmTokensData,
  getNewEvmTokensData,
} from '@/blockchain_api/functions/swap/get_token_data';

const useGetICPSwapQuote = () => {
  return useMutation({
    mutationKey: ['swap-quot'],
    mutationFn: (params: GetICPSwapQuoteRequest) =>
      fetchICPQuote(params.tokenIn, params.tokenOut, params.amount),
  });
};

const useGetNewEvmTokensData = () => {
  return useMutation({
    mutationKey: ['get-new-evm-token-data'],
    mutationFn: (params: GetNewEvmTokensData) => getNewEvmTokensData(params),
  });
};

export { useGetICPSwapQuote, useGetNewEvmTokensData };
