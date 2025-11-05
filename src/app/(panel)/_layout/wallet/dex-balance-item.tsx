import { withdraw_funds_from_appic_dex } from '@/blockchain_api/functions/icp/dex/tx/withdraw';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { Avatar } from '@/components/common/ui/avatar';
import Spinner from '@/components/common/ui/spinner';
import { queryKeys } from '@/lib/constants/query-keys';
import { useToast } from '@/lib/hooks/use-toast';
import { useSharedStore } from '@/store/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const DexBalanceItem = ({
  token,
}: {
  token: IcpToken & { chainLogo: string; chainName: string; displayUsd: string };
}) => {
  const { authenticatedAgent } = useSharedStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['withdraw-dex-balance', token.canisterId],
    mutationFn: ({ amount }: { amount: string }) =>
      withdraw_funds_from_appic_dex({ amount, token }, authenticatedAgent!),
    onError: () => {
      toast({ title: 'Something went wrong', variant: 'destructive' });
    },
  });

  const withdrawHandler = async () => {
    const result = await mutateAsync({ amount: token.balance! });
    if (result.success) {
      toast({ title: 'Withdrawal successful', variant: 'default' });
      queryClient.invalidateQueries({ queryKey: [queryKeys.icpBalance] });
    } else {
      toast({ title: 'Something went wrong', variant: 'destructive' });
    }
  };

  return (
    <div className="flex justify-between text-sm text-primary">
      <div className="relative flex items-center gap-x-5">
        <Avatar src={token.logo} className="h-9 w-9" />
        <Avatar src={token.chainLogo} className="absolute left-7 top-5 h-4 w-4" />
        <span>{`${token.symbol} (${token.chainName})`}</span>
      </div>
      <div className="flex flex-col">
        <span>$ {token.displayUsd}</span>
        {isPending ? (
          <Spinner className="h-3 w-3" />
        ) : (
          <button className="text-xs" onClick={() => withdrawHandler()}>
            Withdraw
          </button>
        )}
      </div>
    </div>
  );
};
