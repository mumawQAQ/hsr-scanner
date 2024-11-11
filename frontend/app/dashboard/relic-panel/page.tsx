'use client';
import React from 'react';
import RelicInfo from '@/app/components/relic-info';
import RelicAction from '@/app/components/relic-action';
import { Divider } from '@nextui-org/divider';
import useWindowStore from '@/app/hooks/use-window-store';
import dynamic from 'next/dynamic';
import RelicScore from '@/app/components/relic-score';
import useRelicStore from '@/app/hooks/use-relic-store';

const RelicLogger = dynamic(() => import('@/app/components/relic-logger'), { ssr: false });

export default function RelicPanel() {
  const { isLightMode } = useWindowStore();
  const { relicScores } = useRelicStore();

  if (isLightMode) {
    return (<div className="grid grid-rows-4">
      <div className="flex justify-center">
        <RelicAction />
      </div>
      <div className="row-span-3 flex flex-col justify-center">
        <RelicScore />
      </div>
    </div>);
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="flex justify-center">
        <RelicAction />
      </div>
      <div className="col-span-3 flex flex-col justify-center">
        <div className="flex justify-center gap-2">
          <RelicInfo />
          {
            relicScores && <Divider orientation="vertical" />
          }
          <RelicScore />
        </div>
        <div className="mt-2 flex justify-center gap-2">
          <RelicLogger />
        </div>
      </div>
    </div>
  );
}
