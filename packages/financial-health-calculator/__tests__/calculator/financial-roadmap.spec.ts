import { calculateFinancialRoadmapScore } from './../../src/calculator/financial-roadmap';
import { CRITERIA_WEIGHTS } from './../../src/constants';
import { describe, it, expect } from 'vitest';

describe('financial roadmap score calculation', () => {
  it('gives a score of 100 whenever the project has defined a funding goal on their OpenCollective page', async () => {
    expect(() => {
      const fundingGoal = 500_000_000;
      const currency = 'USD';
      const scoreCalculationResult = calculateFinancialRoadmapScore('eslint', fundingGoal, currency);

      expect(scoreCalculationResult.score).toBe(100);
      expect(scoreCalculationResult.weightedScore).toBe(100 * CRITERIA_WEIGHTS.FINANCIAL_ROADMAP);
    }).not.toThrow();
  });

  it('gives a score of 0 whenever the project has not defined a funding goal on their OpenCollective page', async () => {
    expect(() => {
      const fundingGoal = 0;
      const currency = '';
      const scoreCalculationResult = calculateFinancialRoadmapScore('eslint', fundingGoal, currency);

      expect(scoreCalculationResult.score).toBe(0);
      expect(scoreCalculationResult.weightedScore).toBe(0 * CRITERIA_WEIGHTS.FINANCIAL_ROADMAP);
    }).not.toThrow();
  });
});
