import { z } from 'zod';

export const formSchema = z.object({
  chain_id: z
    .string()
    .min(1, 'Chain ID is required.')
    .regex(/^\d+$/, 'Chain ID must be a numeric value.'),
  contract_address: z
    .string()
    .nonempty('Contract address is required.')
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address format.'),
});
