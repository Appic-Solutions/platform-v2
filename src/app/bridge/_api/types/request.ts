import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { HttpAgent } from '@dfinity/agent';

interface BridgeOptionsListRequest {
  from_token: EvmToken | IcpToken;
  to_token: EvmToken | IcpToken;
  amount: string;
  agent: HttpAgent;
  bridge_pairs: (EvmToken | IcpToken)[];
}

export type { BridgeOptionsListRequest };
