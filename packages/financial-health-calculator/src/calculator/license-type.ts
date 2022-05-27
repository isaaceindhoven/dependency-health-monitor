import spdxLicenseList from '../data-files/spdx-licenses.json';
import { cannotCalculateWithMissingData } from './../helpers/missing-data-for-calculation';
import type { ScoreCalculationResult } from './../types/score/score-calculation-result';

export const calculateLicenseTypeScore = (packageName: string, licenseIdentifier: string): ScoreCalculationResult => {
  if (licenseIdentifier === 'none' || licenseIdentifier === '') {
    return cannotCalculateWithMissingData(packageName, 'License type', ['License type']);
  }

  const licenses = spdxLicenseList.licenses;
  for (const license of licenses) {
    if (license.licenseId === licenseIdentifier) {
      return {
        score: 0,
        explanation: `License with ID ${licenseIdentifier} has been found in the SPDX list. Therefore, the license is seen as free to use and ${packageName} receives a score of 0 for the 'License type' criterion.`,
      };
    }
  }

  return {
    score: 100,
    explanation: `License with ID ${licenseIdentifier} has not been found in the SPDX list. Therefore, the license is seen as pay to use and ${packageName} receives a score of 100 for the 'License type' criterion.`,
  };
};
