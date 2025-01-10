'use client';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { useDeleteRelicRule, useRelicRule, useRelicTemplateList, useUpdateRelicRule } from '@/app/apis/relic-template';
import CharacterSelection from '@/app/components/character-selection';
import RelicSetSelector from '@/app/components/relic-set-selection';
import { useEffect, useState } from 'react';
import { RelicRuleLocal, RelicRuleSubStats } from '@/app/types/relic-rule-type';
import RelicMainStatSelection from '@/app/components/relic-main-stat-selection';
import { RelicMainStatsType } from '@/app/types/relic-stat-types';
import RelicSubStatSelection from '@/app/components/relic-sub-stat-selection';
import toast from 'react-hot-toast';
import { useJsonFile } from '@/app/apis/files';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

type RelicRuleCardProps = {
  templateId: string;
  ruleId: string;
};

export default function RelicRuleCard({ ruleId, templateId }: RelicRuleCardProps) {
  const relicRule = useRelicRule(ruleId);
  const relicSets = useJsonFile('relic/relic_sets.json');
  const { data: templateList } = useRelicTemplateList();
  const { mutate: deleteRule } = useDeleteRelicRule();
  const { mutate: updateRule } = useUpdateRelicRule();

  const [curRule, setCurRule] = useState<RelicRuleLocal | null>(null);
  const [showOuter, setShowOuter] = useState(false);
  const [showInner, setShowInner] = useState(false);
  const [hiddenDetails, setHiddenDetails] = useState(true);

  const handleShowInner = (setNames: string[]) => {
    if (setNames.length === 0) {
      setShowInner(false);
      return false;
    }

    // check any of the set names have inner set
    const haveInner = setNames.some(setName => {
      const innerSet = relicSets.data[setName].isInner;
      if (innerSet) {
        return true;
      }
    });

    setShowInner(haveInner);
    return haveInner;
  };

  const handleShowOuter = (setNames: string[]) => {
    if (setNames.length === 0) {
      setShowOuter(false);
      return false;
    }

    // check any of the set names have outer set
    const haveOuter = setNames.some(setName => {
      const innerSet = relicSets.data[setName].isInner;
      if (!innerSet) {
        setShowOuter(true);
        return true;
      }
    });

    setShowOuter(haveOuter);
    return haveOuter;
  };

  useEffect(() => {
    if (relicRule.data) {
      setCurRule({
        id: relicRule.data.id,
        set_names: relicRule.data.set_names,
        valuable_mains: relicRule.data.valuable_mains,
        valuable_subs: relicRule.data.valuable_subs,
        fit_characters: relicRule.data.fit_characters,
        is_saved: true,
      });

      handleShowInner(relicRule.data.set_names);
      handleShowOuter(relicRule.data.set_names);
    }
  }, [relicRule.data]);

  if (relicRule.error || !relicRule.data || relicSets.error || !relicSets.data) {
    return (
      <Card className="min-h-[15rem] w-[22rem]">
        <CardBody className="flex items-center justify-center text-center">
          Error: {relicRule.error?.message || relicSets.error?.message || '无法加载遗物规则数据！'}
        </CardBody>
      </Card>
    );
  }

  if (relicRule.isLoading || relicSets.isLoading) {
    return (
      <Card className="min-h-[15rem] w-[22rem]">
        <CardBody className="flex items-center justify-center text-center">Loading...</CardBody>
      </Card>
    );
  }

  const handleDelete = async () => {
    // prevent deleting if the current template is in use
    if (templateList?.find(template => template.id === templateId)?.in_use) {
      toast.error('请先停用当前模板以删除规则！');
      return;
    }

    deleteRule({ template_id: templateId, rule_id: ruleId });
  };

  const handleSave = () => {
    if (!curRule) {
      return;
    }

    // prevent saving if the current template is in use
    if (templateList?.find(template => template.id === templateId)?.in_use) {
      toast.error('请先停用当前模板以保存规则！');
      return;
    }

    updateRule(
      {
        id: curRule.id,
        template_id: templateId,
        set_names: curRule.set_names,
        valuable_mains: curRule.valuable_mains,
        valuable_subs: curRule.valuable_subs,
        fit_characters: curRule.fit_characters,
      },
      {
        onSuccess: async () => {
          //refresh the relic rule
          await relicRule.refetch();
          setCurRule(prev => {
            if (!prev) {
              return null;
            }
            return {
              ...prev,
              is_saved: true,
            };
          });
        },
      },
    );
  };

  const handleSelectedCharacterChange = (character: string | null) => {
    setCurRule(prev => {
      if (!prev) {
        return null;
      }
      return {
        ...prev,
        fit_characters: character ? [character] : [],
        is_saved: false,
      };
    });
  };

  const handleSelectedRelicSetChange = (relicSet: string | null, type: 'add' | 'remove') => {
    if (!relicSet || !curRule) {
      return;
    }

    if (type == 'add' && curRule?.set_names.includes(relicSet)) {
      return;
    }

    const newSetNames =
      type === 'add' ? [...curRule.set_names, relicSet] : curRule.set_names.filter(set => set !== relicSet);

    console.log(newSetNames);

    const haveInner = handleShowInner(newSetNames);
    const haveOuter = handleShowOuter(newSetNames);

    // if current set list no longer have inner, clear the head, hand, body, feet stats
    // if current set list no longer have outer, clear the sphere, rope stats
    setCurRule(prev => {
      if (!prev) {
        return null;
      }
      return {
        ...prev,
        set_names: newSetNames,
        valuable_mains: {
          head: haveOuter ? prev.valuable_mains.head : [],
          hand: haveOuter ? prev.valuable_mains.hand : [],
          body: haveOuter ? prev.valuable_mains.body : [],
          feet: haveOuter ? prev.valuable_mains.feet : [],
          sphere: haveInner ? prev.valuable_mains.sphere : [],
          rope: haveInner ? prev.valuable_mains.rope : [],
        },
        is_saved: false,
      };
    });
  };

  const handleSelectedMainStatChange = (
    mainStat: string | null,
    mainStatType: RelicMainStatsType,
    type: 'add' | 'remove',
  ) => {
    if (!mainStat || !curRule) {
      return;
    }

    const newRule = {
      ...curRule,
    };

    console.log(newRule);

    // if the main stat type is undefined, create a new array
    if (!newRule.valuable_mains[mainStatType]) {
      newRule.valuable_mains[mainStatType] = [];
    }

    if (type === 'add') {
      if (newRule.valuable_mains[mainStatType].includes(mainStat)) {
        return;
      }
      newRule.valuable_mains[mainStatType].push(mainStat);
    } else {
      newRule.valuable_mains[mainStatType] = newRule.valuable_mains[mainStatType].filter(stat => stat !== mainStat);
    }

    newRule.is_saved = false;

    setCurRule(newRule);
  };

  const handleSelectedSubStatChange = (subStat: RelicRuleSubStats | null, type: 'add' | 'remove' | 'update') => {
    if (!subStat || !curRule) {
      return;
    }

    const newRule = {
      ...curRule,
    };

    if (type === 'add') {
      const index = newRule.valuable_subs.findIndex(stat => stat.name === subStat.name);
      if (index !== -1) {
        return;
      }
      newRule.valuable_subs.push(subStat);
    } else if (type === 'remove') {
      newRule.valuable_subs = newRule.valuable_subs.filter(stat => stat !== subStat);
    } else {
      const index = newRule.valuable_subs.findIndex(stat => stat.name === subStat.name);
      if (index === -1) {
        return;
      }

      newRule.valuable_subs[index] = subStat;
    }

    newRule.is_saved = false;

    setCurRule(newRule);
  };

  return (
    <Card className="col-span-1 min-h-[15rem] p-5 w-[22rem]">
      <CardBody className="flex gap-8">
        <CharacterSelection
          selectedCharacter={curRule?.fit_characters[0]}
          onSelectionChange={handleSelectedCharacterChange}
        />
        <RelicSetSelector selectedRelicSets={curRule?.set_names} onSelectionChange={handleSelectedRelicSetChange} />

        {
          !hiddenDetails ? (
            <>
              {showOuter && (
                <RelicMainStatSelection
                  type="head"
                  selectedMainStat={curRule?.valuable_mains?.head}
                  onSelectionChange={(mainStat, type) => handleSelectedMainStatChange(mainStat, 'head', type)}
                />
              )}

              {showOuter && (
                <RelicMainStatSelection
                  type="hand"
                  selectedMainStat={curRule?.valuable_mains?.hand}
                  onSelectionChange={(mainStat, type) => handleSelectedMainStatChange(mainStat, 'hand', type)}
                />
              )}

              {showOuter && (
                <RelicMainStatSelection
                  type="body"
                  selectedMainStat={curRule?.valuable_mains?.body}
                  onSelectionChange={(mainStat, type) => handleSelectedMainStatChange(mainStat, 'body', type)}
                />
              )}

              {showOuter && (
                <RelicMainStatSelection
                  type="feet"
                  selectedMainStat={curRule?.valuable_mains?.feet}
                  onSelectionChange={(mainStat, type) => handleSelectedMainStatChange(mainStat, 'feet', type)}
                />
              )}

              {showInner && (
                <RelicMainStatSelection
                  type="rope"
                  selectedMainStat={curRule?.valuable_mains['rope']}
                  onSelectionChange={(mainStat, type) => handleSelectedMainStatChange(mainStat, 'rope', type)}
                />
              )}

              {showInner && (
                <RelicMainStatSelection
                  type="sphere"
                  selectedMainStat={curRule?.valuable_mains['sphere']}
                  onSelectionChange={(mainStat, type) => handleSelectedMainStatChange(mainStat, 'sphere', type)}
                />
              )}

              <RelicSubStatSelection
                selectedSubStats={curRule?.valuable_subs}
                onSelectionChange={handleSelectedSubStatChange}
              />
              <div className="justify-center flex">
                <Button variant="bordered" onPress={() => setHiddenDetails(true)}>
                  <ChevronUpIcon />
                  隐藏详情
                </Button>
              </div>

            </>
          ) : (
            <div className="justify-center flex">
              <Button variant="bordered" onPress={() => setHiddenDetails(false)}>
                <ChevronDownIcon />
                显示详情
              </Button>
            </div>
          )
        }

      </CardBody>
      <CardFooter className="flex justify-end gap-2">
        <Button size="sm" variant="bordered" color={!curRule?.is_saved ? 'danger' : 'default'} onPress={handleSave}>
          {!curRule?.is_saved ? '未保存' : '已保存'}
        </Button>
        <Button size="sm" variant="bordered" color="danger" onPress={handleDelete}>
          删除
        </Button>
      </CardFooter>
    </Card>
  );
}
