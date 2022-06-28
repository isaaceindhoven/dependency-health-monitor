import { CRITERIA_WEIGHTS } from './../constants.js';
import { formatCurrency } from '../helpers/number-formatter.js';
import type { ScoreCalculationResult } from './../types/score/score-calculation-result';

export const calculateFinancialRoadmapScore = (
  packageName: string,
  fundingGoalCents: number,
  currency: string,
  userLocale: string,
): ScoreCalculationResult => {
  if (!fundingGoalCents) {
    return {
      score: 0,
      weightedScore: 0,
      explanation: `${packageName} has not set any funding goals. Therefore, they receive a score of 0.`,
    };
  }
  const formattedCurrency = formatCurrency(fundingGoalCents / 100, currency, userLocale);

  return {
    score: 100,
    weightedScore: 100 * CRITERIA_WEIGHTS.FINANCIAL_ROADMAP,
    explanation: `${packageName} has set a Funding goal of ${formattedCurrency}. Therefore, they receive a score of 100.`,
  };
};
