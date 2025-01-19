import { z } from 'zod';

export const formSchema = z.object({
  chain_id: z.string().nonempty('Chain ID is required.').regex(/^\d+$/, 'Chain ID must be a numeric value.'),
  contract_address: z
    .string()
    .nonempty('Contract address is required.')
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address format.'),
  transfer_fee: z
    .string()
    .nonempty('Transfer Fee is required.')
    .regex(/^\d+(\.\d+)?$/, 'Transfer Fee must be a valid number.')
    .refine(
      (value) => {
        const numberValue = parseFloat(value); // Convert to a float
        return numberValue <= 10; // Ensure it's less than or equal to 10
      },
      {
        message: 'Transfer Fee must be less than or equal to 10.',
      },
    ),
});
