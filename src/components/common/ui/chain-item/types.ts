import { Chain } from '@/blockchain_api/types/chains';

export interface ChainItemProps {
  chain: Chain;
  selectedId: number;
  disabled: boolean;
  onClick: (chain: Chain) => void;
}
