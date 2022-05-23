import { cannotCalculateWithMissingData } from './../helpers/missing-data-for-calculation';
import type { ScoreCalculationResult } from './../types/score-calculation-result';

export const calculateAcceptanceOfFundingScore = (
  packageName: string,
  npmFundingUrl: string,
  githubFundingUrl: string,
): ScoreCalculationResult => {
  if (!npmFundingUrl && !githubFundingUrl) {
    return cannotCalculateWithMissingData(packageName, 'Acceptance of funding', [
      'NPM Funding URL',
      'GitHub Funding URL',
    ]);
  }

  return {
    score: 100,
    explanation: `
            As ${packageName} accepts funding, they receive a score of 100. ${packageName} promotes their funding on:
            ${npmFundingUrl ? ` - NPM: ${npmFundingUrl} \n` : ''}
            ${githubFundingUrl ? `  - GitHub: ${githubFundingUrl} \n` : ''}
        `,
  };
};
