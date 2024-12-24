import { ChainType } from '@/blockchain_api/types/chains';
import { EvmToken, IcpToken, Operator } from '@/blockchain_api/types/tokens';
import { useEstimateGas } from 'wagmi';
import { encodeFunctionData, prepareEncodeFunctionData } from 'viem';
import appic_minter_abi from '../../abi/appic_minter.json';
import dfinity_ck_minter_abi from '../../abi/dfinity_minter.json';

import { Principal } from '@dfinity/principal';
import { chains } from '@/blockchain_api/lists/chains';
import { useState, useEffect, useMemo, useCallback } from 'react';

import { Actor, HttpAgent } from '@dfinity/agent';

// Appic minter idl factory and types
import { idlFactory as AppicIdlFactory } from '@/blockchain_api/did/appic/appic_minter/appic_minter.did';
import {
  MinterInfo,
  Eip1559TransactionPrice as AppicEip1559TransactionPrice,
  Eip1559TransactionPriceArg as AppicEip1559TransactionPriceArg,
} from '@/blockchain_api/did/appic/appic_minter/appic_minter_types';

// Dfinity minter idl factory and types
import { idlFactory as DfinityIdlFactory } from '@/blockchain_api/did/appic/appic_minter/appic_minter.did';
import {
  Eip1559TransactionPrice as DfinityEip1559TransactionPrice,
  Eip1559TransactionPriceArg as DfinityEip1559TransactionPriceArg,
} from '@/blockchain_api/did/dfinity_minter/dfinity_minter_types';

import { is_native_token } from '../evm/utils/erc20_helpers';
import BigNumber from 'bignumber.js';
import { principalToBytes32 } from './utils/principal_to_hex';

// Enums and Types
enum Badge {
  BEST = 'Best Return',
  FASTEST = 'Fastest',
  CHEAPEST = 'Cheapest',
}

enum TxType {
  Deposit,
  Withdrawal,
}

interface BridgeMetadata {
  txType: TxType;
  minterAddress: Principal;
  operator: Operator;
  chainId: number;
  isNative: boolean;
  depositHelperContract: string;
}

interface BridgeOption {
  bridgeTxType: TxType;
  minterId: string;
  operator: Operator;
  estimatedReturn: string;
  minterFee: string;
  totalFee: string;
  via: string;
  duration: string;
  totalFeeusdPrice: string;
  isBest: boolean;
  isActive: boolean;
  badge: Badge;
}

interface GasEstimation {
  data: `0x${string}`;
  chainId: number;
  value: bigint;
  type: 'eip1559';
  to: `0x${string}`;
}

// Utilities
const DEFAULT_SUBACCOUNT = '0x0000000000000000000000000000000000000000000000000000000000000000';

const fetchMinterFee = async (
  agent: HttpAgent,
  operator: string,
  minterAddress: Principal,
  txType: TxType,
): Promise<string> => {
  if (operator === 'Appic') {
    const appicMinterActor = Actor.createActor(AppicIdlFactory, { agent, canisterId: minterAddress });
    try {
      const minterInfo = (await appicMinterActor.get_minter_info()) as MinterInfo;
      return txType === TxType.Deposit
        ? minterInfo.deposit_native_fee.toString()
        : minterInfo.withdrawal_native_fee.toString();
    } catch (error) {
      console.error('Error fetching Appic minter fee:', error);
      throw new Error('Failed to fetch Appic minter fee');
    }
  }
  return '0';
};

const fetchWithdrawalFee = async (
  agent: HttpAgent,
  operator: string,
  minterAddress: Principal,
  isNativeToken: boolean,
  tokenCanisterId: string,
): Promise<string> => {
  const handleError = (message: string, error: any) => {
    console.error(message, error);
    return '0';
  };

  try {
    // Appic Operator Logic
    if (operator === 'Appic') {
      const appicMinterActor = Actor.createActor(AppicIdlFactory, { agent, canisterId: minterAddress });

      const eip1559TransactionPrice = isNativeToken
        ? ((await appicMinterActor.eip_1559_transaction_price()) as AppicEip1559TransactionPrice)
        : ((await appicMinterActor.eip_1559_transaction_price({
            erc20_ledger_id: Principal.fromText(tokenCanisterId),
          } as AppicEip1559TransactionPriceArg)) as AppicEip1559TransactionPrice);

      return eip1559TransactionPrice.max_transaction_fee.toString();
    }

    // Dfinity Operator Logic
    if (operator === 'Dfinity') {
      const dfinityMinterActor = Actor.createActor(DfinityIdlFactory, { agent, canisterId: minterAddress });

      const eip1559TransactionPrice = isNativeToken
        ? ((await dfinityMinterActor.eip_1559_transaction_price()) as DfinityEip1559TransactionPrice)
        : ((await dfinityMinterActor.eip_1559_transaction_price({
            ckerc20_ledger_id: Principal.fromText(tokenCanisterId),
          } as DfinityEip1559TransactionPriceArg)) as DfinityEip1559TransactionPrice);

      return eip1559TransactionPrice.max_transaction_fee.toString();
    }

    // Default for unsupported operators
    return '0';
  } catch (error) {
    return handleError('Error fetching withdrawal fee:', error);
  }
};

