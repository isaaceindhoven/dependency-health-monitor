import { CRITERIA_WEIGHTS } from '../../src/constants';
import { calculateAcceptanceOfFundingScore } from '../../src/calculator/acceptance-of-funding';
import { describe, it, expect } from 'vitest';

describe('acceptance of funding score calculation', () => {
  it('gives a score of 100 whenever the project accepts funding on only their NPM page', async () => {
    expect(() => {
      const npmFundingUrl = 'Funding URL NPM';
      const githubFundingUrl = '';
      const scoreCalculationResult = calculateAcceptanceOfFundingScore('eslint', npmFundingUrl, githubFundingUrl);

      expect(scoreCalculationResult.score).toBe(100);
      expect(scoreCalculationResult.weightedScore).toBe(100 * CRITERIA_WEIGHTS.ACCEPTANCE_OF_FUNDING);
    }).not.toThrow();
  });

  it('gives a score of 100 whenever the project accepts funding on only their GitHub page', async () => {
    expect(() => {
      const npmFundingUrl = '';
      const githubFundingUrl = 'Funding URL GitHub';
      const scoreCalculationResult = calculateAcceptanceOfFundingScore('eslint', npmFundingUrl, githubFundingUrl);

      expect(scoreCalculationResult.score).toBe(100);
      expect(scoreCalculationResult.weightedScore).toBe(100 * CRITERIA_WEIGHTS.ACCEPTANCE_OF_FUNDING);
    }).not.toThrow();
  });

  it('gives a score of 100 whenever the project accepts funding on both their GitHub & NPM pages', async () => {
    expect(() => {
      const npmFundingUrl = 'Funding URL NPM';
      const githubFundingUrl = 'Funding URL GitHub';
      const scoreCalculationResult = calculateAcceptanceOfFundingScore('eslint', npmFundingUrl, githubFundingUrl);

      expect(scoreCalculationResult.score).toBe(100);
      expect(scoreCalculationResult.weightedScore).toBe(100 * CRITERIA_WEIGHTS.ACCEPTANCE_OF_FUNDING);
    }).not.toThrow();
  });

  it('gives a score of 0 whenever the project does not accept funding on their GitHub or NPM pages', async () => {
    expect(() => {
      const npmFundingUrl = '';
      const githubFundingUrl = '';
      const scoreCalculationResult = calculateAcceptanceOfFundingScore('eslint', npmFundingUrl, githubFundingUrl);

      expect(scoreCalculationResult.score).toBe(0);
      expect(scoreCalculationResult.weightedScore).toBe(0 * CRITERIA_WEIGHTS.ACCEPTANCE_OF_FUNDING);
    }).not.toThrow();
  });
});
