import { X } from 'lucide-react';
import { useState } from 'react';

import StatsBadgeList from '@/components/panel/relic-tool-panel/badge-list/stats-badge-list.tsx';
import RelicMainStatsSelector from '@/components/panel/relic-tool-panel/selector/relic-main-stats-selector.tsx';
import RelicSetSelector from '@/components/panel/relic-tool-panel/selector/relic-set-selector.tsx';
import RelicSubStatsSelector from '@/components/panel/relic-tool-panel/selector/relic-sub-stats-selector.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import {
  Characters,
  RelicBodyMainStatsType,
  RelicGloveMainStatsType,
  RelicHeadMainStatsType,
  RelicRopeMainStatsType,
  RelicSets,
  RelicShoeMainStatsType,
  RelicSphereMainStatsType,
  RelicSubStatsType,
} from '@/types.ts';
import CharacterSelector from '@/components/panel/relic-tool-panel/selector/character-selector.tsx';

type RelicRuleCardProps = {
  ruleId: string;
};

const RelicRuleCard = ({ ruleId }: RelicRuleCardProps) => {
  const [setNames, setSetNames] = useState<string[]>([]);
  const [headMainStats, setHeadMainStats] = useState<string[]>([]);
  const [gloveMainStats, setGloveMainStats] = useState<string[]>([]);
  const [bodyMainStats, setBodyMainStats] = useState<string[]>([]);
  const [shoeMainStats, setShoeMainStats] = useState<string[]>([]);
  const [sphereMainStats, setSphereMainStats] = useState<string[]>([]);
  const [ropeMainStats, setRopeMainStats] = useState<string[]>([]);
  const [subStats, setSubStats] = useState<string[]>([]);
  const [characters, setCharacters] = useState<string[]>([]);

  const handleClearAll = () => {
    setHeadMainStats([]);
    setGloveMainStats([]);
    setBodyMainStats([]);
    setShoeMainStats([]);
    setSphereMainStats([]);
    setRopeMainStats([]);
    setSubStats([]);
  };

  const handleSetNamesChange = (setNames: string[]) => {
    // if the new setNames is empty, clear all main stats
    if (setNames.length === 0) {
      handleClearAll();
    }

    // if the new setNames don't any inner set, clear the sphere and rope main stats
    if (!setNames.some(setName => RelicSets[setName].isInner)) {
      setSphereMainStats([]);
      setRopeMainStats([]);
    }

    // if the new setNames don't any outer set, clear the head, glove, body, shoe main stats
    if (!setNames.some(setName => !RelicSets[setName].isInner)) {
      setHeadMainStats([]);
      setGloveMainStats([]);
      setBodyMainStats([]);
      setShoeMainStats([]);
    }

    setSetNames(setNames);
  };

  return (
    <Card className="relative h-fit pt-5">
      <button
        className="absolute right-2 top-2 rounded-full bg-rose-500 p-0.5 text-white shadow-sm"
        onClick={e => {
          e.stopPropagation();
          console.log('X clicked');
        }}
      >
        <X className="h-4 w-4" />
      </button>
      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <div className="font-semibold">遗器套装:</div>
          <RelicSetSelector selectedKeys={setNames} onSelectionChange={handleSetNamesChange} />
        </div>
        <div>
          {setNames &&
            setNames.map((setName, index) => (
              <Badge key={index} className="mr-2 inline-flex flex-row items-center gap-1">
                <img src={RelicSets[setName].icon} className="h-6 w-6" alt="relic icon" />
                {RelicSets[setName].name}
              </Badge>
            ))}
        </div>
        {setNames.length > 0 && (
          <div>
            <Separator className="my-2" />
            <div className="font-semibold">遗器主属性:</div>
            <div>
              {
                // any setName is not inner to show the head, glove, body, shoe
                setNames.some(setName => !RelicSets[setName].isInner) && (
                  <div>
                    <RelicMainStatsSelector
                      partName="头"
                      selectedKeys={headMainStats}
                      onSelectionChange={setHeadMainStats}
                      mainStats={Object.values(RelicHeadMainStatsType)}
                    />
                    {headMainStats.length > 0 && <StatsBadgeList stats={headMainStats} />}
                    <RelicMainStatsSelector
                      partName="手"
                      selectedKeys={gloveMainStats}
                      onSelectionChange={setGloveMainStats}
                      mainStats={Object.values(RelicGloveMainStatsType)}
                    />
                    {gloveMainStats.length > 0 && <StatsBadgeList stats={gloveMainStats} />}
                    <RelicMainStatsSelector
                      partName="衣"
                      selectedKeys={bodyMainStats}
                      onSelectionChange={setBodyMainStats}
                      mainStats={Object.values(RelicBodyMainStatsType)}
                    />
                    {bodyMainStats.length > 0 && <StatsBadgeList stats={bodyMainStats} />}
                    <RelicMainStatsSelector
                      partName="鞋"
                      selectedKeys={shoeMainStats}
                      onSelectionChange={setShoeMainStats}
                      mainStats={Object.values(RelicShoeMainStatsType)}
                    />
                    {shoeMainStats.length > 0 && <StatsBadgeList stats={shoeMainStats} />}
                  </div>
                )
              }
              {
                // any setName is inner, show the sphere, rope
                setNames.some(setName => RelicSets[setName].isInner) && (
                  <div>
                    <RelicMainStatsSelector
                      partName="球"
                      selectedKeys={sphereMainStats}
                      onSelectionChange={setSphereMainStats}
                      mainStats={Object.values(RelicSphereMainStatsType)}
                    />
                    {sphereMainStats.length > 0 && <StatsBadgeList stats={sphereMainStats} />}
                    <RelicMainStatsSelector
                      partName="绳"
                      selectedKeys={ropeMainStats}
                      onSelectionChange={setRopeMainStats}
                      mainStats={Object.values(RelicRopeMainStatsType)}
                    />
                    {ropeMainStats.length > 0 && <StatsBadgeList stats={ropeMainStats} />}
                  </div>
                )
              }
            </div>
            <Separator className="my-2" />
            <div className="flex flex-row gap-2">
              <div className="font-semibold">遗器副属性:</div>
              <RelicSubStatsSelector
                selectedKeys={subStats}
                onSelectionChange={setSubStats}
                subStats={Object.values(RelicSubStatsType)}
              />
            </div>
            <StatsBadgeList stats={subStats} />
            <Separator className="my-2" />
            <div className="flex flex-row gap-2">
              <div className="font-semibold">适用角色:</div>
              <CharacterSelector selectedKeys={characters} onSelectionChange={setCharacters} />
            </div>
            <div className="mt-2">
              {characters &&
                characters.map((character, index) => (
                  <Badge key={index} className="mr-2 inline-flex flex-row items-center gap-1">
                    <img src={Characters[character].icon} className="h-6 w-6" alt="relic icon" />
                    {Characters[character].name}
                  </Badge>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RelicRuleCard;