const getBridgeMetadata = (fromToken: EvmToken | IcpToken, toToken: EvmToken | IcpToken): BridgeMetadata => {
  const isDeposit = fromToken.chain_type === 'EVM' && toToken.chain_type === 'ICP';
  const operator = isDeposit ? toToken.operator! : fromToken.operator!;
  const chainId = isDeposit ? fromToken.chainId : toToken.chainId;

  return {
    txType: isDeposit ? TxType.Deposit : TxType.Withdrawal,
    minterAddress: getMinterAddress(operator, chainId),
    operator,
    chainId,
    isNative: is_native_token(isDeposit ? fromToken.contractAddress! : toToken.contractAddress!),
    depositHelperContract: getDepositHelperContract(operator, chainId),
  };
};

const getMinterAddress = (operator: string, chainId: number): Principal => {
  const chain = chains.find((chain) => chain.chainId === chainId);
  const address = operator === 'Appic' ? chain?.appic_minter_address : chain?.dfinity_ck_minter_address;
  return Principal.fromText(address!);
};

const getDepositHelperContract = (operator: string, chainId: number): string => {
  const chain = chains.find((chain) => chain.chainId === chainId);
  return operator === 'Appic' ? chain?.appic_deposit_helper_contract! : chain?.dfinity_ck_deposit_helper_contract!;
};

// Hook: useGetBridgeOptions
export const useGetBridgeOptions = (
  fromToken: EvmToken | IcpToken,
  toToken: EvmToken | IcpToken,
  amount: string,
  agent: HttpAgent,
  native_currency: EvmToken | IcpToken,
) => {
  const [bridgeOptions, setBridgeOptions] = useState<BridgeOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const bridgeMetadata = useMemo(() => getBridgeMetadata(fromToken, toToken), [fromToken, toToken]);

  const fetchEncodedFunctionData = useCallback((): `0x${string}` => {
    if (fromToken.chain_type == 'EVM') {
      const principal = principalToBytes32('6b5ll-mteg5-kmyav-a6l7g-lpwje-jc4ln-moggr-wrfvu-n54bz-gh3nr-wae');
      const value = bridgeMetadata.isNative ? amount : '0';

      if (bridgeMetadata.operator === 'Appic') {
        return encodeFunctionData({
          abi: appic_minter_abi,
          functionName: 'deposit',
          args: [fromToken.contractAddress!, amount, principal, DEFAULT_SUBACCOUNT],
        });
      }

      if (bridgeMetadata.operator === 'Dfinity') {
        return encodeFunctionData({
          abi: dfinity_ck_minter_abi,
          functionName: bridgeMetadata.isNative ? 'depositEth' : 'depositErc20',
          args: bridgeMetadata.isNative
            ? [principal, DEFAULT_SUBACCOUNT]
            : [fromToken.contractAddress!, amount, principal, DEFAULT_SUBACCOUNT],
        });
      }
    }
    return '' as `0x${string}`;
  }, [bridgeMetadata, fromToken, amount]);

  const estimateWithdrawalGas = useCallback(async (): Promise<string> => {
    if (fromToken.chain_type == 'ICP') {
      try {
        return await fetchWithdrawalFee(
          agent,
          bridgeMetadata.operator,
          bridgeMetadata.minterAddress,
          bridgeMetadata.isNative,
          fromToken.canisterId!,
        );
      } catch (error) {
        setError('Failed to Get withdrawal fee estimate');
        return '0';
      }
    }
    return '0';
  }, [bridgeMetadata, fromToken]);

  const encodedFunctionData = fetchEncodedFunctionData();

  const estimatedWithdrawalGas = estimateWithdrawalGas();
  const {
    data: estimateDepositGas,
    status: estimateDepositGasStatus,
    isFetched: isEstimationFetched,
  } = useEstimateGas({
    data: encodedFunctionData,
    chainId: bridgeMetadata.chainId,
    value: BigInt(bridgeMetadata.isNative ? amount : '0'),
    type: 'eip1559',
    to: bridgeMetadata.depositHelperContract as `0x${string}`,
  } as GasEstimation);

  const calculateBridgeOptions = useCallback(async () => {
    setLoading(true);
    try {
      const minterFee = await fetchMinterFee(
        agent,
        bridgeMetadata.operator,
        bridgeMetadata.minterAddress,
        bridgeMetadata.txType,
      );

      let totalFee = new BigNumber(minterFee)
        .plus(
          bridgeMetadata.txType == TxType.Deposit ? estimateDepositGas?.toString() || 0 : await estimatedWithdrawalGas,
        )
        .toString();

      let estimatedReturn = BigNumber(amount).minus(totalFee).toString();

      let duration = bridgeMetadata.operator == 'Appic' ? '1 - 2 min' : '15 - 20 min';

      setBridgeOptions([
        {
          bridgeTxType: bridgeMetadata.txType,
          minterId: bridgeMetadata.minterAddress.toText(),
          operator: bridgeMetadata.operator,
          estimatedReturn,
          minterFee,
          totalFee,
          via: bridgeMetadata.operator,
          duration,
          isBest: true,
          isActive: true,
          badge: Badge.BEST,
          totalFeeusdPrice: BigNumber(totalFee).multipliedBy(native_currency.usdPrice).toString(),
        },
      ]);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [bridgeMetadata, amount, estimateDepositGas, estimatedWithdrawalGas]);

  // useEffect for calculating bridge options
  useEffect(() => {}, [bridgeMetadata, estimateDepositGas, estimatedWithdrawalGas]);

  return { bridgeOptions, error, loading };
};
