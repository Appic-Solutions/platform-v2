import { IcpToken } from '@/blockchain_api/types/tokens';

export interface GetICPSwapQuoteRequest {
  tokenIn: IcpToken;
  tokenOut: IcpToken;
  amount: string;
}
