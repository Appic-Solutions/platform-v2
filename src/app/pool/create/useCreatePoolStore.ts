import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useForm } from 'react-hook-form';

import { useSharedStore } from '@/store/store';
import { getTickSpacing } from '@/blockchain_api/functions/icp/dex/constants';
import { get_market_price } from '@/blockchain_api/functions/icp/dex/utils/price';
import { alignMinOrMaxPrice } from '@/blockchain_api/functions/icp/dex/align_min_max';
import { calculate_mint_amounts } from '@/blockchain_api/functions/icp/dex/calculate_mint_amounts';
import { limitDecimalPlaces } from '@/lib/utils';
import {
  FeeTier,
  HandlePriceProps,
  SelectFeeHandlerProps,
  SelectTokenHandlerProps,
} from './_types';
import { CreatePoolFormDefaultValues, CreatePoolFormKeys, CreatePoolFormSchema } from './schema';

interface CreatePoolStore {
  step: number;
  feeTiers: FeeTier[];
  isToken0Selected: boolean;
  methods: ReturnType<typeof useForm<CreatePoolFormDefaultValues>>;
  feeManuallySelected: React.MutableRefObject<boolean>;

  // Actions
  setStep: (step: number) => void;
  setMethods: (methods: ReturnType<typeof useForm<CreatePoolFormDefaultValues>>) => void;
  setFeeTiers: (feeTiers: FeeTier[]) => void;
  stepNextHandler: () => Promise<void>;
  stepBackHandler: () => void;
  resetFormHandler: () => void;
  setIsToken0Selected: (value: boolean) => void;

  handleInitialPriceInput: (value: string) => void;
  handlePriceInput: (props: HandlePriceProps) => void;
  handleDepositAmountInput: (args: { amount: string; isAmountZero: boolean }) => void;
  handleSetMarketPrice: () => void;
  selectTokenHandler: (props: SelectTokenHandlerProps) => void;
  selectFeeHandler: (value: SelectFeeHandlerProps) => void;
  getTickSpacingHandler: (fee: number) => void;
  getStepValidationFields: (step: number) => (keyof CreatePoolFormDefaultValues)[];
}

