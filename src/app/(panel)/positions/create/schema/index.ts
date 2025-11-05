import { z } from 'zod';
import { IcpToken } from '@/blockchain_api/types/tokens';

const DECIMAL_REGEX = /^\d+(\.\d{0,18})?$/;

export const CreatePositionFormSchema = z
  .object({
    searchTokenQuery: z.string().optional(),

    fee: z.number({
      required_error: 'Fee is required',
      invalid_type_error: 'Fee must be a number',
    }),
    isFeeManuallySelected: z.boolean(),

    initialPrice: z
      .string({
        required_error: 'Initial price is required',
        invalid_type_error: 'Initial price must be a string',
      })
      .min(1, 'Initial price is required')
      .max(24, 'Initial price must be less than 24 characters')
      .transform((val) => {
        if (val.includes('.')) {
          const num = parseFloat(val);
          return num.toFixed(18);
        }
        return val;
      })
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
    isToken0DepositAmountActive: z.boolean(),
    isToken1DepositAmountActive: z.boolean(),
    token1DepositAmount: z.string().min(1, 'required'),

    minPrice: z.string().min(1, 'required'),
    maxPrice: z.string().min(1, 'required'),

    minTick: z.string().min(1, 'required'),
    maxTick: z.string().min(1, 'required'),
  })
  .superRefine((data, ctx) => {
    const min = data.minPrice;
    const max = data.maxPrice;
    const token0DepositAmount = data.token0DepositAmount;
    const token1DepositAmount = data.token1DepositAmount;
    const isToken0DepositAmountActive = data.isToken0DepositAmountActive;
    const isToken1DepositAmountActive = data.isToken1DepositAmountActive;

    const isValidNumber = (value: any) => {
      return /^[0-9]+(\.[0-9]+)?$/.test(value);
    };

    if (min !== 'min' && !isValidNumber(min)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['minPrice'],
        message: 'Invalid price',
      });
      return;
    }

    if (min !== 'min' && Number(min) < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['minPrice'],
        message: 'Invalid price',
      });
    }

    if (max === 'max' || max === '\u221E') {
      return;
    } else {
      if (!isValidNumber(max)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['maxPrice'],
          message: 'Invalid price',
        });
        return;
      }

      if (Number(min) >= Number(max)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['minPrice'],
          message: 'Min price must be less than max price',
        });
      }

      if (Number(min) === Number(max)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['minPrice'],
          message: 'Min and max price cannot be equal',
        });
      }
    }

    if (isToken0DepositAmountActive && (token0DepositAmount === '0' || !token0DepositAmount)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['token0DepositAmount'],
        message: 'Amount must be greater than 0',
      });
    }

    if (isToken1DepositAmountActive && (token1DepositAmount === '0' || !token1DepositAmount)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['token1DepositAmount'],
        message: 'Amount must be greater than 0',
      });
    }
  });

export type CreatePositionFormDefaultValues = z.infer<typeof CreatePositionFormSchema>;
export type CreatePositionFormKeys = keyof CreatePositionFormDefaultValues;

export const addLiquidityFormSchema = z.object({
  token0DepositAmount: z
    .string()
    .min(1, 'Invalid amount')
    .refine((val) => parseFloat(val) > 0, {
      message: 'Must be greater than 0',
    }),

  token1DepositAmount: z
    .string()
    .min(1, 'Invalid amount')
    .refine((val) => parseFloat(val) > 0, {
      message: 'Must be greater than 0',
    }),
});

export type AddLiquidityFormDefaultValues = z.infer<typeof addLiquidityFormSchema>;
export type addLiquidityFormKeys = keyof AddLiquidityFormDefaultValues;
