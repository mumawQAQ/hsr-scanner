import { RelicSubStatsScore } from '@/data/relic-stat-data.ts';


function getValueMap(type: string, relicMap: typeof RelicSubStatsScore) {
  return relicMap[type] || null;
}

function fuzzyMatchNumberSet(type: string, relicMap: typeof RelicSubStatsScore) {
  const valueMap = getValueMap(type, relicMap);
  if (!valueMap) {
    console.log("No such type found.");
    return;
  }

  // Prepare the data for fuzzy matching


  // Convert all numbers to string for FuzzySet
  //
  // // Find the closest match
  // const result = fuzzySet.get(number);
  // if (result) {
  //   console.log(`Closest match for ${number} is ${result[0][1]} with a score of ${result[0][0]}`);
  // } else {
  //   console.log("No close match found.");
  // }
  return valueMap;
}

export default fuzzyMatchNumberSet;