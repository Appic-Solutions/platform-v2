import { useMutation } from '@tanstack/react-query';

import { GetICPSwapQuoteRequest } from '../_types';
import { fetchICPQuote } from '@/blockchain_api/quoter/icp';

const useGetICPSwapQuote = () => {
  return useMutation({
    mutationKey: ['swap-quot'],
    mutationFn: (params: GetICPSwapQuoteRequest) =>
      fetchICPQuote(params.tokenIn, params.tokenOut, params.amount),
  });
};

export { useGetICPSwapQuote };
