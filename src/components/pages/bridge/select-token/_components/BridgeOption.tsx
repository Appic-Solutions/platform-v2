import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ChevronDownIcon, ClockIcon, FireIcon } from '@/components/icons';
import { BridgeOption as BridgeOptionType } from '@/blockchain_api/functions/icp/get_bridge_options';

interface BridgeOptionProps {
  option: BridgeOptionType;
  isSelected: boolean;
  isExpanded: boolean;
  handleOptionSelect: (option: BridgeOptionType) => void;
  onExpand: (option: BridgeOptionType) => void;
  className?: string;
}

const BridgeOption = ({
  isSelected,
  isExpanded,
  handleOptionSelect,
  onExpand,
  option,
  className,
}: BridgeOptionProps) => {
  return (
    <Card
      onClick={() => handleOptionSelect(option)}
      className={cn(
        '!py-4 px-4 border min-w-[300px] flex-col gap-3 items-start justify-between overflow-hidden rounded-[20px]',
        'md:px-6 md:rounded-[36px]',
        'transition duration-300',
        'cursor-pointer',
        'bg-highlighted-card',
        isSelected ? 'border-blue-600' : 'border-gray-700',
        className,
      )}
    >
      {/* top section */}
      <div className="flex items-center justify-between w-full">
        <div className="flex-1">
          <p
            className={cn(
              'text-muted text-xs md:text-sm font-thin py-1 px-2 rounded-[10px] w-fit',
              'bg-primary-buttons text-white',
            )}
          >
            {option.badge}
          </p>
        </div>
        <button
          onClick={() => onExpand(option)}
          className={cn(
            'bg-gray-400 bg-opacity-20 rounded-[10px] p-2 flex items-center ml-auto',
            isExpanded && 'rotate-180',
          )}
        >
          <ChevronDownIcon width={10} height={10} />
        </button>
      </div>
      {/* middle section */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-x-3">
          <div className="border-2 border-white/50 rounded-full p-2">
            <div className={cn('relative w-7 h-7', 'lg:w-10 lg:h-10')}>
              <Image
                src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                alt="btc"
                className="object-contain"
                fill
              />
            </div>
          </div>
          <p className={cn('text-base lg:text-xl', option.estimated_return.length > 7 && 'text-ellipsis w-36')}>
            {option.estimated_return}
          </p>
        </div>
        <div className="flex flex-col gap-y-3 items-end">
          <div className="px-4 py-1 rounded-2xl flex items-center gap-x-1 bg-white">
            <span className={cn('text-xs lg:text-sm text-blue-600')}>via {option.via}</span>
            <Image src="images/logo/icp-logo.png" alt="logo" width={15} height={15} />
          </div>
        </div>
      </div>
      {/* bottom section */}
      <div className="flex items-end w-full justify-end gap-x-4">
        <span className="flex items-center gap-x-1 w-max">
          <p className="text-xs font-thin text-primary">${option.fees.total_fee_usd_price}</p>
          <FireIcon width={15} height={15} className="text-primary" />
        </span>
        <span className="flex items-center gap-x-1 w-max">
          <p className="text-primary text-xs font-thin">10 Mins</p>
          <ClockIcon width={15} height={15} className="text-primary" />
        </span>
      </div>

      {/* Expanded content */}

      <div
        className={cn(
          'w-full border-t border-gray-200 dark:border-gray-700',
          'transition-all duration-300 transform',
          isExpanded ? 'opacity-100 mb-4 translate-y-0 pt-4 mt-4' : 'opacity-0 h-0 overflow-hidden -translate-y-2',
        )}
      >
        <div className="space-y-4">
          <p className="text-sm font-medium">Option Details:</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Network Fee:</span>
              <span>${option.fees.max_network_fee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Estimated Time:</span>
              <span>{option.duration}</span>
            </div>
            {/* <div className="flex justify-between text-sm">
              <span className="text-muted">Route:</span>
              <span>Direct Bridge</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Security:</span>
              <span>High</span>
            </div> */}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BridgeOption;
