'use client';
import React, { useEffect, useState } from 'react';
import YourPositions from './_components/YourPositions';
import { useSharedStore } from '@/store/store';
import { useGetPositions } from './_api';
import { Principal } from '@dfinity/principal';
import PositionDetails from './_components/position-details';
import { FormattedPosition } from './types';

export default function PositionsPage() {
  const [selectedPosition, setSelectedPosition] = useState<FormattedPosition | undefined>();
  const [error, setError] = useState<{
    text: string;
    type: 'walletConnection' | 'network';
  }>();
  const { icpIdentity } = useSharedStore();
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
  };

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

  return (
    <PositionDetails
      position={selectedPosition}
      onBackClick={() => setSelectedPosition(undefined)}
    />
  );
}
