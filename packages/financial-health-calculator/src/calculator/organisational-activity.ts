import { CRITERIA_WEIGHTS } from './../constants.js';
import type { ScoreCalculationResult } from './../types/score/score-calculation-result';

export const calculateOrganisationalActivityScore = (
  packageName: string,
  organisationName: string,
  totalContributions: number,
  contributionsFromSameOrganisation: number,
): ScoreCalculationResult => {
  const score = (contributionsFromSameOrganisation / totalContributions) * 100 || 0;

  return {
    score,
    weightedScore: score * CRITERIA_WEIGHTS.ORGANISATIONAL_ACTIVITY,
    explanation: `
        Calculated score with the following data:
            - Total contributions from top 100 contributors: ${totalContributions}
            - Total contributions from top 100 contributors that are from the organisation ${organisationName}: ${contributionsFromSameOrganisation}.
        ${packageName}'s Organisational activity score = Contributions from same organisation / total contributions from top 100 * 100 = ${contributionsFromSameOrganisation} / ${totalContributions} * 100 = ${score}.
      `,
  };
};
