import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { TxStatusType } from '@/components/common/ui/toast/types';

export interface GetICPSwapQuoteRequest {
  tokenIn: IcpToken;
  tokenOut: IcpToken;
  amount: string;
}

export interface SwapStatusCachedQuery {
  id: string;
  tokenIn: EvmToken | IcpToken;
  tokenOut: EvmToken | IcpToken;
  amountIn: string;
  status: TxStatusType;
  timestamp: number;
}
