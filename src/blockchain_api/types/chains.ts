export type ChainType = 'ICP' | 'EVM';

export interface Chain {
  chainId: number;
  name: string;
  nativeTokenSymbol: string;
  scannerAddress: string;
  dfinity_ck_deposit_helper_contract?: string;
  appic_deposit_helper_contract?: string;
  type: ChainType;
  disabled: boolean;
  logo: string;
  dfinity_ck_minter_address?: string;
  appic_minter_address?: string;
  ankr_handle?: string;
}
