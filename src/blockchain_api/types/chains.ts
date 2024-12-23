export type ChainType = "ICP" | "EVM";

export interface Chain {
  chainId: number | null;
  name: string;
  nativeTokenSymbol: string;
  scannerAddress: string;
  depositHelperAddress: string | null;
  type: ChainType;
  disabled: boolean;
  logo: string;
  dfinity_ck_minter_address?: string;
  appic_minter_address?: string;
  ankr_handle?: string;
}
