import { Actor, Agent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory as IcrcIdlFactory } from '@/blockchain_api/did/ledger/icrc.did';
import { Approve, Account, ApproveArgs, Result_2 } from '@/blockchain_api/did/ledger/icrc_types';
import BigNumber from 'bignumber.js';
import { Response } from '@/blockchain_api/types/response';
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
 *    - Continuously check the transaction status by calling the `appic_helper` every minute.
 *    - Wait until the transaction is successful.
 */

// Step 1
// Approval
export const icrc2_approve = async (
  authenticated_agent: Agent,
  is_native: boolean,
  approval_fee: string, // in case of native
  approval_erc20_fee: string, // in case of erc20
  total_fee: string, // in case of erc20, show how much native tokens minter can take
  from_token_cansiter_id: Principal,
  native_casniter_id: Principal,
  amount: string,
  minter_id: Principal,
): Promise<Response<string>> => {
  let native_actor = Actor.createActor(IcrcIdlFactory, {
    agent: authenticated_agent,
    canisterId: is_native ? native_casniter_id : from_token_cansiter_id,
  });

  try {
    if (is_native) {
      // In case of Native withdrawal
      let native_approval_result = (await native_actor.icrc2_approve({
        amount: BigInt(BigNumber(amount).minus(approval_fee).toString()),
        created_at_time: [],
        expected_allowance: [],
        expires_at: [],
        fee: [],
        from_subaccount: [],
        memo: [],
        spender: { owner: minter_id, subaccount: [] } as Account,
      } as ApproveArgs)) as Result_2;

      if ('Ok' in native_approval_result) {
        return { result: native_approval_result.Ok.toString(), success: true, message: '' };
      } else {
        return { result: '', success: false, message: `Failed to approve allowance:${native_approval_result.Err}` };
      }
    } else {
      // In case of Erc20
      let erc20_actor = Actor.createActor(IcrcIdlFactory, {
        agent: authenticated_agent,
        canisterId: from_token_cansiter_id,
      });

      let native_approval_result = (await native_actor.icrc2_approve({
        amount: BigInt(BigNumber(total_fee).minus(approval_fee).toString()),
        created_at_time: [],
        expected_allowance: [],
        expires_at: [],
        fee: [],
        from_subaccount: [],
        memo: [],
        spender: { owner: minter_id, subaccount: [] } as Account,
      } as ApproveArgs)) as Result_2;

      if ('Ok' in native_approval_result) {
      } else {
        return { result: '', success: false, message: `Failed to approve allowance:${native_approval_result.Err}` };
      }

      let erc20_approval_result = (await erc20_actor.icrc2_approve({
        amount: BigInt(BigNumber(amount).minus(approval_erc20_fee).toString()),
        created_at_time: [],
        expected_allowance: [],
        expires_at: [],
        fee: [],
        from_subaccount: [],
        memo: [],
        spender: { owner: minter_id, subaccount: [] } as Account,
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
  } catch (error) {
    return {
      result: '',
      success: false,
      message: `Failed to approve allowance:${error}`,
    };
  }
};

// Step 2

/**
 * Deposit Transactions: Steps
 *
 * Deposit transactions consist of 4 steps, with variations depending on the token type.
 *
 * Steps:
 *
 * 1. **Token Approval**:
 *    - Allow the Deposit Helper contract to access the token.
 *    - Token-specific rules:
 *      - **Native Tokens**: No approval required.
 *      - **ERC20 Tokens**: A single approval is required.
 *
 * 2. **Submit Deposit Request**:
 *    - Call the appropriate deposit function on the Deposit Helper contract:
 *      - **Appic Deposit Helper**:
 *        - Use the `deposit` function for both native and ERC20 tokens.
 *      - **Dfinity ck Deposit Helper**:
 *        - Use the `depositEth` function for native tokens.
 *        - Use the `depositErc20` function for ERC20 tokens.
 *
 * 3. **Notify Appic Helper**:
 *    - Inform the `appic_helper` service about the successful deposit request.
 *
 * 4. **Monitor Transaction Status**:
 *    - Periodically check the transaction status by querying the `appic_helper` service.
 *    - Repeat every minute until the transaction is confirmed as successful.
 */
