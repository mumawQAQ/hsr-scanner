'use client';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { useDeleteRelicRule, useRelicRule, useUpdateRelicRule } from '@/app/apis/relic-template';
import CharacterSelection from '@/app/components/character-selection';
import RelicSetSelector from '@/app/components/relic-set-selection';
import { useEffect, useState } from 'react';
import { RelicRuleLocal, RelicRuleSubStats } from '@/app/types/relic-rule-type';
import RelicMainStatSelection from '@/app/components/relic-main-stat-selection';
import { RelicMainStatsType } from '@/app/types/relic-stat-types';
import RelicSubStatSelection from '@/app/components/relic-sub-stat-selection';

type RelicRuleCardProps = {
  templateId: string;
  ruleId: string;
};

export default function RelicRuleCard({ ruleId, templateId }: RelicRuleCardProps) {
  const { data: relicRule, error, isLoading, refetch: refetchRelicRule } = useRelicRule(ruleId);
  const { mutate: deleteRule } = useDeleteRelicRule();
  const { mutate: updateRule } = useUpdateRelicRule();

  const [curRule, setCurRule] = useState<RelicRuleLocal | null>(null);

  useEffect(() => {
    if (relicRule) {
      setCurRule({
        id: relicRule.id,
        set_names: relicRule.set_names,
        valuable_mains: relicRule.valuable_mains,
        valuable_subs: relicRule.valuable_subs,
        fit_characters: relicRule.fit_characters,
        is_saved: true,
      });
    }
  }, [relicRule]);

  const handleDelete = async () => {
    deleteRule({ template_id: templateId, rule_id: ruleId });
  };

  if (error || !relicRule) {
    return (
      <Card className="min-h-[15rem] w-full">
        <CardBody className="flex items-center justify-center text-center">
          Error: {error ? error.message : '无法加载'}
        </CardBody>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="min-h-[15rem] w-full">
        <CardBody className="flex items-center justify-center text-center">Loading...</CardBody>
      </Card>
    );
  }

  const handleSave = () => {
    if (!curRule) {
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
          await refetchRelicRule();
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
      }
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
    if (!relicSet) {
      return;
    }

    if (type == 'add' && curRule?.set_names.includes(relicSet)) {
      return;
    }

    setCurRule(prev => {
      if (!prev) {
        return null;
      }
      return {
        ...prev,
        set_names: type === 'add' ? [...prev.set_names, relicSet] : prev.set_names.filter(set => set !== relicSet),
        is_saved: false,
      };
    });
  };

  const handleSelectedMainStatChange = (
    mainStat: string | null,
    mainStatType: RelicMainStatsType,
    type: 'add' | 'remove'
  ) => {
    if (!mainStat || !curRule) {
      return;
    }

    const newRule = {
      ...curRule,
    };

    if (!Object.keys(newRule.valuable_mains).includes(mainStatType)) {
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
      const index = newRule.valuable_subs.findIndex(stat => stat.sub_stat === subStat.sub_stat);
      if (index !== -1) {
        return;
      }
      newRule.valuable_subs.push(subStat);
    } else if (type === 'remove') {
      newRule.valuable_subs = newRule.valuable_subs.filter(stat => stat !== subStat);
    } else {
      const index = newRule.valuable_subs.findIndex(stat => stat.sub_stat === subStat.sub_stat);
      if (index === -1) {
        return;
      }

      newRule.valuable_subs[index] = subStat;
    }

    newRule.is_saved = false;

    setCurRule(newRule);
  };

  return (
    <Card className="min-h-[15rem] w-full">
      <CardBody className="flex items-center justify-center text-center">
        <CharacterSelection
          selectedCharacter={curRule?.fit_characters[0]}
          onSelectionChange={handleSelectedCharacterChange}
        />
        <RelicSetSelector selectedRelicSets={curRule?.set_names} onSelectionChange={handleSelectedRelicSetChange} />
        <RelicMainStatSelection
          type="head"
          selectedMainStat={curRule?.valuable_mains?.head}
          onSelectionChange={(mainStat, type) => handleSelectedMainStatChange(mainStat, 'head', type)}
        />
        <RelicMainStatSelection
          type="hand"
          selectedMainStat={curRule?.valuable_mains?.hand}
          onSelectionChange={(mainStat, type) => handleSelectedMainStatChange(mainStat, 'hand', type)}
        />
        <RelicMainStatSelection
          type="body"
          selectedMainStat={curRule?.valuable_mains?.body}
          onSelectionChange={(mainStat, type) => handleSelectedMainStatChange(mainStat, 'body', type)}
        />
        <RelicMainStatSelection
          type="feet"
          selectedMainStat={curRule?.valuable_mains?.feet}
          onSelectionChange={(mainStat, type) => handleSelectedMainStatChange(mainStat, 'feet', type)}
        />
        <RelicMainStatSelection
          type="rope"
          selectedMainStat={curRule?.valuable_mains['rope']}
          onSelectionChange={(mainStat, type) => handleSelectedMainStatChange(mainStat, 'rope', type)}
        />
        <RelicMainStatSelection
          type="sphere"
          selectedMainStat={curRule?.valuable_mains['sphere']}
          onSelectionChange={(mainStat, type) => handleSelectedMainStatChange(mainStat, 'sphere', type)}
        />
        <RelicSubStatSelection
          selectedSubStats={curRule?.valuable_subs}
          onSelectionChange={handleSelectedSubStatChange}
        />
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
