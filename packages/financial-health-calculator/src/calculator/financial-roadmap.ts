import { ScoreCalculationResult } from './../types/score/score-calculation-result';

export const calculateFinancialRoadmapScore = (
  packageName: string,
  fundingGoalCents: number,
  currency: string,
): ScoreCalculationResult => {
  if (!fundingGoalCents) {
    return {
      score: 0,
      explanation: `${packageName} has not set any funding goals. Therefore, they receive a score of 0.`,
    };
  }

  return {
    score: 100,
    explanation: `${packageName} has set a Funding goal of ${currency} ${
      fundingGoalCents / 100
    }. Therefore, they receive a score of 100.`,
  };
};
