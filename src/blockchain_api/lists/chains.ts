import { Chain } from '../types/chains';
import { Operator } from '../types/tokens';
import { mainnet, bsc, polygon, fantom, arbitrum, base, avalanche, optimism } from 'viem/chains';
export const chains: Chain[] = [
  {
    chainId: 0,
    name: 'ICP',
    nativeTokenSymbol: 'ICP',
    scannerAddress: 'https://dashboard.internetcomupter.org',
    type: 'ICP',
    rpc_url: '',
    disabled: false,
    is_advance_supported: false,

    logo: '/images/logo/chains-logos/icp.svg',

    twin_token_support: false,
  },
  {
    chainId: 1,
    name: 'Ethereum',
    nativeTokenSymbol: 'ETH',
    scannerAddress: 'https://etherscan.io',
    type: 'EVM',
    rpc_url: 'https://ethereum-rpc.publicnode.com',
    disabled: false,
    logo: '/images/logo/chains-logos/ethereum.svg',
    dfinity_ck_minter_address: 'sv3dd-oaaaa-aaaar-qacoa-cai',
    dfinity_ck_deposit_helper_contract: '0x18901044688D3756C35Ed2b36D93e6a5B8e00E68',
    dfinity_ck_native_ledger_canister_id: 'ss2fx-dyaaa-aaaar-qacoq-cai',
    ankr_handle: 'eth',
    is_advance_supported: false,
    viem_config: mainnet,
    twin_handle: 'eth',

    twin_token_support: false,
  },
  {
    chainId: 56,
    name: 'BSC',
    nativeTokenSymbol: 'BNB',
    scannerAddress: 'https://bscscan.com',
    type: 'EVM',
    rpc_url: 'https://bsc-rpc.publicnode.com',
    disabled: false,
    logo: '/images/logo/chains-logos/bsc.svg',
    appic_deposit_helper_contract: '0x8f45574222F7372E23b5e9b1900abaeAA7571119',
    appic_minter_address: '2ztvj-yaaaa-aaaap-ahiza-cai',
    appic_twin_native_ledger_canister_id: 'n44gr-qyaaa-aaaam-qbuha-cai',
    ankr_handle: 'bsc',
    is_advance_supported: true,
    viem_config: bsc,
    twin_handle: 'bsc',

    twin_token_support: true,
  },
  {
    chainId: 8453,
    name: 'Base',
    nativeTokenSymbol: 'ETH',
    scannerAddress: 'https://basescan.org',
    type: 'EVM',
    rpc_url: 'https://base-rpc.publicnode.com',
    disabled: false,
    is_advance_supported: false,
    logo: '/images/logo/chains-logos/base.svg',
    appic_deposit_helper_contract: '0x6b3aDc89A0CA462F2aB9FbEf2f25DB6eA3aA1D00',
    appic_minter_address: '4ati2-naaaa-aaaad-qg6la-cai',
    appic_twin_native_ledger_canister_id: '3iven-myaaa-aaaai-q3u5q-cai',
    ankr_handle: 'base',
    viem_config: base,
    twin_handle: 'base',

    twin_token_support: true,
  },
  {
    chainId: 42161,
    name: 'Arbitrum One',
    nativeTokenSymbol: 'ETH',
    scannerAddress: 'https://arbiscan.io',
    type: 'EVM',
    rpc_url: 'https://arbitrum-one-rpc.publicnode.com',
    disabled: true,
    is_advance_supported: false,
    logo: '/images/logo/chains-logos/arbitrum.svg',
    ankr_handle: 'arbitrum',
    viem_config: arbitrum,
    twin_handle: 'arb',

    twin_token_support: false,
  },
  {
    chainId: 137,
    name: 'Polygon',
    nativeTokenSymbol: 'MATIC',
    scannerAddress: 'https://polygonscan.com',
    type: 'EVM',
    rpc_url: 'https://base-rpc.publicnode.com',
    disabled: true,
    is_advance_supported: false,
    logo: '/images/logo/chains-logos/polygon.svg',

    ankr_handle: 'polygon',
    viem_config: polygon,
    twin_handle: 'pol',

    twin_token_support: false,
  },
  {
    chainId: 10,
    name: 'Optimism',
    nativeTokenSymbol: 'ETH',
    scannerAddress: 'https://optimistic.etherscan.io',
    type: 'EVM',
    rpc_url: 'https://base-rpc.publicnode.com',
    disabled: true,
    is_advance_supported: false,
    logo: '/images/logo/chains-logos/optimism.svg',

    ankr_handle: 'optimism',
    viem_config: optimism,
    twin_handle: 'op',

    twin_token_support: false,
  },
  {
    chainId: 43114,
    name: 'Avalanche',
    nativeTokenSymbol: 'AVAX',
    scannerAddress: 'https://snowtrace.io',
    type: 'EVM',
    rpc_url: 'https://base-rpc.publicnode.com',
    disabled: true,
    is_advance_supported: false,
    logo: '/images/logo/chains-logos/avalanche.svg',

    ankr_handle: 'avalanchec',
    viem_config: avalanche,

    twin_token_support: false,
  },
  {
    chainId: 250,
    name: 'Fantom',
    nativeTokenSymbol: 'FTM',
    scannerAddress: 'https://ftmscan.com',
    type: 'EVM',
    rpc_url: 'https://fantom-rpc.publicnode.com',
    disabled: true,
    is_advance_supported: false,
    logo: '/images/logo/chains-logos/fantom.svg',

    ankr_handle: 'fantom',
    viem_config: fantom,

    twin_token_support: false,
  },
  {
    chainId: 355113,
    name: 'Bitfinity',
    nativeTokenSymbol: 'BTF',
    scannerAddress: 'https://explorer.mainnet.bitfinity.network/',
    type: 'EVM',
    rpc_url: 'https://mainnet.bitfinity.network/',
    disabled: true,
    is_advance_supported: false,
    logo: '/images/logo/chains-logos/bitfinity.png',

    twin_token_support: false,
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
