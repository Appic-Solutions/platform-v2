type ChainType = "ICP" | "EVM";

interface Chain {
  chainId: number | null;
  name: string;
  nativeTokenSymbol: string;
  scannerAddress: string;
  depositHelperAddress: string | null;
  type: ChainType;
  disabled: Boolean;
  logo: String;
}
