import useWindowStore from '@/app/hooks/use-window-store';
import React from 'react';
import useRelicStore from '@/app/hooks/use-relic-store';
import { useJsonFile } from '@/app/apis/files';
import ImageDisplay from '@/app/components/image-display';
import { Chip } from '@nextui-org/chip';
import { cn } from '@nextui-org/react';

export default function RelicScore() {
  const { scanningStatus } = useWindowStore();
  const { relicScores } = useRelicStore();
  const { data: characters } = useJsonFile('character/character_meta.json');

  const renderScore = (score: number, type: string) => {
    score = score * 100;
    const scoreText = `${
      type === 'potential' ? '潜力值' : '评分'
    }:${score.toFixed(2)}`;
    switch (type) {
      case 'potential':
        if (score < 20) {
          return <span className="flex gap-2 items-center">
            <span className="font-semibold">
              建议分解
            </span>
            <span>
              {scoreText}
            </span>
          </span>;
        } else if (score < 40) {
          return <span className="flex gap-2 items-center">
            <span className="font-semibold">
              不推荐强化
            </span>
            <span>
              {scoreText}
            </span>
          </span>;
        } else if (score < 60) {
          return <span className="flex gap-2 items-center">
            <span className="font-semibold">
              可以强化
            </span>
            <span>
              {scoreText}
            </span>
          </span>;
        } else if (score < 80) {
          return <span className="flex gap-2 items-center">
            <span className="font-semibold">
              推荐强化
            </span>
            <span>
              {scoreText}
            </span>
          </span>;
        } else {
          return <span className="flex gap-2 items-center">
            <span className="font-semibold">
              必须强化
            </span>
            <span>
              {scoreText}
            </span>
          </span>;
        }
      case 'actual':
        if (score < 20) {
          return <span className="flex gap-2 items-center">
            <span className="font-semibold text-medium">
              C
            </span>
            <span>
              {scoreText}
            </span>
          </span>;
        } else if (score < 40) {
          return <span className="flex gap-2 items-center">
            <span className="font-semibold text-medium">
              B
            </span>
            <span>
              {scoreText}
            </span>
          </span>;
        } else if (score < 60) {
          return <span className="flex gap-2 items-center">
            <span className="font-semibold text-medium">
              A
            </span>
            <span>
              {scoreText}
            </span>
          </span>;
        } else if (score < 80) {
          return <span className="flex gap-2 items-center">
            <span className="font-semibold text-medium">
              S
            </span>
            <span>
              {scoreText}
            </span>
          </span>;
        } else {
          return <span className="flex gap-2 items-center">
            <span className="font-semibold text-medium">
              ACE
            </span>
            <span>
              {scoreText}
            </span>
          </span>;
        }
      default:
        break;
    }

  };


  const renderScoreResult = () => {
    if (!scanningStatus || !relicScores || relicScores.length === 0) {
      return null;
    }

    return (
      <div className="mt-2 flex flex-col justify-center gap-2">
        {
          relicScores.map((score, index) => (
            <div key={index} className="flex items-center justify-center gap-2 font-semibold ">
              <Chip
                classNames={{
                  base: cn(
                    score.score * 100 < 20 ? 'bg-black' :
                      score.score * 100 < 40 ? 'bg-gray-500' :
                        score.score * 100 < 60 ? 'bg-green-500' :
                          score.score * 100 < 80 ? 'bg-yellow-500' : 'bg-red-500',
                  ),
                  content: 'drop-shadow shadow-black text-white',
                }}
              >
                {renderScore(score.score, score.type)}
              </Chip>
              {
                score.characters.map((character, index) => (
                  <div key={index}>
                    <ImageDisplay filePath={characters[character].icon} width={20} height={20}
                                  className="rounded-lg" />
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
    );

  };


  return <div>{renderScoreResult()}</div>;
}