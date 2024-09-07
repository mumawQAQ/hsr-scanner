'use client';
import React from 'react';
import RelicInfo from '@/app/components/relic-info';
import RelicAction from '@/app/components/relic-action';
import RelicLogger from '@/app/components/relic-logger';
import RelicImage from '@/app/components/relic-image';
import { Divider } from '@nextui-org/divider';
import useWindowStore from '@/app/hooks/use-window-store';

export default function RelicPanel() {
  const { imgShow } = useWindowStore();
  return (
    <div className="grid grid-cols-4 gap-4 pt-2">
      <div className="flex justify-center">
        <RelicAction />
      </div>
      <div className="col-span-3 flex flex-col justify-center">
        <div className="flex justify-center">
          <RelicInfo />
        </div>
        <div className="flex justify-center gap-10">
          <RelicLogger />
          {imgShow && <Divider orientation="vertical" />}
          {imgShow && <RelicImage />}
        </div>
      </div>
    </div>
  );
}
