'use client';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import { Position } from '@/blockchain_api/functions/icp/dex/get_positions';
import React, { useEffect, useState } from 'react';
import YourPositions from './_components/YourPositions';
import PositionDetail from './_components/PositionDetail';
import AddLiquidity from './_components/AddLiquidity';
import CollectFeesPage from './_components/CollectFees';
import RemoveLiquidity from './_components/RemoveLiquidity';
import { useSharedStore } from '@/store/store';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { useGetPositions } from './_api';
import { Principal } from '@dfinity/principal';

export type Step =
  | 'addLiquidity'
  | 'removeLiquidity'
  | 'collectFees'
  | 'positionDetail'
  | 'yourPositions';

export type FormattedPosition = Position & {
  token0: IcpToken;
  token1: IcpToken;
};

export default function PositionsPage() {
  const [selectedPosition, setSelectedPosition] = useState<FormattedPosition | undefined>();
  const [error, setError] = useState<{
    text: string;
    type: 'walletConnection' | 'network';
  }>();
  const { icpIdentity } = useSharedStore();
  const [currentStep, setCurrentStep] = useState<Step>('yourPositions');
  const [formattedPositions, setFormattedPositions] = useState<FormattedPosition[]>([]);

  const { icpTokens, pools, unAuthenticatedAgent } = useSharedStore();
  const { mutateAsync: getPositions, data: positionsData } = useGetPositions();

  useEffect(() => {
    const getPositionsHandler = async () => {
      // if (!icpIdentity) {
      //   setError({
      //     type: 'walletConnection',
      //     text: 'To view your positions and rewards you must connect your wallet.',
      //   });
      //   return;
      // }
      // if (!icpTokens || !pools || !unAuthenticatedAgent || !icpIdentity) {
      if (!icpTokens || !pools || !unAuthenticatedAgent) {
        setError({
          type: 'network',
          text: 'Missing required data.',
        });
        console.log('Missing required data');
        return;
      }
      const res = await getPositions({
        icpTokens,
        pools,
        owner: Principal.fromText(
          '7qi53-mqll3-zmsxo-p4vf5-x3wye-nwsca-oag7a-s4tfq-6htqy-3c3zq-bqe',
        ),
        unAuthenticatedAgent,
      });

      if (res.success && res.result) {
        const formattedPositionsArray = res.result.map((position) => {
          const positionToken0 = icpTokens.find(
            (token) => token.canisterId === position.key.pool.token0.toString(),
          );
          const positionToken1 = icpTokens.find(
            (token) => token.canisterId === position.key.pool.token1.toString(),
          );
          return {
            ...position,
            token0: positionToken0!,
            token1: positionToken1!,
          };
        });
        setFormattedPositions(formattedPositionsArray);
        setError(undefined);
      }
    };
    getPositionsHandler();
  }, [icpTokens, pools, unAuthenticatedAgent, getPositions, icpIdentity]);

  const onSelectHandler = (position: FormattedPosition) => {
    setSelectedPosition(position);
    setCurrentStep('positionDetail');
  };

  const renderContent = () => {
    if (!selectedPosition) {
      return (
        <YourPositions
          error={error}
          formattedPositions={formattedPositions}
          onSelectHandler={onSelectHandler}
          selectedPosition={selectedPosition}
        />
      );
    }

    switch (currentStep) {
      case 'positionDetail':
        return (
          <PositionDetail
            setCurrentStep={setCurrentStep}
            setSelectedPosition={setSelectedPosition}
            position={selectedPosition}
          />
        );
      case 'addLiquidity':
        return <AddLiquidity position={selectedPosition} setCurrentStep={setCurrentStep} />;
      case 'collectFees':
        return <CollectFeesPage position={selectedPosition} setCurrentStep={setCurrentStep} />;
      case 'removeLiquidity':
        return <RemoveLiquidity position={selectedPosition} setCurrentStep={setCurrentStep} />;
      default:
        return (
          <YourPositions
            error={error}
            formattedPositions={formattedPositions}
            onSelectHandler={onSelectHandler}
            selectedPosition={selectedPosition}
          />
        );
    }
  };

  return (
    <Box
      className={cn(
        'text-white transition-all md:p-12 lg:overflow-visible lg:text-black lg:dark:text-white',
        'h-max',
        currentStep === 'positionDetail'
          ? 'md:h-[789px] lg:w-[1204px]'
          : 'lg:max-h-[716px] lg:w-[611px]',
        'md:p-12',
      )}
    >
      {renderContent()}
    </Box>
  );
}
