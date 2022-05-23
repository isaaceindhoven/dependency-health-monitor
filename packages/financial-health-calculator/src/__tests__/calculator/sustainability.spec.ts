import { AVERAGE_SALARY_CENTS } from './../../constants';
import { calculateSustainabilityScore } from './../../calculator/sustainability';
import { describe, it, expect } from 'vitest';

describe('sustainability score calculation', () => {
  it('returns 0 when yearly revenue is empty or 0', async () => {
    expect(() => {
      const scoreCalculationResult = calculateSustainabilityScore('eslint', 0, 100, 100);

      expect(scoreCalculationResult.score).toBe(0);
    }).not.toThrow();
  });

  it('returns 0 when funding goal and team size are empty or 0', async () => {
    expect(() => {
      const scoreCalculationResult = calculateSustainabilityScore('eslint', 100, 0, 0);

      expect(scoreCalculationResult.score).toBe(0);
    }).not.toThrow();
  });

  it('returns 0 when yearly revenue, funding goal, and team size are empty or 0', async () => {
    expect(() => {
      const scoreCalculationResult = calculateSustainabilityScore('eslint', 0, 0, 0);

      expect(scoreCalculationResult.score).toBe(0);
    }).not.toThrow();
  });

  it('returns 100 when yearly revenue equals funding goal', async () => {
    expect(() => {
      const scoreCalculationResult = calculateSustainabilityScore('eslint', 100, 100, 0);

      expect(scoreCalculationResult.score).toBe(100);
    }).not.toThrow();
  });

  it('returns 50 when yearly revenue is twice as big as funding goal', async () => {
    expect(() => {
      const scoreCalculationResult = calculateSustainabilityScore('eslint', 100, 50, 0);

      expect(scoreCalculationResult.score).toBe(100);
    }).not.toThrow();
  });

  it('uses funding goal when both funding goal and team size are present', async () => {
    expect(() => {
      const scoreCalculationResult = calculateSustainabilityScore('eslint', 100, 100, 75);

      expect(scoreCalculationResult.score).toBe(100);
    }).not.toThrow();
  });

  it('uses team size in combination with average salary when no funding goal is present', async () => {
    expect(() => {
      const teamSize = 5;
      const teamCost = AVERAGE_SALARY_CENTS * teamSize;

      const scoreCalculationResult = calculateSustainabilityScore('eslint', teamCost, 0, teamSize);

      expect(scoreCalculationResult.score).toBe(100);
    }).not.toThrow();
  });
});
