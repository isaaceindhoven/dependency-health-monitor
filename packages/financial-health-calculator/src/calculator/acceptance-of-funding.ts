import type { ScoreCalculationResult } from './../types/score/score-calculation-result';

export const calculateAcceptanceOfFundingScore = (
  packageName: string,
  npmFundingUrl: string,
  githubFundingUrl: string,
): ScoreCalculationResult => {
  const weight = 0.6;

  if (!npmFundingUrl && !githubFundingUrl) {
    return {
      score: 0,
      weightedScore: 0,
      explanation: `${packageName} does not accept funding on both GitHub or NPM. Therefore, it receives a score of 0.`,
    };
  }

  return {
    score: 100,
    weightedScore: 100 * weight,
    explanation: `
            As ${packageName} accepts funding, they receive a score of 100. ${packageName} promotes their funding on:
            ${npmFundingUrl ? ` - NPM: ${npmFundingUrl} \n` : ''}
            ${githubFundingUrl ? `  - GitHub: ${githubFundingUrl} \n` : ''}
        `,
  };
};
