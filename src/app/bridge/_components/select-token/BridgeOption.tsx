import { Card } from '@/components/ui/card';
import { cn, formatToSignificantFigures } from '@/lib/utils';
import Image from 'next/image';
import { ChevronDownIcon, ClockIcon, FireIcon } from '@/components/icons';
import { BridgeOption as BridgeOptionType } from '@/blockchain_api/functions/icp/get_bridge_options';
import { TokenType } from '@/app/bridge/_store';

interface BridgeOptionProps {
  option: BridgeOptionType;
  isSelected: boolean;
  isExpanded: boolean;
  handleOptionSelect: (option: BridgeOptionType) => void;
  onExpand: (option: BridgeOptionType) => void;
  className?: string;
  toToken: TokenType;
}

const BridgeOption = ({
  isSelected,
  isExpanded,
  handleOptionSelect,
  onExpand,
  option,
  className,
  toToken,
}: BridgeOptionProps) => {
  return (
    <Card
      onClick={() => handleOptionSelect(option)}
      className={cn(
        'w-full flex-col items-start justify-between gap-3 overflow-hidden rounded-[20px] border !py-4 px-4',
        'md:rounded-[36px] md:px-6',
        'transition duration-300',
        'cursor-pointer',
        'bg-highlighted-card',
        isSelected ? 'border-blue-600' : 'border-gray-700',
        className,
      )}
    >
      {/* top section */}
      <div className="flex w-full items-center justify-between">
        <div className="flex-1">
          <p
            className={cn(
              'w-fit rounded-[10px] px-2 py-1 text-xs font-thin text-muted md:text-sm',
              'bg-primary-buttons text-white',
            )}
          >
            {option.badge}
          </p>
        </div>
        <button
          onClick={() => onExpand(option)}
          className={cn(
            'ml-auto flex items-center rounded-[10px] bg-gray-400 bg-opacity-20 p-2',
            isExpanded && 'rotate-180',
          )}
        >
          <ChevronDownIcon width={10} height={10} />
        </button>
      </div>
      {/* middle section */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-x-2">
          <div className="rounded-full border-2 border-white/50 p-1 md:p-2">
            <div className={cn('relative h-7 w-7', 'lg:h-10 lg:w-10')}>
              <Image src={toToken.logo} alt="btc" className="rounded-full object-contain" fill />
            </div>
          </div>
          <p
            className={cn(
              'text-base lg:text-xl',
              option.human_readable_estimated_return.length > 7 && 'w-fit text-ellipsis md:w-48',
            )}
          >
            ~{' '}
            {formatToSignificantFigures(option.human_readable_estimated_return) +
              ' ' +
              toToken.symbol}
          </p>
        </div>
        <div className="flex flex-col items-end gap-y-3">
          <div className="flex items-center gap-x-1 rounded-xl bg-white px-2 py-1 md:rounded-2xl md:px-4">
            <span className={cn('text-xs text-blue-600 lg:text-sm')}>via {option.via}</span>
            <Image src="images/logo/icp-logo.svg" alt="logo" width={15} height={15} />
          </div>
        </div>
      </div>
      {/* bottom section */}
      <div className="flex w-full items-end justify-end gap-x-4">
        <span className="flex w-max items-center gap-x-1">
          <p className="text-xs font-thin text-primary">
            ${Number(option.fees.total_fee_usd_price).toFixed(2)}
          </p>
          <FireIcon width={15} height={15} className="text-primary" />
        </span>
        <span className="flex w-max items-center gap-x-1">
          <p className="text-xs font-thin text-primary">{option.duration}</p>
          <ClockIcon width={15} height={15} className="text-primary" />
        </span>
      </div>

      {/* Expanded content */}

      <div
        className={cn(
          'w-full border-t border-gray-200 dark:border-gray-700',
          'transform transition-all duration-300',
          isExpanded
            ? 'mb-2 mt-4 translate-y-0 pt-4 opacity-100'
            : 'h-0 -translate-y-2 overflow-hidden opacity-0',
        )}
      >
        <div className="space-y-4">
          <p className="text-sm font-medium">Option Details:</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Network Fee:</span>
              <span>
                ~{' '}
                {formatToSignificantFigures(option.fees.human_readable_max_network_fee) +
                  ' ' +
                  option.fees.native_fee_token_symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Estimated Time:</span>
              <span>{option.duration}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Minter Fee:</span>
              <span>
                ~{' '}
                {option.fees.human_readable_minter_fee + ' ' + option.fees.native_fee_token_symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Max Fee:</span>
              <span>
                ~{' '}
                {formatToSignificantFigures(option.fees.human_readable_total_native_fee) +
                  ' ' +
                  option.fees.native_fee_token_symbol}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BridgeOption;
