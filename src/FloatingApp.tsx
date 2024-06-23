import { useState } from 'react';
import { FloatingWindowMessageRelicInfo } from '../types.ts';
import './App.css';
import clsx from 'clsx';
import { Chip } from '@nextui-org/react';

function FloatingApp() {
  const [relicInfo, setRelicInfo] = useState<FloatingWindowMessageRelicInfo | null>(null);

  window.ipcRenderer.on('main-process-message', (_event, message) => {
    setRelicInfo(message as FloatingWindowMessageRelicInfo);
  });

  return (
    <div className={'flex flex-col items-center justify-center py-1 text-center'}>
      {relicInfo && relicInfo.data && (
        <div>
          <Chip
            color={
              relicInfo.data.isMostValuableRelic ? 'success' : relicInfo.data.isValuableRelic ? 'warning' : 'danger'
            }
            size={'lg'}
          >
            {relicInfo.data.isMostValuableRelic ? '建议锁定' : relicInfo.data.isValuableRelic ? '可以保留' : '建议分解'}
          </Chip>
          <div className={'mb-2 font-bold'}>{relicInfo.data.relicTitle}</div>
          <div className={'mb-2 font-bold text-indigo-500'}>遗器成长值: {relicInfo.data.absoluteScore}</div>
          <div className="mt-1 font-bold">主属性</div>
          {relicInfo.data.mainRelicStats && (
            <div
              className={clsx(
                relicInfo.data.isValuableMainStats ? 'isValuable' : 'isNotValuable',
                'flex flex-row gap-2'
              )}
            >
              <Chip color={relicInfo.data.isValuableMainStats ? 'success' : 'danger'}>
                {relicInfo?.data.isValuableMainStats ? '有效' : '无效'}
              </Chip>
              <div>
                {relicInfo.data.mainRelicStats.name} : {relicInfo.data.mainRelicStats.number}
              </div>
              <div>等级: {relicInfo.data.mainRelicStats.level}</div>
            </div>
          )}

          <div className="mt-1 font-bold">副属性</div>
          <div>
            {relicInfo.data.subRelicStats.map((subStat, index) => (
              <div
                key={index}
                className={clsx(
                  relicInfo.data.isValuableSubStats[index + 1] ? 'isValuable' : 'isNotValuable',
                  'my-1 flex flex-row gap-2'
                )}
              >
                <Chip color={relicInfo.data.isValuableSubStats[index + 1] ? 'success' : 'danger'}>
                  {relicInfo?.data.isValuableSubStats[index + 1] ? '有效' : '无效'}
                </Chip>
                <div>
                  {subStat.name}: {subStat.number}
                </div>
                <div>评分: {subStat.score}</div>
              </div>
            ))}
          </div>
          <div className={'mt-2 font-bold text-red-700'}>如须修改评分标准, 请在主页面中修改</div>
        </div>
      )}
    </div>
  );
}

export default FloatingApp;
