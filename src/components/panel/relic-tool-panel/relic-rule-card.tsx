import { X } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import StatsBadgeList from '@/components/panel/relic-tool-panel/badge-list/stats-badge-list.tsx';
import CharacterSelector from '@/components/panel/relic-tool-panel/selector/character-selector.tsx';
import RelicMainStatsSelector from '@/components/panel/relic-tool-panel/selector/relic-main-stats-selector.tsx';
import RelicSetSelector from '@/components/panel/relic-tool-panel/selector/relic-set-selector.tsx';
import RelicSubStatsSelector from '@/components/panel/relic-tool-panel/selector/relic-sub-stats-selector.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { CharactersData } from '@/data/characters-data.ts';
import { RelicSetsData } from '@/data/relic-sets-data.ts';
import useRelicTemplateStore from '@/hooks/use-relic-template-store.ts';
import {
  RatingRule,
  RelicBodyMainStatsType,
  RelicGloveMainStatsType,
  RelicHeadMainStatsType,
  RelicRopeMainStatsType,
  RelicShoeMainStatsType,
  RelicSphereMainStatsType,
  RelicSubStatsType,
  ValuableSubStatsV2,
} from '@/type/types.ts';

type RelicRuleCardProps = {
  templateId: string;
  ruleId: string;
  rule: RatingRule;
};

