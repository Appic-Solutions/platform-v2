import { z } from 'zod';
import { IcpToken } from '@/blockchain_api/types/tokens';

export const CreatePoolSchema = z.object({
  searchTokenQuery: z.string().optional(),
  fee: z.number({
    required_error: 'Fee is required',
    invalid_type_error: 'Fee must be a number',
  }),
  tickSpacing: z.number(),
  sqrtPriceX96: z.string().optional(),
  token0: z.custom<IcpToken>((val) => !!val, {
    message: 'Token 0 is required',
  }),
  token0InitialPrice: z.string(),
  token0MinPrice: z.string().optional(),
  token0MaxPrice: z.string().optional(),
  token0DepositAmount: z.string().optional(),
  token1: z.custom<IcpToken>((val) => !!val, {
    message: 'Token 1 is required',
  }),
  token1InitialPrice: z.string(),
  token1MinPrice: z.string().optional(),
  token1MaxPrice: z.string().optional(),
  token1DepositAmount: z.string().optional(),
});

export type CreatePoolFormDefaultValues = z.infer<typeof CreatePoolSchema>;
export type CreatePoolFormKeys = keyof CreatePoolFormDefaultValues;
