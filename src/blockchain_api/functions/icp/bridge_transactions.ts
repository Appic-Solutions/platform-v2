/**
 * Bridge Transactions: Overview
 *
 * Transactions are categorized into two types:
 * 1. Withdrawal Transactions (ICP -> EVM)
 * 2. Deposit Transactions (EVM -> ICP) [not detailed here]
 *
 * Withdrawal transactions involve multiple steps depending on the token type.
 */

import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

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
export const icrc2_approve = (
  authenticated_agent: HttpAgent,
  token_casniter_id: Principal,
  amount: string,
  minter_id: Principal,
) => {};

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