const RelicRuleCard = ({ templateId, ruleId, rule }: RelicRuleCardProps) => {
  const { removeRelicRatingRule, createOrUpdateRelicRatingRule } = useRelicTemplateStore();

  const [setNames, setSetNames] = useState<string[]>([]);
  const [headMainStats, setHeadMainStats] = useState<string[]>([]);
  const [gloveMainStats, setGloveMainStats] = useState<string[]>([]);
  const [bodyMainStats, setBodyMainStats] = useState<string[]>([]);
  const [shoeMainStats, setShoeMainStats] = useState<string[]>([]);
  const [sphereMainStats, setSphereMainStats] = useState<string[]>([]);
  const [ropeMainStats, setRopeMainStats] = useState<string[]>([]);
  const [subStats, setSubStats] = useState<ValuableSubStatsV2[]>([]);
  const [characters, setCharacters] = useState<string[]>([]);

  useEffect(() => {
    setSetNames(rule.setNames);

    let headInited = false;
    let gloveInited = false;
    let bodyInited = false;
    let shoeInited = false;
    let sphereInited = false;
    let ropeInited = false;

    Object.values(rule.partNames).forEach(({ valuableMain, partType }) => {
      if (partType === 'Head' && !headInited) {
        setHeadMainStats(valuableMain);
        headInited = true;
      }
      if (partType === 'Hand' && !gloveInited) {
        setGloveMainStats(valuableMain);
        gloveInited = true;
      }
      if (partType === 'Body' && !bodyInited) {
        setBodyMainStats(valuableMain);
        bodyInited = true;
      }
      if (partType === 'Feet' && !shoeInited) {
        setShoeMainStats(valuableMain);
        shoeInited = true;
      }
      if (partType === 'Sphere' && !sphereInited) {
        setSphereMainStats(valuableMain);
        sphereInited = true;
      }
      if (partType === 'Rope' && !ropeInited) {
        setRopeMainStats(valuableMain);
        ropeInited = true;
      }
    });

    // compatible with v2 data structure
    if (rule.valuableSub[0] && typeof rule.valuableSub[0] === 'string') {
      // convert to v2 data structure
      const valuableSub: ValuableSubStatsV2[] = rule.valuableSub.map(subStat => ({
        subStat: subStat as string,
        ratingScale: 1,
      }));
      setSubStats(valuableSub);
    } else {
      setSubStats(rule.valuableSub as ValuableSubStatsV2[]);
    }

    setCharacters(rule.fitCharacters);
  }, []);

  const handleClearAll = async () => {
    const result = await createOrUpdateRelicRatingRule(templateId, ruleId, {
      ...rule,
      setNames: [],
      partNames: {},
      valuableSub: [],
      fitCharacters: [],
    });

    if (result.success) {
      setSetNames([]);
      setHeadMainStats([]);
      setGloveMainStats([]);
      setBodyMainStats([]);
      setShoeMainStats([]);
      setSphereMainStats([]);
      setRopeMainStats([]);
      setSubStats([]);
      setCharacters([]);
    } else {
      toast(result.message, { type: 'error' });
    }
  };

  const handleSetNamesChange = async (setNames: string[]) => {
    // if the new setNames is empty, clear all main stats
    if (setNames.length === 0) {
      await handleClearAll();
      return;
    }

    // get the new setName's parts
    const newHead = setNames.map(setName => RelicSetsData[setName].parts['Head']).filter(Boolean);
    const newGlove = setNames.map(setName => RelicSetsData[setName].parts['Hand']).filter(Boolean);
    const newBody = setNames.map(setName => RelicSetsData[setName].parts['Body']).filter(Boolean);
    const newShoe = setNames.map(setName => RelicSetsData[setName].parts['Feet']).filter(Boolean);

    const newSphere = setNames.map(setName => RelicSetsData[setName].parts['Sphere']).filter(Boolean);
    const newRope = setNames.map(setName => RelicSetsData[setName].parts['Rope']).filter(Boolean);

    // generate the new rules
    const newPartNames: {
      [partName: string]: {
        valuableMain: string[];
        partType: string;
      };
    } = {};

    if (newHead.length > 0 && headMainStats.length > 0) {
      for (const partName of newHead) {
        newPartNames[partName] = { valuableMain: headMainStats, partType: 'Head' };
      }
    }
    if (newGlove.length > 0 && gloveMainStats.length > 0) {
      for (const partName of newGlove) {
        newPartNames[partName] = { valuableMain: gloveMainStats, partType: 'Hand' };
      }
    }
    if (newBody.length > 0 && bodyMainStats.length > 0) {
      for (const partName of newBody) {
        newPartNames[partName] = { valuableMain: bodyMainStats, partType: 'Body' };
      }
    }
    if (newShoe.length > 0 && shoeMainStats.length > 0) {
      for (const partName of newShoe) {
        newPartNames[partName] = { valuableMain: shoeMainStats, partType: 'Feet' };
      }
    }
    if (newSphere.length > 0 && sphereMainStats.length > 0) {
      for (const partName of newSphere) {
        newPartNames[partName] = { valuableMain: sphereMainStats, partType: 'Sphere' };
      }
    }
    if (newRope.length > 0 && ropeMainStats.length > 0) {
      for (const partName of newRope) {
        newPartNames[partName] = { valuableMain: ropeMainStats, partType: 'Rope' };
      }
    }

    // if the new setNames don't any inner set, clear the sphere and rope main stats
    if (!setNames.some(setName => RelicSetsData[setName].isInner)) {
      setSphereMainStats([]);
      setRopeMainStats([]);
    }

    // if the new setNames don't any outer set, clear the head, glove, body, shoe main stats
    if (!setNames.some(setName => !RelicSetsData[setName].isInner)) {
      setHeadMainStats([]);
      setGloveMainStats([]);
      setBodyMainStats([]);
      setShoeMainStats([]);
    }

    // update the rule
    const result = await createOrUpdateRelicRatingRule(templateId, ruleId, {
      ...rule,
      setNames,
      partNames: newPartNames,
    });

    if (result.success) {
      setSetNames(setNames);
    } else {
      toast(result.message, { type: 'error' });
    }
  };

  const handleMainStatsChange = async (
    partType: string,
    mainStats: string[],
    callback: Dispatch<SetStateAction<string[]>>
  ) => {
    // get part of the sets
    const partNames = [];

    for (const setName of setNames) {
      if (RelicSetsData[setName].parts[partType]) {
        partNames.push(RelicSetsData[setName].parts[partType]);
      }
    }

    const newPartNames = rule.partNames;

    // generate the new rules
    if (mainStats.length > 0) {
      for (const partName of partNames) {
        if (!newPartNames[partName]) {
          newPartNames[partName] = { valuableMain: mainStats, partType: partType };
        } else {
          newPartNames[partName].valuableMain = mainStats;
        }
      }
    } else {
      for (const partName of partNames) {
        delete newPartNames[partName];
      }
    }

    // update the rule
    const result = await createOrUpdateRelicRatingRule(templateId, ruleId, { ...rule, partNames: newPartNames });

    if (result.success) {
      callback(mainStats);
    } else {
      toast(result.message, { type: 'error' });
    }
  };

  const handleSetHeadMainStatsChange = async (headMainStats: string[]) => {
    await handleMainStatsChange('Head', headMainStats, setHeadMainStats);
  };

  const handleSetGloveMainStatsChange = async (gloveMainStats: string[]) => {
    await handleMainStatsChange('Hand', gloveMainStats, setGloveMainStats);
  };

  const handleSetBodyMainStatsChange = async (bodyMainStats: string[]) => {
    await handleMainStatsChange('Body', bodyMainStats, setBodyMainStats);
  };

  const handleSetShoeMainStatsChange = async (shoeMainStats: string[]) => {
    await handleMainStatsChange('Feet', shoeMainStats, setShoeMainStats);
  };

  const handleSetSphereMainStatsChange = async (sphereMainStats: string[]) => {
    await handleMainStatsChange('Sphere', sphereMainStats, setSphereMainStats);
  };

  const handleSetRopeMainStatsChange = async (ropeMainStats: string[]) => {
    await handleMainStatsChange('Rope', ropeMainStats, setRopeMainStats);
  };

  const handleSetSubStatsChange = async (subStats: ValuableSubStatsV2[]) => {
    const result = await createOrUpdateRelicRatingRule(templateId, ruleId, { ...rule, valuableSub: subStats });

    if (result.success) {
      setSubStats(subStats);
    } else {
      toast(result.message, { type: 'error' });
    }
  };

  const handleSetCharactersChange = async (characters: string[]) => {
    const result = await createOrUpdateRelicRatingRule(templateId, ruleId, { ...rule, fitCharacters: characters });

    if (result.success) {
      setCharacters(characters);
    } else {
      toast(result.message, { type: 'error' });
    }
  };

  const handleDeleteRule = async () => {
    const result = await removeRelicRatingRule(templateId, ruleId);

    if (!result.success) {
      toast(result.message, { type: 'error' });
    }
  };

  return (
    <Card className="relative h-fit pt-5">
      <button
        className="absolute right-2 top-2 rounded-full bg-rose-500 p-0.5 text-white shadow-sm"
        onClick={e => {
          e.stopPropagation();
          handleDeleteRule();
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
                <img src={RelicSetsData[setName].icon} className="h-6 w-6" alt="relic icon" />
                {RelicSetsData[setName].name}
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
                setNames.some(setName => !RelicSetsData[setName].isInner) && (
                  <div>
                    <RelicMainStatsSelector
                      partName="头"
                      selectedKeys={headMainStats}
                      onSelectionChange={handleSetHeadMainStatsChange}
                      mainStats={Object.values(RelicHeadMainStatsType)}
                    />
                    {headMainStats.length > 0 && <StatsBadgeList stats={headMainStats} />}
                    <RelicMainStatsSelector
                      partName="手"
                      selectedKeys={gloveMainStats}
                      onSelectionChange={handleSetGloveMainStatsChange}
                      mainStats={Object.values(RelicGloveMainStatsType)}
                    />
                    {gloveMainStats.length > 0 && <StatsBadgeList stats={gloveMainStats} />}
                    <RelicMainStatsSelector
                      partName="衣"
                      selectedKeys={bodyMainStats}
                      onSelectionChange={handleSetBodyMainStatsChange}
                      mainStats={Object.values(RelicBodyMainStatsType)}
                    />
                    {bodyMainStats.length > 0 && <StatsBadgeList stats={bodyMainStats} />}
                    <RelicMainStatsSelector
                      partName="鞋"
                      selectedKeys={shoeMainStats}
                      onSelectionChange={handleSetShoeMainStatsChange}
                      mainStats={Object.values(RelicShoeMainStatsType)}
                    />
                    {shoeMainStats.length > 0 && <StatsBadgeList stats={shoeMainStats} />}
                  </div>
                )
              }
              {
                // any setName is inner, show the sphere, rope
                setNames.some(setName => RelicSetsData[setName].isInner) && (
                  <div>
                    <RelicMainStatsSelector
                      partName="球"
                      selectedKeys={sphereMainStats}
                      onSelectionChange={handleSetSphereMainStatsChange}
                      mainStats={Object.values(RelicSphereMainStatsType)}
                    />
                    {sphereMainStats.length > 0 && <StatsBadgeList stats={sphereMainStats} />}
                    <RelicMainStatsSelector
                      partName="绳"
                      selectedKeys={ropeMainStats}
                      onSelectionChange={handleSetRopeMainStatsChange}
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
                onSelectionChange={handleSetSubStatsChange}
                subStats={Object.values(RelicSubStatsType)}
              />
            </div>
            <StatsBadgeList
              stats={subStats}
              handleSubScaleChange={(oldSubStats: ValuableSubStatsV2, newScale: number) => {
                const newSubStats = subStats.map(subStat => {
                  if (subStat.subStat === oldSubStats.subStat) {
                    return {
                      subStat: subStat.subStat,
                      ratingScale: newScale,
                    };
                  }
                  return subStat;
                });
                handleSetSubStatsChange(newSubStats);
              }}
            />
            <Separator className="my-2" />
            <div className="flex flex-row gap-2">
              <div className="font-semibold">适用角色:</div>
              <CharacterSelector selectedKeys={characters} onSelectionChange={handleSetCharactersChange} />
            </div>
            <div className="mt-2">
              {characters &&
                characters.map((character, index) => (
                  <Badge key={index} className="mr-2 inline-flex flex-row items-center gap-1">
                    <img src={CharactersData[character].icon} className="h-6 w-6" alt="relic icon" />
                    {CharactersData[character].name}
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
