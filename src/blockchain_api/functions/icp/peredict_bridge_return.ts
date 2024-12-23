import { ChainType } from '@/blockchain_api/types/chains';
import { EvmToken, IcpToken, Operator } from '@/blockchain_api/types/tokens';
import { useEstimateGas } from 'wagmi';
import { prepareEncodeFunctionData } from 'viem';
import appic_minter_abi from '../../abi/appic_minter.json';
import { Principal } from '@dfinity/principal';
import { chains } from '@/blockchain_api/lists/chains';

import { Response } from '@/blockchain_api/types/response';

import { Actor, HttpAgent } from '@dfinity/agent';

// Appic minter idl factory and types
import { idlFactory as AppicIdlFactory } from '@/blockchain_api/did/appic/appic_minter/appic_minter.did';
import { MinterInfo } from '@/blockchain_api/did/appic/appic_minter/appic_minter_types';
import { is_native_token } from './utils/erc20_helpers';

enum Badge {
  BEST = 'Best Return',
  FASTEST = 'Fastest',
  CHEAPEST = 'Cheapest',
}
enum TxType {
  Deposit,
  Withdrawal,
}

interface Gas {
  symbol: string;
  chain_type: ChainType;
  canister_id?: string;
  contract_address?: string;
  gas_fee: string; // network fee
  gas_fee_usd: string;
}

type MinterAddress = Principal;

interface BridgeOption {
  id: string;
  bridge_tx_type: TxType;
  minter_id: string;
  operator: Operator;
  estimated_return: string;
  minter_fee: string;
  total_fee: string; // minter_fee + gas_fee
  via: string;
  duration: string;
  usdPrice: string;
  isBest: boolean;
  isActive: boolean;
  badge: Badge;
}

// export const calculate_bridge_options = async (
//   from_token: EvmToken | IcpToken,
//   to_token: EvmToken | IcpToken,
//   agent: HttpAgent,
// ): Promise<Response<BridgeOption[]>> => {
//   // Get bridge metadata
//   let { tx_type, minter_address, operator, chain_id } = get_beidge_metadata(from_token, to_token);
//   let minter_fee: string;
//   // Get minter deposit and witdrawal fees
//   try {
//     minter_fee = (await get_minter_fee(agent, operator, minter_address, tx_type)).result;
//   } catch (error) {
//     return {
//       result: [],
//       message: `Error fetching minter fees, ${error}`,
//       success: false,
//     };
//   }

//   if (tx_type == TxType.Deposit) {
//     // Estimte Fees
//   } else if (tx_type == TxType.Withdrawal) {
//   } else {
//     return {
//       message: 'Tokens are not supported',
//       result: [],
//       success: false,
//     };
//   }
// };

// let result = encodeFunctionData({ abi: appic_abi, functionName: "dseposit", args: ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", "0", principal_bytes, "0x0000000000000000000000000000000000000000000000000000000000000000"] });

function estimate_gas_price() {}

const get_beidge_metadata = (
  from_token: EvmToken | IcpToken,
  to_token: EvmToken | IcpToken,
): {
  tx_type: TxType;
  minter_address: Principal;
  operator: Operator;
  chain_id: number;
  is_native: boolean;
} => {
  // In case of ICP to EVM (Withdrawal Transaction)
  if (from_token.chain_type == 'ICP' && to_token.chain_type == 'EVM') {
    let operator = from_token.operator!;
    let chain_id = to_token.chainId;

    return {
      tx_type: TxType.Withdrawal,
      minter_address: get_minter_address(operator, chain_id),
      operator,
      chain_id,
      is_native: is_native_token(to_token.contractAddress!),
    };

    // In case of EVM to ICP (Deposit Transaction)
  } else {
    let operator = to_token.operator!;
    let chain_id = from_token.chainId;
    return {
      tx_type: TxType.Deposit,
      minter_address: get_minter_address(operator, chain_id),
      operator: to_token.operator!,
      chain_id,
      is_native: is_native_token(from_token.contractAddress!),
    };
  }
};

const get_minter_address = (opertor: Operator, chain_id: number): Principal => {
  switch (opertor) {
    case 'Appic':
      return Principal.fromText(chains.find((chain) => chain.chainId == chain_id)?.dfinity_ck_minter_address!);

    case 'Dfinity':
      return Principal.fromText(chains.find((chain) => chain.chainId == chain_id)?.appic_minter_address!);
  }
};

const get_minter_fee = async (
  agent: HttpAgent,
  operator: Operator,
  minter_address: Principal,
  tx_type: TxType,
): Promise<Response<string>> => {
  if (operator == 'Appic') {
    const appic_minter_actor = Actor.createActor(AppicIdlFactory, {
      agent,
      canisterId: minter_address,
    });

    try {
      const minter_info = (await appic_minter_actor.get_minter_info()) as MinterInfo;

      const feeMap = {
        [TxType.Deposit]: minter_info.deposit_native_fee.toString(),
        [TxType.Withdrawal]: minter_info.withdrawal_native_fee.toString(),
      };

      const minter_fee = feeMap[tx_type];

      return {
        result: minter_fee,
        success: true,
        message: '',
      };

      // Error handling
    } catch (error) {
      throw {
        result: '0',
        message: `Error fetching icp token list, ${error}`,
        success: false,
      };
    }
  } else {
    return {
      result: '0',
      success: true,
      message: '',
    };
  }
};

// const get_contract_function_data = (): string => {};
