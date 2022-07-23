import { formatCurrency } from './../helpers/number-formatter.js';
import { AVERAGE_SALARY_CENTS, CRITERIA_WEIGHTS } from './../constants.js';
import { cannotCalculateWithMissingData } from './../helpers/missing-data-for-calculation.js';
import type { ScoreCalculationResult } from './../types/score/score-calculation-result';

const calculateScoreWithFundingGoal = (
  yearlyRevenueCents: number,
  fundingGoalCents: number,
  currency: string,
  userLocale: string,
): ScoreCalculationResult => {
  const score = Math.min(100, (yearlyRevenueCents / fundingGoalCents) * 100);
  const formattedYearlyRevenue = formatCurrency(yearlyRevenueCents / 100, currency, userLocale);
  const formattedFundingGoal = formatCurrency(fundingGoalCents / 100, currency, userLocale);

  return {
    score,
    weightedScore: score * CRITERIA_WEIGHTS.SUSTAINABILITY,
    explanation: `Calculated score with the following data:
                - Yearly revenue: ${formattedYearlyRevenue}
                - Funding goal: ${formattedFundingGoal}
            
            Yearly revenue / funding goal * 100, with a max of 100 = ${formattedYearlyRevenue} / ${formattedFundingGoal} * 100 = ${score}`,
  };
};

const calculateScoreWithTotalTeamCost = (
  yearlyRevenueCents: number,
  teamSize: number,
  currency: string,
  userLocale: string,
): ScoreCalculationResult => {
  const averageSalaryCents = AVERAGE_SALARY_CENTS; // 50k
  const teamCostCents = averageSalaryCents * teamSize;

  const score = Math.min(100, (yearlyRevenueCents / teamCostCents) * 100);

  const formattedYearlyRevenue = formatCurrency(yearlyRevenueCents / 100, currency, userLocale);
  const formattedAverageSalary = formatCurrency(averageSalaryCents / 100, currency, userLocale);
  const formattedTeamCost = formatCurrency(teamCostCents / 100, currency, userLocale);

  return {
    score,
    weightedScore: score * CRITERIA_WEIGHTS.SUSTAINABILITY,
    explanation: `Calculated score with the following data:
                - Yearly revenue: ${formattedYearlyRevenue}
                - Team cost: Average salary (${formattedAverageSalary}) * Team size (${teamSize})
            
            Yearly revenue / Team cost * 100, with a max of 100 = ${formattedYearlyRevenue} / ${formattedTeamCost} * 100 = ${score}`,
  };
};

export const calculateSustainabilityScore = (
  packageName: string,
  yearlyRevenueCents: number,
  fundingGoalCents: number,
  teamSize: number,
  currency: string,
  userLocale: string,
): ScoreCalculationResult => {
  if (!yearlyRevenueCents) {
    return cannotCalculateWithMissingData(packageName, 'sustainability', ['Yearly revenue']);
  }

  if (!fundingGoalCents && !teamSize) {
    return cannotCalculateWithMissingData(packageName, 'sustainability', ['Funding goal', 'Team size']);
  }

  if (fundingGoalCents) {
    return calculateScoreWithFundingGoal(yearlyRevenueCents, fundingGoalCents, currency, userLocale);
  } else {
    return calculateScoreWithTotalTeamCost(yearlyRevenueCents, teamSize, currency, userLocale);
  }
};
