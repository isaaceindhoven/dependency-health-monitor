import { AVERAGE_SALARY_CENTS } from './../constants.js';
import { cannotCalculateWithMissingData } from './../helpers/missing-data-for-calculation.js';
import type { ScoreCalculationResult } from './../types/score/score-calculation-result';

const weight = 1;

const calculateScoreWithFundingGoal = (
  yearlyRevenueCents: number,
  fundingGoalCents: number,
): ScoreCalculationResult => {
  const score = Math.min(100, (yearlyRevenueCents / fundingGoalCents) * 100);

  return {
    score,
    weightedScore: score * weight,
    explanation: `
            Calculated score with the following data:
                - Yearly revenue (in cents): ${yearlyRevenueCents}
                - Funding goal (in cents): ${fundingGoalCents}
            
            Yearly revenue / funding goal * 100, with a max of 100 = ${yearlyRevenueCents} / ${fundingGoalCents} * 100 = ${score}
          `,
  };
};

const calculateScoreWithTotalTeamCost = (yearlyRevenue: number, teamSize: number): ScoreCalculationResult => {
  const averageSalaryCents = AVERAGE_SALARY_CENTS; // 50k
  const teamCostCents = averageSalaryCents * teamSize;

  const score = Math.min(100, (yearlyRevenue / teamCostCents) * 100);

  return {
    score,
    weightedScore: score * weight,
    explanation: `
            Calculated score with the following data:
                - Yearly revenue (in cents): ${yearlyRevenue}
                - Team cost (in cents): Average salary (in cents, ${averageSalaryCents}) * Team size (${teamSize})
            
            Yearly revenue / Team cost * 100, with a max of 100 = ${yearlyRevenue} / ${teamCostCents} * 100 = ${score}
        `,
  };
};

export const calculateSustainabilityScore = (
  packageName: string,
  yearlyRevenueCents: number,
  fundingGoalCents: number,
  teamSize: number,
): ScoreCalculationResult => {
  if (!yearlyRevenueCents) {
    return cannotCalculateWithMissingData(packageName, 'sustainability', ['Yearly revenue']);
  }

  if (!fundingGoalCents && !teamSize) {
    return cannotCalculateWithMissingData(packageName, 'sustainability', ['Funding goal', 'Team size']);
  }

  if (fundingGoalCents) {
    return calculateScoreWithFundingGoal(yearlyRevenueCents, fundingGoalCents);
  } else {
    return calculateScoreWithTotalTeamCost(yearlyRevenueCents, teamSize);
  }
};
