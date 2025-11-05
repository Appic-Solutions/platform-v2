import { useGetNewTokenData } from '@/app/(panel)/positions/_api';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { Avatar } from '@/components/common/ui/avatar';
import Spinner from '@/components/common/ui/spinner';
import { useSharedStore } from '@/store/store';
import { useEffect, useState } from 'react';
import { isValidIcpAddress } from '@/lib/helpers/validation';
import { DialogClose, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Cross1Icon } from '@radix-ui/react-icons';
import SolidCard from '@/components/ui/cards/SolidCard';
import Button from '@/components/common/ui/button';
import { getStorageItem, setStorageItem } from '@/lib/helpers/localstorage';
import { localStorageTemplate } from '@/lib/constants/local-storage';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/lib/hooks/use-toast';

interface Props {
  canisterId: string;
  onClose: () => void;
}

export const AddIcpToken = ({ canisterId, onClose }: Props) => {
  const [isChecked, setIsChecked] = useState(false);
  const { unAuthenticatedAgent } = useSharedStore();
  const [newToken, setNewToken] = useState<IcpToken>();
  const { mutateAsync: getTokenData, isPending, isError } = useGetNewTokenData();
  const { toast } = useToast();

  useEffect(() => {
    const findToken = async () => {
      if (unAuthenticatedAgent && isValidIcpAddress(canisterId)) {
        const foundToken = await getTokenData({
          canisterId,
          unAuthenticatedAgent,
        });
        if (foundToken.result && foundToken.success) {
          setNewToken(foundToken.result);
        } else {
          onClose();
          toast({ title: 'Token not found', variant: 'destructive' });
        }
      }
    };
    findToken();
  }, [unAuthenticatedAgent, canisterId]);

  const setNewTokenHandler = () => {
    const storedTokens = getStorageItem(localStorageTemplate.userAddedTokens);

    onClose();
    let rawTokens: IcpToken[] = [];
    try {
      rawTokens = storedTokens ? (JSON.parse(storedTokens) as IcpToken[]) : [];
      if (!Array.isArray(rawTokens)) {
        console.warn('Stored tokens is not an array, resetting to empty array');
        rawTokens = [];
      }
    } catch (error) {
      console.error('Error parsing stored tokens:', error);
      rawTokens = [];
    }

    if (newToken) {
      const isTokenExists = rawTokens.some((token) => token.canisterId === newToken.canisterId);
      if (isTokenExists) {
        console.warn(`Token with canisterId ${newToken.canisterId} already exists`);
        return;
      }

      rawTokens.push(newToken);
    } else {
      console.warn('No new token provided');
    }

    setStorageItem(localStorageTemplate.userAddedTokens, JSON.stringify(rawTokens));
  };

  return (
    <DialogContent
      aria-describedby={undefined}
      className="min-h-20 w-full max-w-sm p-8 text-center text-primary md:max-w-[500px]"
    >
      <DialogTitle>
        <h3 className="text-center text-lg font-bold text-primary">Import Token</h3>
      </DialogTitle>
      <DialogClose className="absolute right-4 top-4">
        <Cross1Icon className="h-4 w-4" />
      </DialogClose>
      {isPending ? (
        <Spinner />
      ) : newToken ? (
        <div className="flex w-full flex-col gap-6">
          <SolidCard>
            <div className="flex gap-4">
              <Avatar src={newToken.logo} className="h-7 w-7 md:h-[38px] md:w-[38px]" />
              <div className="flex flex-col items-start">
                <p
                  className={cn(
                    'text-nowrap text-lg md:text-xl',
                    newToken.symbol.length && newToken.symbol.length > 7 && 'w-28 text-ellipsis',
                  )}
                >
                  {newToken.symbol}
                </p>
                <p className={cn('text-nowrap text-xs text-muted')}>{newToken.canisterId}</p>
              </div>
            </div>
          </SolidCard>

          <div className="rounded-md bg-yellow-600/10 p-4">
            <span className="inline pr-2 text-yellow-600">Waning!</span>
            <p className="inline text-sm font-thin">
              On the Internet Computer, anyone can create a token with any name and logo. Some may
              copy existing tokens or claim to represent projects that don’t even have a token.
              Purchasing these fakes can result in lost assets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox checked={isChecked} onCheckedChange={() => setIsChecked(!isChecked)} />
            <span className="text-start text-sm">
              I have read and understood the risks, and I accept them.
            </span>
          </div>

          <Button disabled={!isChecked} onClick={setNewTokenHandler} className="w-full rounded-xl">
            Confirm
          </Button>
        </div>
      ) : isError ? (
        <p>Failed to get token data.</p>
      ) : (
        <p>Something went wrong</p>
      )}
    </DialogContent>
  );
};
