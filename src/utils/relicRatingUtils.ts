import { PartNameToSetNameMapping } from '@/data/relic-parts-data.ts';
import useRelicTemplateStore from '@/hooks/use-relic-template-store.ts';
import {
  CharacterBasePartRating,
  RatingRule,
  RelicMainStats,
  RelicSubStats,
  ValuableSubStatsV2,
} from '@/type/types.ts';

const getRelicRatingRules = (relicTitle: string, relicMainStat: string) => {
  // get the current rating template
  const relicRulesTemplates = useRelicTemplateStore.getState().currentRelicRatingRulesTemplate;

  if (!relicRulesTemplates) {
    return {
      success: false,
      message: '暂未指定遗器规则模板，请先导入模板并使用模板',
      rules: [],
    };
  }

  // get the set name base on the relic title
  const setName = PartNameToSetNameMapping[relicTitle];

  const validRules: RatingRule[] = [];

  // base on the template, get all the rules that match the relic title and relic main stat
  Object.values(relicRulesTemplates.rules).forEach(rule => {
    // first need to make sure the rule is valid for the current relic set
    if (rule.setNames.includes(setName)) {
      // check if the relic main stat and relic part name match the rule
      if (rule.partNames[relicTitle]?.valuableMain.includes(relicMainStat)) {
        validRules.push(rule);
      }
    }
  });

  return {
    success: true,
    message: '成功获取遗器评分规则',
    rules: validRules,
  };
};

/**
 *  get the top4 valuable sub score, if the valuable sub stat is longer than 4, then only take the top 4
 *  if the valuable sub stat is less or equal to 4, then take all
 * @param valuableSub the valuable sub stat array | could be the old model or the new model
 */
const getTop4ValuableSubScore = (valuableSub: (string | ValuableSubStatsV2)[]) => {
  let top4ValuableSub: number[];

  if (valuableSub.length > 0 && typeof valuableSub[0] === 'string') {
    // if the valuable sub stat is the old model, then we can fill with 1s
    top4ValuableSub = new Array(Math.min(valuableSub.length, 4)).fill(1);
  } else {
    // if the valuable sub stat is the new model, then we can fill with the rating scale
    top4ValuableSub = valuableSub
      .map(subStat => {
        return (subStat as ValuableSubStatsV2).ratingScale;
      })
      .sort((a, b) => b - a)
      .slice(0, 4);
  }

  return top4ValuableSub;
};

/**
 * if assume the valuable sub stats which max scale is enhanced five times,
 * then the totalPossibleScore is max of top 4 valuable sub score * 5 + sum of the top 4 valuable sub score
 * @param mainRelicStat the relic main stat
 * @param top4ValuableSub the top 4 valuable sub score
 */
const getTotalPossibleScore = (mainRelicStat: RelicMainStats, top4ValuableSub: number[]) => {
  if (top4ValuableSub.length > 0) {
    return (
      top4ValuableSub.reduce((acc, cur) => acc + cur, 0) + Math.max(...top4ValuableSub) * mainRelicStat.enhanceLevel
    );
  }

  return 0;
};

/**
 * get the character base part rating
 * @param character the character name array
 * @param totalPossibleScore the total possible score
 * @param subRelicStats the relic sub stats
 * @param valuableSub the valuable sub stat array
 */
const getCharacterBasePartRating = (
  character: string[],
  totalPossibleScore: number,
  subRelicStats: RelicSubStats[],
  valuableSub: (string | ValuableSubStatsV2)[]
) => {
  const newRating: CharacterBasePartRating = {
    character,
    valuableSub: {},
    minTotalScore: 0,
    maxTotalScore: 0,
    totalScore: totalPossibleScore,
  };

  subRelicStats.forEach(subStat => {
    newRating.valuableSub[subStat.name] = {
      valuable: false,
    };

    valuableSub.forEach(valuableSubStat => {
      // backward compatible with the old model
      if (typeof valuableSubStat === 'string') {
        if (subStat.name === valuableSubStat) {
          newRating.valuableSub[subStat.name] = {
            valuable: true,
          };

          newRating.minTotalScore += subStat.score instanceof Array ? Math.min(...subStat.score) : subStat.score;
          newRating.maxTotalScore += subStat.score instanceof Array ? Math.max(...subStat.score) : subStat.score;
        }
      } else if (subStat.name === valuableSubStat.subStat) {
        newRating.valuableSub[subStat.name] = {
          valuable: true,
        };

        newRating.minTotalScore +=
          subStat.score instanceof Array
            ? Math.min(...subStat.score) * valuableSubStat.ratingScale
            : subStat.score * valuableSubStat.ratingScale;
        newRating.maxTotalScore +=
          subStat.score instanceof Array
            ? Math.max(...subStat.score) * valuableSubStat.ratingScale
            : subStat.score * valuableSubStat.ratingScale;
      }
    });
  });

  return newRating;
};

export default {
  getRelicRatingRules,
  getTop4ValuableSubScore,
  getTotalPossibleScore,
  getCharacterBasePartRating,
};
