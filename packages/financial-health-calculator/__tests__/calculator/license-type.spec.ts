import { CRITERIA_WEIGHTS } from './../../src/constants';
import { calculateLicenseTypeScore } from './../../src/calculator/license-type';
import { describe, it, expect } from 'vitest';

describe('license type score calculation', () => {
  it('gives a score of 0 whenever the license is in the SPDX list', async () => {
    expect(() => {
      const scoreCalculationResult = calculateLicenseTypeScore('eslint', 'MIT');

      expect(scoreCalculationResult.score).toBe(0);
      expect(scoreCalculationResult.weightedScore).toBe(0 * CRITERIA_WEIGHTS.LICENSE_TYPE);
    }).not.toThrow();
  });

  it('gives a score of 100 whenever the license is not the SPDX list', async () => {
    expect(() => {
      const scoreCalculationResult = calculateLicenseTypeScore('eslint', 'MITLPDEA');

      expect(scoreCalculationResult.score).toBe(100);
      expect(scoreCalculationResult.weightedScore).toBe(100 * CRITERIA_WEIGHTS.LICENSE_TYPE);
    }).not.toThrow();
  });

  it('gives a score of 0 whenever no license has been set in NPM', async () => {
    expect(() => {
      const scoreCalculationResult = calculateLicenseTypeScore('eslint', 'none');
      const scoreCalculationResultEmpty = calculateLicenseTypeScore('eslint', '');

      expect(scoreCalculationResult.score).toBe(0);
      expect(scoreCalculationResultEmpty.score).toBe(0);
      expect(scoreCalculationResult.weightedScore).toBe(0 * CRITERIA_WEIGHTS.LICENSE_TYPE);
      expect(scoreCalculationResultEmpty.weightedScore).toBe(0 * CRITERIA_WEIGHTS.LICENSE_TYPE);
    }).not.toThrow();
  });
});
