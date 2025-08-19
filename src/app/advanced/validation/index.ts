import { z } from 'zod';

// simple validators
const isEvmAddress = (val: string) => /^0x[a-fA-F0-9]{40}$/.test(val);
const isCanisterId = (val: string) => /^[a-z0-9-]{10,}$/.test(val);

export const formSchema = z
  .object({
    baseChain: z.any().refine((val) => val !== undefined, { message: 'Base chain is required' }),
    twinChain: z.any().refine((val) => val !== undefined, { message: 'Twin chain is required' }),
    canisterIdOrTokenAddress: z.string().min(1, 'Required'),
  })
  .refine(
    (data) => {
      if (!data.baseChain) return false;
      if (data.baseChain.type === 'EVM') return isEvmAddress(data.canisterIdOrTokenAddress);
      if (data.baseChain.type === 'ICP') return isCanisterId(data.canisterIdOrTokenAddress);
      return false;
    },
    {
      message: 'Invalid contract address or canister ID for the selected base chain',
      path: ['canisterIdOrTokenAddress'],
    },
  );
