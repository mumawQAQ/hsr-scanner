import { useState } from 'react';

import { FloatingWindowMessageRelicInfo } from '../types.ts';

import './App.css';
import { Badge } from '@/components/ui/badge.tsx';
import { cn } from '@/lib/utils.ts';

function FloatingApp() {
  const [relicInfo, setRelicInfo] = useState<FloatingWindowMessageRelicInfo | null>(null);

  window.ipcRenderer.on('main-process-message', (_event, message) => {
    setRelicInfo(message as FloatingWindowMessageRelicInfo);
    console.log('Received relic info:', message);
  });

  return (
    <div className={'draggable-area flex flex-col items-center justify-center py-1 text-center'}>
      {relicInfo && relicInfo.data && relicInfo.data.OCRResult && (
        <div>
          <Badge
            className={cn(
              relicInfo.data.isMostValuableRelic
                ? 'bg-yellow-600'
                : relicInfo.data.isValuableRelic
                  ? 'bg-green-600'
                  : 'bg-red-600'
            )}
          >
            {relicInfo.data.isMostValuableRelic ? '建议锁定' : relicInfo.data.isValuableRelic ? '可以保留' : '建议分解'}
          </Badge>
          {relicInfo.data.OCRResult.title.result && (
            <div className={'text-lg font-bold text-indigo-600'}>{relicInfo.data.OCRResult.title.result}</div>
          )}
          {relicInfo.data.OCRResult.title.error && (
            <div className={'text-red-600'}>{relicInfo.data.OCRResult.title.error}</div>
          )}
          <div className={'mb-2 font-semibold'}>遗器成长值: {relicInfo.data.absoluteScore}</div>
          <div className="mt-1 font-bold">主属性</div>
          {relicInfo.data.OCRResult.mainStats.result && (
            <div
              className={cn(relicInfo.data.isValuableMainStats ? 'isValuable' : 'isNotValuable', 'flex flex-row gap-2')}
            >
              <Badge className={cn(relicInfo.data.isValuableMainStats ? 'bg-green-600' : 'bg-red-600')}>
                {relicInfo?.data.isValuableMainStats ? '有效' : '无效'}
              </Badge>
              <div
                className={cn('font-semibold', relicInfo.data.isValuableMainStats ? 'text-green-600' : 'text-red-600')}
              >
                {relicInfo.data.OCRResult.mainStats.result.name} : {relicInfo.data.OCRResult.mainStats.result.number} +
                {relicInfo.data.OCRResult.mainStats.result.level}
              </div>
            </div>
          )}
          {relicInfo.data.OCRResult.mainStats.error && (
            <div className={'text-red-600'}>{relicInfo.data.OCRResult.mainStats.error}</div>
          )}

          <div className="mt-1 font-bold">副属性</div>
          {relicInfo.data.OCRResult.subStats.result && (
            <div>
              {relicInfo.data.OCRResult.subStats.result.map((subStat, index) => (
                <div
                  key={index}
                  className={cn(
                    relicInfo.data.isValuableSubStats[index + 1] ? 'isValuable' : 'isNotValuable',
                    'my-1 flex flex-row gap-2'
                  )}
                >
                  <Badge
                    className={cn(
                      relicInfo.data.isValuableSubStats[index + 1] ? 'bg-green-600' : 'bg-red-600',
                      'text-white'
                    )}
                  >
                    {relicInfo?.data.isValuableSubStats[index + 1] ? '有效' : '无效'}
                  </Badge>
                  <div>
                    {subStat.name}: {subStat.number}
                  </div>
                  <div>评分: {Array.isArray(subStat.score) ? subStat.score.join(' | ') : subStat.score}</div>
                </div>
              ))}
            </div>
          )}
          {relicInfo.data.OCRResult.subStats.error && (
            <div className={'text-red-600'}>{relicInfo.data.OCRResult.subStats.error}</div>
          )}
          <div className={'mt-4 font-bold text-red-700'}>如需修改评分标准, 请在主页面中修改</div>
        </div>
      )}
      {relicInfo && relicInfo.data && !relicInfo.data.OCRResult && (
        <div className="text-wrap p-6 font-semibold text-green-600">
          等待主窗口传输信息中，如果等待时间过长，请查看主窗口是否识别
        </div>
      )}
      {relicInfo && !relicInfo.data && <div className="font-semibold text-red-600">无法识别遗器信息</div>}
      {!relicInfo && <div className="font-semibold text-indigo-600">切换遗器，以查看遗器信息</div>}
    </div>
  );
}

export default FloatingApp;
