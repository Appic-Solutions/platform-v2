/* eslint-disable @typescript-eslint/no-explicit-any */
import { Actor, Agent, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { createWalletClient, custom, WalletClient, Chain as ViemChain, createPublicClient, http } from 'viem';

import { idlFactory as IcrcIdlFactory } from '@/blockchain_api/did/ledger/icrc.did';
import { Account, ApproveArgs, Result_2, Allowance, AllowanceArgs } from '@/blockchain_api/did/ledger/icrc_types';
import BigNumber from 'bignumber.js';
import { Response } from '@/blockchain_api/types/response';
import { BridgeOption, encode_approval_function_data, encode_deposit_function_data } from './get_bridge_options';
import { idlFactory as AppicMinterIdlFactory } from '@/blockchain_api/did/appic/appic_minter/appic_minter.did';
import {
  WithdrawalArg as AppicWithdrawalArg,
  WithdrawErc20Arg as AppicWithdrawErc20Arg,
  WithdrawalNativeResult as AppicWithdrawalNativeResult,
  WithdrawalErc20Result as AppicWithdrawalErc20Result,
  LogScrapingResult,
  DepositStatus,
  RetrieveWithdrawalStatus,
} from '@/blockchain_api/did/appic/appic_minter/appic_minter_types';

import { idlFactory as DfinityMinterIdlFactory } from '@/blockchain_api/did/dfinity_minter/dfinity_minter.did';
import {
  WithdrawalArg as DfinityWithdrawalArg,
  WithdrawErc20Arg as DfinityWithdrawErc20Arg,
  WithdrawErc20Error as DfinityWithdrawErc20Error,
  WithdrawalError as DfinityWithdrawalError,
  RetrieveErc20Request as DfinityRetrieveErc20Request,
  RetrieveEthRequest as DfinityRetrieveEthRequest,
  RetrieveEthStatus,
} from '@/blockchain_api/did/dfinity_minter/dfinity_minter_types';

import { idlFactory as AppicHelperIdlFactory } from '@/blockchain_api/did/appic/appic_helper/appic_helper.did';
import {
  AddEvmToIcpTx,
  AddIcpToEvmTx,
  NewEvmToIcpResult,
  NewIcpToEvmResult,
  Operator as AppicHelperOperator,
  GetTxParams,
  Transaction,
  TransactionSearchParam,
  AddEvmToIcpTxError,
  AddIcpToEvmTxError,
} from '@/blockchain_api/did/appic/appic_helper/appic_helper_types';

import { appic_helper_canister_id } from '@/canister_ids.json';
import {
  parse_deposit_status_result,
  parse_evm_to_icp_tx_status,
  parse_retrieve_eth_status_result,
  parse_retrieve_withdrawal_status_result,
} from './utils/tx_status_parser';
import { principal_to_bytes32 } from './utils/principal_to_hex';
import { check_allowance } from '../evm/check_allowance';

/**
 * Bridge Transactions: Overview
 *
 * Transactions are categorized into two types:
 * 1. Withdrawal Transactions (ICP -> EVM)
 * 2. Deposit Transactions (EVM -> ICP) [not detailed here]
 *
 * Withdrawal transactions involve multiple steps depending on the token type.
 */

/**
 * Withdrawal Transactions: Steps
 *
 * Withdrawal transactions are divided into 4 or 5 steps, based on the token type.
 *
 * Steps:
 * 1. Token Approval:
 *    - Grant approval for the Minter address to use the token.
 *    - For twin native tokens:
 *      - Only one approval is required.
 *    - For twin ERC20 tokens:
 *      - Approvals are required for both the native token and the ERC20 token.
 *
 * 2. Submit Withdrawal Request:
 *    - Call the appropriate Minter endpoint:
 *      - `withdraw_native` for native tokens.
 *      - `withdraw_erc20` for ERC20 tokens.
 *
 * 3. Notify Appic Helper:
 *    - Submit the successful withdrawal request to the `appic_helper` service.
 *
 * 4. Monitor Transaction Status:
 *    - Continuously check the transaction status by calling the `appic_helper` every 30 seconds.
 *    - Wait until the transaction is successful.
 */

// Step 1
// Approval
export const icrc2_approve = async (
  bridge_option: BridgeOption,
  authenticated_agent: Agent, // HttpAgent , Agent
  unauthenticated_agent: HttpAgent,
): Promise<Response<string>> => {
  const native_actor = Actor.createActor(IcrcIdlFactory, {
    agent: authenticated_agent,
    canisterId: bridge_option.native_fee_token_id,
  });

  const native_actor_unauthenticated = Actor.createActor(IcrcIdlFactory, {
    agent: unauthenticated_agent,
    canisterId: bridge_option.native_fee_token_id,
  });

  console.log(bridge_option.native_fee_token_id);

  try {
    const sender_principal = await authenticated_agent.getPrincipal();
    if (bridge_option.is_native) {
      // Check the allowance
      const allowance = (await native_actor_unauthenticated.icrc2_allowance({
        account: {
          owner: sender_principal,
          subaccount: [],
        },
        spender: { owner: bridge_option.minter_id, subaccount: [] },
      } as AllowanceArgs)) as Allowance;

      // Check if minter already has enough allowance
      if (
        BigNumber(allowance.allowance.toString()).isGreaterThanOrEqualTo(
          BigNumber(bridge_option.amount).minus(bridge_option.fees.approval_fee_in_native_token),
        )
      ) {
        return { result: 'Successful', success: true, message: '' };
      }

      // In case of Native withdrawal
      const native_approval_result = (await native_actor.icrc2_approve({
        amount: BigInt(
          BigNumber(bridge_option.amount).minus(bridge_option.fees.approval_fee_in_native_token).toString(),
        ),
        created_at_time: [],
        expected_allowance: [],
        expires_at: [],
        fee: [],
        from_subaccount: [],
        memo: [],
        spender: { owner: bridge_option.minter_id, subaccount: [] } as Account,
      } as ApproveArgs)) as Result_2;

      if ('Ok' in native_approval_result) {
        return { result: native_approval_result.Ok.toString(), success: true, message: '' };
      } else {
        return { result: '', success: false, message: `Failed to approve allowance:${native_approval_result.Err}` };
      }
    } else {
      // In case of Erc20
      const erc20_actor = Actor.createActor(IcrcIdlFactory, {
        agent: authenticated_agent,
        canisterId: bridge_option.from_token_id,
      });

      // In case of Erc20
      const erc20_actor_unauthenticated = Actor.createActor(IcrcIdlFactory, {
        agent: unauthenticated_agent,
        canisterId: bridge_option.from_token_id,
      });

      // Check native allowance
      const native_allowance = (await native_actor_unauthenticated.icrc2_allowance({
        account: {
          owner: sender_principal,
          subaccount: [],
        },
        spender: { owner: bridge_option.minter_id, subaccount: [] },
      } as AllowanceArgs)) as Allowance;
      console.log(
        native_allowance.allowance.toString(),
        BigNumber(native_allowance.allowance.toString()).isGreaterThanOrEqualTo(
          BigNumber(bridge_option.fees.total_native_fee).minus(bridge_option.fees.approval_fee_in_native_token),
        ),
      );
      // Check if minter already has enough allowance for native token
      if (
        BigNumber(native_allowance.allowance.toString()).isGreaterThanOrEqualTo(
          BigNumber(bridge_option.fees.total_native_fee).minus(bridge_option.fees.approval_fee_in_native_token),
        )
      ) {
      } else {
        const native_approval_result = (await native_actor.icrc2_approve({
          amount: BigInt(
            BigNumber(bridge_option.fees.total_native_fee)
              .minus(bridge_option.fees.approval_fee_in_native_token)
              .toString(),
          ),
          created_at_time: [],
          expected_allowance: [],
          expires_at: [],
          fee: [],
          from_subaccount: [],
          memo: [],
          spender: { owner: bridge_option.minter_id, subaccount: [] } as Account,
        } as ApproveArgs)) as Result_2;

        if ('Ok' in native_approval_result) {
        } else {
          return { result: '', success: false, message: `Failed to approve allowance:${native_approval_result.Err}` };
        }
      }

      // Check erc-20 allowance
      const erc20_allowance = (await erc20_actor_unauthenticated.icrc2_allowance({
        account: {
          owner: sender_principal,
          subaccount: [],
        },
        spender: { owner: bridge_option.minter_id, subaccount: [] },
      } as AllowanceArgs)) as Allowance;

      // Check if minter already has enough allowance for erc20 token
      if (
        BigNumber(erc20_allowance.allowance.toString()).isGreaterThanOrEqualTo(
          BigNumber(bridge_option.amount).minus(bridge_option.fees.approval_fee_in_erc20_tokens),
        )
      ) {
        return { result: 'Successful', success: true, message: '' };
      } else {
        const erc20_approval_result = (await erc20_actor.icrc2_approve({
          amount: BigInt(
            BigNumber(bridge_option.amount).minus(bridge_option.fees.approval_fee_in_erc20_tokens).toString(),
          ),
          created_at_time: [],
          expected_allowance: [],
          expires_at: [],
          fee: [],
          from_subaccount: [],
          memo: [],
          spender: { owner: bridge_option.minter_id, subaccount: [] } as Account,
        } as ApproveArgs)) as Result_2;

        if ('Ok' in erc20_approval_result) {
          return { result: erc20_approval_result.Ok.toString(), success: true, message: '' };
        } else {
          return {
            result: '',
            success: false,
            message: `Failed to approve allowance:${erc20_approval_result.Err}`,
          };
        }
      }
    }
  } catch (error) {
    return {
      result: '',
      success: false,
      message: `Failed to approve allowance:${JSON.stringify(error)}`,
    };
  }
};

type WithdrawalId = string;
// Step 2
// After given approval to minter, the withdrawal request should be submitted to the minter
// there are 4 possible scenarios
// 1. Dfinity minter -> native token: withdraw_eth function should be called
// 2. Dfinity minter -> erc20 token: withdraw_erc20 function should be called
// 3. Appic minter -> native token: withdraw_native_token function should be called
// 4. Appic minter -> erc20 token: withdraw_erc20 function should be called
// Function to handle withdrawal requests for both Appic and Dfinity minters
export const request_withdraw = async (
  bridge_option: BridgeOption,
  recipient: string, // Users evm wallet address
  authenticated_agent: Agent,
): Promise<Response<WithdrawalId>> => {
  // Check if the operator is Appic
  if (bridge_option.operator === 'Appic') {
    // Create an actor for the Appic minter
    const appic_minter_actor = Actor.createActor(AppicMinterIdlFactory, {
      canisterId: bridge_option.minter_id,
      agent: authenticated_agent,
    });

    // Handle native token withdrawal for Appic minter
    if (bridge_option.is_native) {
      try {
        const native_withdrawal_result = (await appic_minter_actor.withdraw_native_token({
          amount: BigInt(
            BigNumber(bridge_option.amount).minus(bridge_option.fees.approval_fee_in_native_token).toString(),
          ),
          recipient,
        } as AppicWithdrawalArg)) as AppicWithdrawalNativeResult;

        if ('Ok' in native_withdrawal_result) {
          return {
            result: native_withdrawal_result.Ok.block_index.toString(),
            message: '',
            success: true,
          };
        } else {
          return {
            result: '',
            message: `Failed to withdraw native token from Appic minter: ${JSON.stringify(native_withdrawal_result.Err)}`,
            success: false,
          };
        }
      } catch (error) {
        return {
          result: '',
          message: `Failed to withdraw native token from Appic minter: ${error}`,
          success: false,
        };
      }
    } else {
      // Handle ERC20 token withdrawal for Appic minter
      try {
        console.log(appic_minter_actor);
        const erc20_withdrawal_result = (await appic_minter_actor.withdraw_erc20({
          amount: BigInt(
            BigNumber(bridge_option.amount).minus(bridge_option.fees.approval_fee_in_erc20_tokens).toString(),
          ),
          erc20_ledger_id: Principal.fromText(bridge_option.from_token_id),
          recipient,
        } as AppicWithdrawErc20Arg)) as AppicWithdrawalErc20Result;

        if ('Ok' in erc20_withdrawal_result) {
          return {
            result: erc20_withdrawal_result.Ok.native_block_index.toString(),
            message: '',
            success: true,
          };
        } else {
          return {
            result: '',
            message: `Failed to withdraw ERC20 token from Appic minter: ${JSON.stringify(erc20_withdrawal_result.Err)}`,
            success: false,
          };
        }
      } catch (error) {
        console.log(error);
        return {
          result: '',
          message: `Failed to withdraw ERC20 token from Appic minter: ${JSON.stringify(error)}`,
          success: false,
        };
      }
    }
  } else if (bridge_option.operator === 'Dfinity') {
    // Create an actor for the Dfinity minter
    const dfinity_minter_actor = Actor.createActor(DfinityMinterIdlFactory, {
      canisterId: bridge_option.minter_id,
      agent: authenticated_agent,
    }) as {
      withdraw_eth: (
        arg?: DfinityWithdrawalArg,
      ) => Promise<{ Ok: DfinityRetrieveEthRequest } | { Err: DfinityWithdrawalError }>;
      withdraw_erc20: (
        arg?: DfinityWithdrawErc20Arg,
      ) => Promise<{ Ok: DfinityRetrieveErc20Request } | { Err: DfinityWithdrawErc20Error }>;
    };

    // Handle native token withdrawal for Dfinity minter
    if (bridge_option.is_native) {
      try {
        const native_withdrawal_result = await dfinity_minter_actor.withdraw_eth({
          amount: BigInt(
            BigNumber(bridge_option.amount).minus(bridge_option.fees.approval_fee_in_native_token).toString(),
          ),
          recipient,
          from_subaccount: [],
        });

        if ('Ok' in native_withdrawal_result) {
          return {
            result: native_withdrawal_result.Ok.block_index.toString(),
            message: '',
            success: true,
          };
        } else {
          return {
            result: '',
            message: `Failed to withdraw native token from Dfinity minter: ${native_withdrawal_result.Err}`,
            success: false,
          };
        }
      } catch (error) {
        return {
          result: '',
          message: `Failed to withdraw native token from Dfinity minter: ${error}`,
          success: false,
        };
      }
    } else {
      // Handle ERC20 token withdrawal for Dfinity minter
      try {
        const erc20_withdrawal_result = await dfinity_minter_actor.withdraw_erc20({
          amount: BigInt(
            BigNumber(bridge_option.amount).minus(bridge_option.fees.approval_fee_in_erc20_tokens).toString(),
          ),
          ckerc20_ledger_id: Principal.fromText(bridge_option.from_token_id),
          recipient,
          from_ckerc20_subaccount: [],
          from_cketh_subaccount: [],
        });

        if ('Ok' in erc20_withdrawal_result) {
          return {
            result: erc20_withdrawal_result.Ok.cketh_block_index.toString(),
            message: '',
            success: true,
          };
        } else {
          return {
            result: '',
            message: `Failed to withdraw ERC20 token from Dfinity minter: ${erc20_withdrawal_result.Err}`,
            success: false,
          };
        }
      } catch (error) {
        return {
          result: '',
          message: `Failed to withdraw ERC20 token from Dfinity minter: ${error}`,
          success: false,
        };
      }
    }
  } else {
    // Handle unsupported minter types
    return {
      result: '',
      message: `Failed to withdraw: Unsupported minter type`,
      success: false,
    };
  }
};

// Step3
// Notify Appic helper of new ICP => EVM Transaction
export const notify_appic_helper_withdrawal = async (
  bridge_option: BridgeOption,
  withdrawal_id: string,
  recipient: string, // Destination EVM Address
  user_wallet_principal: string, //from ICP Principal Address
  unauthenticated_agent: HttpAgent,
): Promise<Response<string>> => {
  const appic_helper_actor = Actor.createActor(AppicHelperIdlFactory, {
    canisterId: Principal.fromText(appic_helper_canister_id),
    agent: unauthenticated_agent,
  });

  console.log('Actor =>', appic_helper_actor);

  const parsed_operator = (
    bridge_option.operator == 'Appic' ? { AppicMinter: null } : { DfinityCkEthMinter: null }
  ) as AppicHelperOperator;
  console.log('OP=>', parsed_operator);
  try {
    const notify_withdrawal_result = (await appic_helper_actor.new_icp_to_evm_tx({
      chain_id: BigInt(bridge_option.chain_id),
      destination: recipient,
      erc20_contract_address: bridge_option.to_token_id,
      icrc_ledger_id: Principal.fromText(bridge_option.from_token_id),
      from: Principal.fromText(user_wallet_principal),
      from_subaccount: [],
      max_transaction_fee: BigInt(bridge_option.fees.max_network_fee),
      native_ledger_burn_index: BigInt(withdrawal_id),
      operator: parsed_operator,
      withdrawal_amount: BigInt(bridge_option.amount),
    } as AddIcpToEvmTx)) as NewIcpToEvmResult;

    console.log(notify_withdrawal_result);

    if ('Ok' in notify_withdrawal_result) {
      return {
        result: '',
        success: true,
        message: '',
      };
    } else {
      if ('TxAlreadyExists' in (notify_withdrawal_result.Err as AddIcpToEvmTxError)) {
        return {
          result: '',
          success: true,
          message: '',
        };
      }
      return {
        result: '',
        success: false,
        message: `Failed to notify minter ${notify_withdrawal_result.Err}. Your funds are safe and will be transferred to your wallet on destination chain.`,
      };
    }
  } catch (error) {
    return {
      result: '',
      success: false,
      message: `Failed to notify minter ${JSON.stringify(error)}, Your funds are safe and will be transferred to your wallet on destination chain.`,
    };
  }
};

export type WithdrawalTxStatus =
  | 'Successful'
  | 'Failed'
  | 'SignedTransaction'
  | 'ReplacedTransaction'
  | 'QuarantinedReimbursement'
  | 'PendingVerification'
  | 'Accepted'
  | 'Reimbursed'
  | 'Successful'
  | 'Created'
  | 'Call Failed';

// Step 4
// This function should be called on regular intervals until the transaction status is either "Failed" or "Successful" or "Reimbursed"
export const check_withdraw_status = async (
  withdrawal_id: WithdrawalId,
  bridge_option: BridgeOption,
  unauthenticated_agent: HttpAgent,
): Promise<Response<WithdrawalTxStatus>> => {
  const appic_helper_actor = Actor.createActor(AppicHelperIdlFactory, {
    canisterId: Principal.fromText(appic_helper_canister_id),
    agent: unauthenticated_agent,
  });

  console.log('check withdraw status request');

  try {
    // Check minters directly for withdraw result
    if (bridge_option.operator == 'Dfinity') {
      const dfinity_minter = Actor.createActor(DfinityMinterIdlFactory, {
        canisterId: bridge_option.minter_id,
        agent: unauthenticated_agent,
      });

      const tx_status = (await dfinity_minter.retrieve_eth_status(BigInt(withdrawal_id))) as RetrieveEthStatus;
      const parsed_status = parse_retrieve_eth_status_result(tx_status);
      console.log(parsed_status);
      return {
        result: parsed_status,
        message: '',
        success: true,
      };
    } else {
      const appic_minter = Actor.createActor(AppicMinterIdlFactory, {
        canisterId: bridge_option.minter_id,
        agent: unauthenticated_agent,
      });

      const tx_status = (await appic_minter.retrieve_withdrawal_status(
        BigInt(withdrawal_id),
      )) as RetrieveWithdrawalStatus;
      const parsed_status = parse_retrieve_withdrawal_status_result(tx_status);
      console.log(parsed_status);
      return {
        result: parsed_status,
        message: '',
        success: true,
      };
    }
  } catch (error) {
    return {
      result: 'Call Failed',
      message: `Canister call error ${JSON.stringify(error)}`,
      success: false,
    };
  }
};

/**
 * Deposit Transactions: Steps
 *
 * Deposit transactions consist of 4 steps, with variations depending on the token type.
 *
 * Steps:
 *
 * 1. **Create Wallet Client**:
 *   - Creates the wallet client and switches the chain:
 *      - **Create wallet client and return it**.
 *      - **Change chain if necessary**: Change the cain from wallet if necessary.
 *
 *
 * 2. **Token Approval**:
 *    - Allow the Deposit Helper contract to access the token.
 *    - Token-specific rules:
 *      - **Native Tokens**: No approval required.
 *      - **ERC20 Tokens**: A single approval is required.
 *
 * 3. **Submit Deposit Request**:
 *    - Call the appropriate deposit function on the Deposit Helper contract:
 *      - **Appic Deposit Helper**:
 *        - Use the `deposit` function for both native and ERC20 tokens.
 *      - **Dfinity ck Deposit Helper**:
 *        - Use the `depositEth` function for native tokens.
 *        - Use the `depositErc20` function for ERC20 tokens.
 *
 * 4. **Notify Appic Helper**:
 *    - Inform the `appic_helper` service about the successful deposit request.
 *
 * 5. **Monitor Transaction Status**:
 *    - Periodically check the transaction status by querying the `appic_helper` service.
 *    - Repeat every 30 seconds until the transaction is confirmed as successful.
 */

// Step 1
// create wallet client and switch chain
export const create_wallet_client = async (bridge_option: BridgeOption): Promise<WalletClient<any>> => {
  console.log(bridge_option);
  const ethereum = (window as any).ethereum;

  if (!ethereum) {
    throw new Error('MetaMask is not installed or ethereum object is not available');
  }
  try {
    const walletClient = createWalletClient({
      transport: custom(ethereum!),
    });

    // await walletClient.addChain({ chain: bridge_option.viem_chain });

    await walletClient.switchChain({ id: bridge_option.chain_id });
    const addresses = await walletClient.requestAddresses();
    console.log(addresses);

    return walletClient;
  } catch (error) {
    throw error;
  }
};

// Step 2
// Tokens approval
export const approve_erc20 = async (
  wallet_client: WalletClient<any>,
  bridge_option: BridgeOption,
): Promise<Response<boolean | `0x${string}`>> => {
  if (bridge_option.is_native == true) {
    return {
      result: true,
      success: true,
      message: '',
    };
  } else {
    try {
      const [account] = await wallet_client.getAddresses();

      // Check if there is enough allowance
      const allowance = await check_allowance(
        bridge_option.from_token_id as `0x${string}`,
        account as `0x${string}`,
        bridge_option.deposit_helper_contract as `0x${string}`,
        bridge_option.viem_chain,
        bridge_option.rpc_url,
      );

      if (BigNumber(allowance).isGreaterThanOrEqualTo(bridge_option.amount)) {
        return {
          result: true,
          success: true,
          message: '',
        };
      }

      const encoded_function_data = encode_approval_function_data(
        bridge_option.deposit_helper_contract as `0x${string}`,
        bridge_option.amount,
      );

      const prepared_transaction = await wallet_client.prepareTransactionRequest({
        chain: bridge_option.viem_chain as ViemChain,
        account: account as `0x${string}`,
        to: bridge_option.from_token_id as `0x${string}`,
        data: encoded_function_data as `0x${string}`,
        maxFeePerGas: BigInt(bridge_option.fees.max_fee_per_gas),
        maxPriorityFeePerGas: BigInt(bridge_option.fees.max_priority_fee_per_gas),
        gas: BigInt(bridge_option.fees.approve_erc20_gas),
        type: 'eip1559',
      });

      const hash = await wallet_client.sendTransaction({
        account: account,
        ...prepared_transaction,
      });

      const public_client = createPublicClient({
        transport: http(bridge_option.rpc_url),
        chain: bridge_option.viem_chain,
      });

      const tx_status = await public_client.waitForTransactionReceipt({
        hash,
        confirmations: 1,
      });

      if (tx_status.status == 'success') {
        return {
          result: hash,
          message: 'Failed to get erc20 approval',
          success: true,
        };
      } else {
        return {
          result: hash,
          message: '',
          success: false,
        };
      }
    } catch (error) {
      return {
        result: false,
        message: `Failed to get erc20 approval ${error}`,
        success: false,
      };
    }
  }
};

export type TxHash = `0x${string}`;
// Step 3
// Submit deposit request through deposit helpers
export const request_deposit = async (
  wallet_client: WalletClient<any>,
  bridge_option: BridgeOption,
  recipient: Principal, // Users Destination Principal Address
): Promise<Response<TxHash>> => {
  const principal_bytes = principal_to_bytes32(recipient.toText());
  const encoded_deposit_function_data = encode_deposit_function_data(
    bridge_option.from_token_id,
    bridge_option.operator,
    bridge_option.is_native,
    principal_bytes,
    BigNumber(bridge_option.amount)
      .minus(BigNumber(bridge_option.fees.max_network_fee).plus(bridge_option.fees.approval_fee_in_native_token))
      .toFixed(),
  );

  try {
    const [account] = await wallet_client.getAddresses();

    const value = bridge_option.is_native
      ? BigInt(
          BigNumber(bridge_option.amount)
            .minus(bridge_option.fees.total_native_fee)
            .decimalPlaces(0, BigNumber.ROUND_DOWN)
            .toFixed(),
        )
      : undefined;

    const prepared_transaction = await wallet_client.prepareTransactionRequest({
      chain: bridge_option.viem_chain as ViemChain,
      account: account as `0x${string}`,
      to: bridge_option.deposit_helper_contract as `0x${string}`,
      data: encoded_deposit_function_data as `0x${string}`,
      // maxFeePerGas: BigInt(bridge_option.fees.max_fee_per_gas),
      // maxPriorityFeePerGas:BigInt(bridge_option.fees.max)
      maxFeePerGas: BigInt(bridge_option.fees.max_fee_per_gas),
      maxPriorityFeePerGas: BigInt(bridge_option.fees.max_priority_fee_per_gas),
      gas: BigInt(bridge_option.fees.deposit_gas),
      value,
      type: 'eip1559',
    });

    const hash = await wallet_client.sendTransaction({
      account: account,
      ...prepared_transaction,
    });

    const public_client = createPublicClient({
      transport: http(bridge_option.rpc_url),
      chain: bridge_option.viem_chain,
    });

    // TODO: to be changed later
    const confirmations_required = bridge_option.operator == 'Dfinity' ? 1 : 12;

    const tx_status = await public_client.waitForTransactionReceipt({
      hash,
      confirmations: confirmations_required,
    });

    if (tx_status.status == 'success') {
      return {
        result: hash,
        message: 'Failed to request deposit',
        success: true,
      };
    } else {
      return {
        result: hash,
        message: '',
        success: false,
      };
    }
  } catch (error) {
    return {
      result: '0x',
      message: `Failed to request deposit ${error}`,
      success: false,
    };
  }
};

// Step 4
// Notify Appic helper of new EVM => ICP Transaction
export const notify_appic_helper_deposit = async (
  bridge_option: BridgeOption,
  tx_hash: string,
  user_wallet_address: string,
  recipient_principal: string,
  unauthenticated_agent: HttpAgent,
): Promise<Response<string>> => {
  const appic_helper_actor = Actor.createActor(AppicHelperIdlFactory, {
    canisterId: Principal.fromText(appic_helper_canister_id),
    agent: unauthenticated_agent,
  });

  const parsed_operator = (
    bridge_option.operator == 'Appic' ? { AppicMinter: null } : { DfinityCkEthMinter: null }
  ) as AppicHelperOperator;
  try {
    const notify_deposit_result = (await appic_helper_actor.new_evm_to_icp_tx({
      chain_id: BigInt(bridge_option.chain_id),
      from_address: user_wallet_address,
      principal: Principal.fromText(recipient_principal),
      subaccount: [],
      total_gas_spent: BigInt(bridge_option.fees.max_network_fee),
      transaction_hash: tx_hash,
      value: BigInt(bridge_option.amount),
      erc20_contract_address: bridge_option.from_token_id,
      icrc_ledger_id: Principal.fromText(bridge_option.to_token_id),
      operator: parsed_operator,
    } as AddEvmToIcpTx)) as NewEvmToIcpResult;

    console.log(notify_deposit_result);

    // If the minter is of type of appic minter
    // Request minter to start log scraping
    if (bridge_option.operator === 'Appic') {
      // Create an actor for the Appic minter
      const appic_minter_actor = Actor.createActor(AppicMinterIdlFactory, {
        canisterId: bridge_option.minter_id,
        agent: unauthenticated_agent,
      });

      const log_scraping_request_result = (await appic_minter_actor.request_scraping_logs()) as LogScrapingResult;
      if ('Err' in log_scraping_request_result) {
        if ('CalledTooManyTimes' in log_scraping_request_result.Err) {
          setTimeout(async () => {
            await appic_minter_actor.request_scraping_logs();
          }, 60000);
        }
      }
    }

    if ('Ok' in notify_deposit_result) {
      return {
        result: '',
        success: true,
        message: '',
      };
    } else {
      if ('TxAlreadyExists' in (notify_deposit_result.Err as AddEvmToIcpTxError)) {
        return {
          result: '',
          success: true,
          message: '',
        };
      }
      console.error(notify_deposit_result.Err);
      return {
        result: '',
        success: false,
        message: `Failed to notify appic helper ${notify_deposit_result.Err}`,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      result: '',
      success: false,
      message: `Failed to notify appic helper ${error}`,
    };
  }
};

export type DepositTxStatus = 'Invalid' | 'PendingVerification' | 'Minted' | 'Accepted' | 'Quarantined';

//  Step 5
// This function should be called on a interval basis until the transaction status is either "Minted" or "Invalid" or "Quarantined"
export const check_deposit_status = async (
  tx_hash: TxHash,
  bridge_option: BridgeOption,
  unauthenticated_agent: Agent,
): Promise<Response<DepositTxStatus>> => {
  console.log('check deposit status request');
  const appic_helper_actor = Actor.createActor(AppicHelperIdlFactory, {
    canisterId: Principal.fromText(appic_helper_canister_id),
    agent: unauthenticated_agent,
  });

  const appic_minter_actor = Actor.createActor(AppicMinterIdlFactory, {
    canisterId: bridge_option.minter_id,
    agent: unauthenticated_agent,
  });

  try {
    // Check appic_helper for dfinity minter
    if (bridge_option.operator == 'Dfinity') {
      const tx_status = (await appic_helper_actor.get_transaction({
        chain_id: BigInt(bridge_option.chain_id),
        search_param: { TxHash: tx_hash } as TransactionSearchParam,
      } as GetTxParams)) as [] | [Transaction];

      if (tx_status.length != 0 && 'EvmToIcp' in tx_status[0]) {
        const parsed_status = parse_evm_to_icp_tx_status(tx_status[0].EvmToIcp.status);
        console.log(parsed_status);
        return {
          result: parsed_status,
          message: '',
          success: true,
        };
      } else {
        return {
          result: 'PendingVerification',
          message: '',
          success: true,
        };
      }
    }
    // Check appic_minter directly for appic minters
    else {
      const tx_status = (await appic_minter_actor.retrieve_deposit_status(tx_hash)) as [] | [DepositStatus];
      if (tx_status.length != 0) {
        const parsed_status = parse_deposit_status_result(tx_status[0]);
        console.log(parsed_status);
        return {
          result: parsed_status,
          message: '',
          success: true,
        };
      } else {
        return {
          result: 'PendingVerification',
          message: '',
          success: true,
        };
      }
    }
  } catch (error) {
    return {
      result: 'PendingVerification',
      message: `Canister call error ${error}`,
      success: false,
    };
  }
};
