import { ScoreCalculationResult } from './../../dist/types/score-calculation-result.d';

export const cannotCalculateWithMissingData = (
  packageName: string,
  scoreType: string,
  missingKeys: string[],
): ScoreCalculationResult => {
  return {
    score: 0,
    explanation: `Can not calculate ${scoreType} score for package ${packageName}. Could not fetch the data for: 
    ${missingKeys.map((key) => `  - ${key}\n`)}`,
  };
};
