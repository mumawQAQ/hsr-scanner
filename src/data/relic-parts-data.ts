import FuzzySet from 'fuzzyset.js';

import { RelicSetsData } from '@/data/relic-sets-data.ts';

const generatePartNameToSetNameMapping = (): { [key: string]: string } => {
  const partNameToSetNameMapping: { [key: string]: string } = {};

  Object.keys(RelicSetsData).forEach(setName => {
    const set = RelicSetsData[setName];
    Object.keys(set.parts).forEach(part => {
      const partName = set.parts[part];
      partNameToSetNameMapping[partName] = setName;
    });
  });

  return partNameToSetNameMapping;
};

const generatePartNames = (): string[] => {
  const partNames: string[] = [];

  Object.keys(RelicSetsData).forEach(setName => {
    const set = RelicSetsData[setName];
    Object.keys(set.parts).forEach(part => {
      partNames.push(set.parts[part]);
    });
  });

  return partNames;
};

export const PartNameToSetNameMapping = generatePartNameToSetNameMapping();
export const PartNames = generatePartNames();
export const FuzzyPartNames = FuzzySet(PartNames);
