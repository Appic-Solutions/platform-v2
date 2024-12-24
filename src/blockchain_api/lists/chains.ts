import { Chain } from '../types/chains';
import { Operator } from '../types/tokens';

export const chains: Chain[] = [
  {
    chainId: 0,
    name: 'ICP',
    nativeTokenSymbol: 'ICP',
    scannerAddress: 'https://dashboard.internetcomupter.org',
    dfinity_ck_deposit_helper_contract: '0x18901044688D3756C35Ed2b36D93e6a5B8e00E68',
    type: 'ICP',
    disabled: false,
    logo: '/images/logo/chains-logos/icp.svg',
  },
  {
    chainId: 1,
    name: 'Ethereum',
    nativeTokenSymbol: 'ETH',
    scannerAddress: 'https://etherscan.io',

    type: 'EVM',
    disabled: false,
    logo: '/images/logo/chains-logos/ethereum.svg',
    dfinity_ck_minter_address: 'sv3dd-oaaaa-aaaar-qacoa-cai',
    ankr_handle: 'eth',
  },
  {
    chainId: 42161,
    name: 'Arbitrum One',
    nativeTokenSymbol: 'ETH',
    scannerAddress: 'https://arbiscan.io',
    type: 'EVM',
    disabled: false,
    logo: '/images/logo/chains-logos/arbitrum.svg',
    ankr_handle: 'arbitrum',
  },
  {
    chainId: 56,
    name: 'BSC',
    nativeTokenSymbol: 'BNB',
    scannerAddress: 'https://bscscan.com',
    type: 'EVM',
    disabled: false,
    logo: '/images/logo/chains-logos/bsc.svg',

    ankr_handle: 'bsc',
  },

  {
    chainId: 137,
    name: 'Polygon',
    nativeTokenSymbol: 'MATIC',
    scannerAddress: 'https://polygonscan.com',
    type: 'EVM',
    disabled: false,
    logo: '/images/logo/chains-logos/polygon.svg',

    ankr_handle: 'polygon',
  },
  {
    chainId: 10,
    name: 'Optimism',
    nativeTokenSymbol: 'ETH',
    scannerAddress: 'https://optimistic.etherscan.io',
    type: 'EVM',
    disabled: false,
    logo: '/images/logo/chains-logos/optimism.svg',

    ankr_handle: 'optimism',
  },
  {
    chainId: 8453,
    name: 'Base',
    nativeTokenSymbol: 'ETH',
    scannerAddress: 'https://basescan.org',
    type: 'EVM',
    disabled: false,
    logo: '/images/logo/chains-logos/base.svg',

    ankr_handle: 'base',
  },
  {
    chainId: 43114,
    name: 'Avalanche',
    nativeTokenSymbol: 'AVAX',
    scannerAddress: 'https://snowtrace.io',
    type: 'EVM',
    disabled: false,
    logo: '/images/logo/chains-logos/avalanche.svg',

    ankr_handle: 'avalanchec',
  },
  {
    chainId: 250,
    name: 'Fantom',
    nativeTokenSymbol: 'FTM',
    scannerAddress: 'https://ftmscan.com',
    type: 'EVM',
    disabled: false,
    logo: '/images/logo/chains-logos/fantom.svg',

    ankr_handle: 'fantom',
  },
];

export const get_minter_addresses = (operator: Operator, chain_id: number): string | undefined => {
  switch (operator) {
    case 'Appic':
      return chains.find((chain) => chain.chainId == chain_id)?.appic_minter_address;
    case 'Dfinity':
      return chains.find((chain) => chain.chainId == chain_id)?.dfinity_ck_minter_address;
  }
};
