// Data refer: https://nga.178.com/read.php?tid=37079487&rand=687
import { RelicType } from '@/type/types.ts';

export const RelicSubStatsAcquireScale: {
  [key: string]: number;
} = {
  [RelicType.HP]: 125,
  [RelicType.ATK]: 125,
  [RelicType.DEF]: 125,
  [RelicType.HPPercentage]: 125,
  [RelicType.ATKPercentage]: 125,
  [RelicType.DEFPercentage]: 125,
  [RelicType.EffectHitRate]: 100,
  [RelicType.EffectRes]: 100,
  [RelicType.BreakEffect]: 100,
  [RelicType.CRITRate]: 75,
  [RelicType.CRITDMG]: 75,
  [RelicType.SPD]: 50,
};

export const RelicSubStatsTotalAcquireScale: number = Object.values(RelicSubStatsAcquireScale).reduce(
  (acc, cur) => acc + cur,
  0
);
