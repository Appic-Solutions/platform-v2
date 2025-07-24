'use client';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';

import { Position } from '@/blockchain_api/functions/icp/dex/get_positions';
import { useState } from 'react';
import YourPositions from './_components/YourPositions';
import PositionDetail from './_components/PositionDetail';

export default function PositionsPage() {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  return (
    <Box
      className={cn(
        'text-white transition-all md:p-12 lg:overflow-visible lg:text-black lg:dark:text-white',
        'gap-y-9',
        selectedPosition ? 'md:h-[789px] lg:w-[1204px]' : 'lg:max-h-[716px] lg:w-[611px]',
        'md:p-12',
      )}
    >
      {selectedPosition ? (
        <PositionDetail setSelectedPosition={setSelectedPosition} position={selectedPosition} />
      ) : (
        <YourPositions setSelectedPosition={setSelectedPosition} />
      )}
    </Box>
  );
}
