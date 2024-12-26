import { Chain as VeimChain } from 'viem/chains';

export type ChainType = 'ICP' | 'EVM';

export interface Chain {
  chainId: number;
  name: string;
  nativeTokenSymbol: string;
  scannerAddress: string;
  dfinity_ck_deposit_helper_contract?: string;
  dfinity_ck_native_ledger_canister_id?: string;
  appic_deposit_helper_contract?: string;
  appic_twin_native_ledger_canister_id?: string;
  type: ChainType;
  disabled: boolean;
  logo: string;
  dfinity_ck_minter_address?: string;
  appic_minter_address?: string;
  ankr_handle?: string;
  viem_config?: VeimChain;
}
