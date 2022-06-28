import { CRITERIA_WEIGHTS } from '../../src/constants';
import { calculateOrganisationalActivityScore } from '../../src/calculator/organisational-activity';
import { describe, it, expect } from 'vitest';

const locale = 'en-GB';

describe('organisational activity score calculation', () => {
  it('gives a score of 100 whenever all contributions come from collaborators that are from the same organisation', async () => {
    expect(() => {
      const totalCommits = 100;
      const commitsFromSameOrg = 100;
      const scoreCalculationResult = calculateOrganisationalActivityScore(
        'eslint',
        'eslint',
        totalCommits,
        commitsFromSameOrg,
        locale,
      );

      expect(scoreCalculationResult.score).toBe(100);
      expect(scoreCalculationResult.weightedScore).toBe(100 * CRITERIA_WEIGHTS.ORGANISATIONAL_ACTIVITY);
    }).not.toThrow();
  });

  it('gives a score of 50 whenever the contributions from the same organisation are half the size of the total contributions', async () => {
    expect(() => {
      const totalCommits = 100;
      const commitsFromSameOrg = totalCommits / 2;
      const scoreCalculationResult = calculateOrganisationalActivityScore(
        'eslint',
        'eslint',
        totalCommits,
        commitsFromSameOrg,
        locale,
      );

      expect(scoreCalculationResult.score).toBe(50);
      expect(scoreCalculationResult.weightedScore).toBe(50 * CRITERIA_WEIGHTS.ORGANISATIONAL_ACTIVITY);
    }).not.toThrow();
  });

  it('gives a score of 0 whenever no commits are from the same organisation', async () => {
    expect(() => {
      const totalCommits = 100;
      const commitsFromSameOrg = 0;
      const scoreCalculationResult = calculateOrganisationalActivityScore(
        'eslint',
        'eslint',
        totalCommits,
        commitsFromSameOrg,
        locale,
      );

      expect(scoreCalculationResult.score).toBe(0);
      expect(scoreCalculationResult.weightedScore).toBe(0 * CRITERIA_WEIGHTS.ORGANISATIONAL_ACTIVITY);
    }).not.toThrow();
  });

  it('gives a score of 0 whenever there has not been committed yet', async () => {
    expect(() => {
      const totalCommits = 0;
      const commitsFromSameOrg = 0;
      const scoreCalculationResult = calculateOrganisationalActivityScore(
        'eslint',
        'eslint',
        totalCommits,
        commitsFromSameOrg,
        locale,
      );

      expect(scoreCalculationResult.score).toBe(0);
      expect(scoreCalculationResult.weightedScore).toBe(0 * CRITERIA_WEIGHTS.ORGANISATIONAL_ACTIVITY);
    }).not.toThrow();
  });
});
