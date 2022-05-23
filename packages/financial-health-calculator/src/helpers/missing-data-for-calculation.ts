import { ScoreCalculationResult } from './../types/score-calculation-result';

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
