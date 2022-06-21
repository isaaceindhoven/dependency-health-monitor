import { AVERAGE_SALARY_CENTS, CRITERIA_WEIGHTS } from '../../src/constants';
import { calculateSustainabilityScore } from '../../src/calculator/sustainability';
import { describe, it, expect } from 'vitest';

describe('sustainability score calculation', () => {
  it('returns 0 when yearly revenue is empty or 0', async () => {
    expect(() => {
      const yearlyRevenue = 0;
      const fundingGoalCents = 100;
      const teamSize = 100;

      const scoreCalculationResult = calculateSustainabilityScore(
        'eslint',
        yearlyRevenue,
        fundingGoalCents,
        teamSize,
        'EUR',
      );

      expect(scoreCalculationResult.score).toBe(0);
      expect(scoreCalculationResult.weightedScore).toBe(0 * CRITERIA_WEIGHTS.SUSTAINABILITY);
    }).not.toThrow();
  });

  it('returns 0 when funding goal and team size are empty or 0', async () => {
    expect(() => {
      const yearlyRevenue = 100;
      const fundingGoalCents = 0;
      const teamSize = 0;

      const scoreCalculationResult = calculateSustainabilityScore(
        'eslint',
        yearlyRevenue,
        fundingGoalCents,
        teamSize,
        'EUR',
      );

      expect(scoreCalculationResult.score).toBe(0);
      expect(scoreCalculationResult.weightedScore).toBe(0 * CRITERIA_WEIGHTS.SUSTAINABILITY);
    }).not.toThrow();
  });

  it('returns 0 when yearly revenue, funding goal, and team size are empty or 0', async () => {
    expect(() => {
      const yearlyRevenue = 0;
      const fundingGoalCents = 0;
      const teamSize = 0;

      const scoreCalculationResult = calculateSustainabilityScore(
        'eslint',
        yearlyRevenue,
        fundingGoalCents,
        teamSize,
        'EUR',
      );

      expect(scoreCalculationResult.score).toBe(0);
      expect(scoreCalculationResult.weightedScore).toBe(0 * CRITERIA_WEIGHTS.SUSTAINABILITY);
    }).not.toThrow();
  });

  it('returns 100 when yearly revenue equals funding goal', async () => {
    expect(() => {
      const yearlyRevenue = 100;
      const fundingGoalCents = 100;
      const teamSize = 0;

      const scoreCalculationResult = calculateSustainabilityScore(
        'eslint',
        yearlyRevenue,
        fundingGoalCents,
        teamSize,
        'EUR',
      );

      expect(scoreCalculationResult.score).toBe(100);
      expect(scoreCalculationResult.weightedScore).toBe(100 * CRITERIA_WEIGHTS.SUSTAINABILITY);
    }).not.toThrow();
  });

  it('returns 50 when yearly revenue is twice as big as funding goal', async () => {
    expect(() => {
      const yearlyRevenue = 100;
      const fundingGoalCents = 50;
      const teamSize = 0;

      const scoreCalculationResult = calculateSustainabilityScore(
        'eslint',
        yearlyRevenue,
        fundingGoalCents,
        teamSize,
        'EUR',
      );

      expect(scoreCalculationResult.score).toBe(100);
      expect(scoreCalculationResult.weightedScore).toBe(100 * CRITERIA_WEIGHTS.SUSTAINABILITY);
    }).not.toThrow();
  });

  it('uses funding goal when both funding goal and team size are present', async () => {
    expect(() => {
      const yearlyRevenue = 100;
      const fundingGoalCents = 100;
      const teamSize = 75;

      const scoreCalculationResult = calculateSustainabilityScore(
        'eslint',
        yearlyRevenue,
        fundingGoalCents,
        teamSize,
        'EUR',
      );

      expect(scoreCalculationResult.score).toBe(100);
      expect(scoreCalculationResult.weightedScore).toBe(100 * CRITERIA_WEIGHTS.SUSTAINABILITY);
    }).not.toThrow();
  });

  it('uses team size in combination with average salary when no funding goal is present', async () => {
    expect(() => {
      const fundingGoalCents = 0;
      const teamSize = 5;
      const yearlyRevenue = AVERAGE_SALARY_CENTS * teamSize;

      const scoreCalculationResult = calculateSustainabilityScore(
        'eslint',
        yearlyRevenue,
        fundingGoalCents,
        teamSize,
        'EUR',
      );

      expect(scoreCalculationResult.score).toBe(100);
      expect(scoreCalculationResult.weightedScore).toBe(100 * CRITERIA_WEIGHTS.SUSTAINABILITY);
    }).not.toThrow();
  });
});
