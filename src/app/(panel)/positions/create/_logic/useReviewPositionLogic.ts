import { GenerateMintPositionArgsParams } from '@/blockchain_api/functions/icp/dex/calculate_mint_amounts';
import {
  generate_args_and_approve_mint_position,
  mint_position,
} from '@/blockchain_api/functions/icp/dex/tx/mint_position';
import { Agent, HttpAgent } from '@dfinity/agent';
import { useState } from 'react';
import { CreatePositionStep } from '../../types';

export default function useReviewPositionLogic() {
  const [createPositionStep, setCreatePositionStep] = useState<CreatePositionStep>({
    status: 'pending',
    step: 1,
    errorMessage: null,
  });
  const [createPositionPrevStep, setCreatePositionPrevStep] = useState<CreatePositionStep>({
    status: 'successful',
    step: 0,
    errorMessage: null,
  });

  async function executeMintPosition({
    amount0_max,
    amount1_max,
    max_tick,
    min_tick,
    pool_id,
    token0,
    token1,
    authenticatedAgent,
    unAuthenticatedAgent,
    pool_exists,
    sqrt_price_x96,
  }: GenerateMintPositionArgsParams & {
    authenticatedAgent: Agent;
    unAuthenticatedAgent: HttpAgent;
    pool_exists: boolean;
    sqrt_price_x96: string;
  }) {
    if (authenticatedAgent && unAuthenticatedAgent) {
      // step1
      const generatedArgs = await generate_args_and_approve_mint_position(
        {
          amount0_max,
          amount1_max,
          max_tick,
          min_tick,
          pool_id,
          token0,
          token1,
        },
        authenticatedAgent,
        unAuthenticatedAgent,
      );
      if (!generatedArgs.success || !generatedArgs.result) {
        setCreatePositionStep({
          step: 1,
          status: 'failed',
          errorMessage: generatedArgs.message,
        });
        return generatedArgs.message;
      }
      setCreatePositionStep({
        step: 2,
        status: 'pending',
        errorMessage: null,
      });

      // Step 2
      const mintPositionResponse = await mint_position(
        pool_exists,
        sqrt_price_x96,
        generatedArgs.result,
        authenticatedAgent,
      );

      if (!mintPositionResponse.success) {
        setCreatePositionStep({
          step: 2,
          status: 'failed',
          errorMessage: mintPositionResponse.message,
        });
        return mintPositionResponse.message;
      }
      setCreatePositionStep({
        step: 2,
        status: 'successful',
        errorMessage: null,
      });
    }
  }

  function resetTransaction() {
    setCreatePositionStep({
      step: 1,
      status: 'pending',
      errorMessage: null,
    });
  }

  return {
    executeMintPosition,
    createPositionStep,
    resetTransaction,
    createPositionPrevStep,
    setCreatePositionPrevStep,
  };
}
