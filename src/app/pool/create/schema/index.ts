import { z } from 'zod';
import { IcpToken } from '@/blockchain_api/types/tokens';

const DECIMAL_REGEX = /^\d+(\.\d{0,18})?$/;

export const CreatePoolFormSchema = z
  .object({
    searchTokenQuery: z.string().optional(),

    fee: z.number({
      required_error: 'Fee is required',
      invalid_type_error: 'Fee must be a number',
    }),

    initialPrice: z
      .string({
        required_error: 'Initial price is required',
        invalid_type_error: 'Initial price must be a string',
      })
      .min(1, 'Initial price is required')
      .max(24, 'Initial price must be less than 24 characters')
      .refine((val) => DECIMAL_REGEX.test(val), {
        message: 'Enter a valid number with up to 18 decimals',
      })
      .refine((val) => parseFloat(val) > 0, {
        message: 'Initial price must be greater than 0',
      }),

    tickSpacing: z.number().min(1, 'Tick spacing must be at least 1'),
    sqrtPriceX96: z.string().min(1, 'SQRT price is required'),

    token0: z.custom<IcpToken>((val) => !!val, {
      message: 'Token 0 is required',
    }),

    token1: z.custom<IcpToken>((val) => !!val, {
      message: 'Token 1 is required',
    }),

    token0DepositAmount: z.string().min(1, 'required'),
    token1DepositAmount: z.string().min(1, 'required'),

    minPrice: z.string().min(1, 'required'),
    maxPrice: z.string().min(1, 'required'),
  })
  .superRefine((data, ctx) => {
    const min = parseFloat(data.minPrice);
    const max = data.maxPrice;

    if (isNaN(min)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['minPrice'],
        message: 'Invalid price',
      });
      return;
    }

    if (min < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['minPrice'],
        message: 'Invalid price',
      });
    }

    if (max === 'max') {
      return;
    } else {
      if (isNaN(parseFloat(max))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['maxPrice'],
          message: 'Invalid price',
        });
        return;
      }
      if (min >= parseFloat(max)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['minPrice'],
          message: 'Min price must be less than max price',
        });
      }
      if (min === parseFloat(max)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['minPrice'],
          message: 'Min and max price cannot be equal',
        });
      }
    }
  });

export type CreatePoolFormDefaultValues = z.infer<typeof CreatePoolFormSchema>;
export type CreatePoolFormKeys = keyof CreatePoolFormDefaultValues;
