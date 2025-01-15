import { chains } from '@/blockchain_api/lists/chains';

export const generate_twin_token_symbol = async (evm_symbol: string, chain_id: number) => {
  const chain = chains.find((chain) => chain.chainId == chain_id)!;
  return `ic${evm_symbol.toUpperCase()}.${chain.twin_handle!}`;
};
