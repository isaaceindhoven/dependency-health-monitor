import spdxLicenseList from 'spdx-license-list';
import { CRITERIA_WEIGHTS } from './../constants.js';
import { cannotCalculateWithMissingData } from './../helpers/missing-data-for-calculation.js';
import type { ScoreCalculationResult } from './../types/score/score-calculation-result';

export const calculateLicenseTypeScore = (packageName: string, licenseIdentifier?: string): ScoreCalculationResult => {
  if (!licenseIdentifier || licenseIdentifier === 'none') {
    return cannotCalculateWithMissingData(packageName, 'License type', ['License type']);
  }

  if (spdxLicenseList[licenseIdentifier]) {
    return {
      score: 0,
      weightedScore: 0,
      explanation: `License with ID ${licenseIdentifier} has been found in the SPDX list. Therefore, the license is seen as free to use and ${packageName} receives a score of 0 for the 'License type' criterion.`,
    };
  }

  return {
    score: 100,
    weightedScore: 100 * CRITERIA_WEIGHTS.LICENSE_TYPE,
    explanation: `License with ID ${licenseIdentifier} has not been found in the SPDX list. Therefore, the license is seen as pay to use and ${packageName} receives a score of 100 for the 'License type' criterion.`,
  };
};
