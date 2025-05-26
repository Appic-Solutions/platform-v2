import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DefaultValuesType } from '../_types';
import { formSchema } from '../validation';

export const useFormLogic = () => {
  const methods = useForm<DefaultValuesType>({
    defaultValues: {
      chain_id: '',
      contract_address: '',
    },
    resolver: zodResolver(formSchema),
  });

  const chainIdWatch = useWatch({
    control: methods.control,
    name: 'chain_id',
  });

  return { methods, chainIdWatch };
};