export const useCreatePoolStore = create<CreatePoolStore>()(
  devtools((set, get) => {
    const feeManuallySelected = { current: false };

    return {
      step: 0,
      feeTiers: [],
      isToken0Selected: true,
      // methods,
      feeManuallySelected,

      setStep: (step) => set({ step }),

      setMethods: (methods) => set({ methods }),

      setFeeTiers: (feeTiers) => set({ feeTiers }),

      setIsToken0Selected: (value) => set({ isToken0Selected: value }),

      stepNextHandler: async () => {
        const step = get().step;
        const methods = get().methods;
        const fields = get().getStepValidationFields(step);
        const isValid = await methods.trigger(fields);
        if (isValid) set({ step: step + 1 });
      },

      stepBackHandler: () => {
        const step = get().step;
        set({ step: Math.max(step - 1, 0) });
      },

      resetFormHandler: () => {
        get().methods.reset();
        set({ feeTiers: [] });
      },

      handleInitialPriceInput: (value) => {
        const methods = get().methods;
        methods.setValue('initialPrice', value, { shouldValidate: true, shouldDirty: true });
        methods.trigger('initialPrice');
      },

      handlePriceInput: ({ minOrMax, value }) => {
        const methods = get().methods;
        const { isToken0Selected } = get();
        const [token0, token1] = methods.getValues(['token0', 'token1']);
        const field: CreatePoolFormKeys = minOrMax === 'min' ? 'minPrice' : 'maxPrice';
        const tickField: CreatePoolFormKeys = minOrMax === 'min' ? 'minTick' : 'maxTick';

        if (value.trim() === '' || value === '0') {
          methods.setValue(field, minOrMax === 'min' ? 'min' : 'max', {
            shouldValidate: false,
            shouldDirty: true,
          });
          return;
        }

        const floatValue = parseFloat(value);
        if (isNaN(floatValue)) return;

        const alignedPrice = alignMinOrMaxPrice({
          is_token0_selected: isToken0Selected,
          token0,
          token1,
          price: value,
          tick_spacing: methods.getValues('tickSpacing'),
        });

        if (!alignedPrice) return;

        methods.setValue(tickField, alignedPrice.tick.toString());
        const fixedPrice = Number(alignedPrice.price)
          .toFixed(6)
          .replace(/\.?0+$/, '');
        methods.setValue(field, fixedPrice, {
          shouldValidate: true,
          shouldDirty: true,
        });

        const dirtyFields = methods.formState.dirtyFields;
        const bothDirty = dirtyFields.minPrice && dirtyFields.maxPrice;
        methods.trigger(bothDirty ? ['minPrice', 'maxPrice'] : field);
      },

      handleDepositAmountInput: ({ amount, isAmountZero }) => {
        const methods = get().methods;
        const [token0, token1, sqrtPriceX96, minTick, maxTick] = methods.getValues([
          'token0',
          'token1',
          'sqrtPriceX96',
          'minTick',
          'maxTick',
        ]);
        const trimmed = amount.trim();

        if (!token0 || !token1 || !sqrtPriceX96 || !minTick || !maxTick) return;

        if (!trimmed || trimmed === '0') {
          methods.setValue('token0DepositAmount', '', { shouldValidate: true, shouldDirty: true });
          methods.setValue('token1DepositAmount', '', { shouldValidate: true, shouldDirty: true });
          methods.trigger(['token0DepositAmount', 'token1DepositAmount']);
          return;
        }

        const validAmount = limitDecimalPlaces(trimmed);
        const parsed = parseFloat(validAmount);
        if (isNaN(parsed) || parsed <= 0) return;

        const result = calculate_mint_amounts({
          selected_amount: validAmount,
          token0,
          token1,
          sqrt_price_x96: sqrtPriceX96,
          min_tick: minTick,
          max_tick: maxTick,
          is_amount_zero: isAmountZero,
        });

        methods.setValue('token0DepositAmount', result.token0.formatted, {
          shouldValidate: true,
          shouldDirty: true,
        });
        methods.setValue('token1DepositAmount', result.token1.formatted, {
          shouldValidate: true,
          shouldDirty: true,
        });

        methods.trigger(['token0DepositAmount', 'token1DepositAmount']);
      },

      handleSetMarketPrice: () => {
        const { methods, isToken0Selected } = get();
        const { icpTokens } = useSharedStore.getState();
        const [token0, token1] = methods.getValues(['token0', 'token1']);
        if (!token0 || !token1 || !icpTokens) return;

        const { price } = get_market_price(
          { is_token0_selected: isToken0Selected, token0, token1, price: '0' },
          icpTokens,
        );
        get().handleInitialPriceInput(price);
      },

      selectTokenHandler: ({ name, value }) => {
        const methods = get().methods;
        methods.resetField('token0DepositAmount');
        methods.resetField('token1DepositAmount');
        methods.resetField('minPrice');
        methods.resetField('maxPrice');
        methods.resetField('initialPrice');
        methods.resetField('sqrtPriceX96');
        methods.setValue('tickSpacing', 0);
        methods.setValue('fee', 3000);
        methods.setValue(name, value);
        methods.clearErrors();
      },

      selectFeeHandler: (value) => {
        const store = get();
        store.feeManuallySelected.current = true;
        store.methods.setValue('fee', value);
        store.methods.clearErrors('fee');
        store.getTickSpacingHandler(value);
      },

      getTickSpacingHandler: (fee) => {
        const methods = get().methods;
        const tickSpacing = getTickSpacing(fee);
        methods.setValue('tickSpacing', tickSpacing ?? 0);
      },

      getStepValidationFields: (step) => {
        switch (step) {
          case 0:
            return ['fee', 'token0', 'token1'];
          case 1:
            return ['initialPrice'];
          case 2:
            return ['token0DepositAmount', 'token1DepositAmount'];
          default:
            return [];
        }
      },
    };
  }),
);

export const useCreatePoolStoreActions = () => useCreatePoolStore((state) => state);
