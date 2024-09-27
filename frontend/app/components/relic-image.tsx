'use client';
import React from 'react';
import useRelicStore from '@/app/hooks/use-relic-store';
import Image from 'next/image';
import { Tooltip } from '@nextui-org/react';
import { CircleAlert } from 'lucide-react';

export default function RelicImage() {
  const { relicImage } = useRelicStore();
  return (
    <div className="flex flex-col items-center">
      <Tooltip content="如果开启显示图片，请不要将窗口放置在游戏窗口上方，否则会影响识别" color="danger">
        <CircleAlert className="mb-2 text-red-700" />
      </Tooltip>
      {relicImage?.title_img ? (
        <Image src={relicImage.title_img} alt="title_img" width={300} height={100} />
      ) : (
        <div className="font-semibold">暂无遗器名称图片</div>
      )}
      {relicImage?.main_stat_img ? (
        <Image src={relicImage.main_stat_img} alt="main_stats_img" width={300} height={100} />
      ) : (
        <div className="font-semibold">暂无主属性图片</div>
      )}
      {relicImage?.sub_stat_img ? (
        <Image src={relicImage.sub_stat_img} alt="sub_stats_img" width={300} height={100} />
      ) : (
        <div className="font-semibold">暂无副属性图片</div>
      )}
    </div>
  );
}
