import { calculateOrganisationalActivityScore } from './calculator/organisational-activity';
import { calculateSustainabilityScore } from './calculator/sustainability';
import { calculateAcceptanceOfFundingScore } from './calculator/acceptance-of-funding';
import { fetchOpenCollectiveData } from './data-fetchers/open-collective';
import { calculateFinancialRoadmapScore } from './calculator/financial-roadmap';
import { calculateLicenseTypeScore } from './calculator/license-type';
import { fetchGitHubData } from './data-fetchers/github';
import { fetchNpmData } from './data-fetchers/npm';

import type { FinancialHealthScoreCalculationResult } from './types/score/financial-health-score-calculation-result';

export const calculateFinancialHealthScore = async (
  packageName: string,
): Promise<FinancialHealthScoreCalculationResult> => {
  const npmData = await fetchNpmData(packageName);

  if (!npmData.gitHubRepositoryIdentifier) {
    throw new Error(
      `No GitHub repository found for project: ${packageName}. Please check if their NPM page is linked to a GitHub repository.`,
    );
  }

  const openCollectiveData = await fetchOpenCollectiveData(packageName);

  const gitHubData = await fetchGitHubData(npmData.gitHubRepositoryIdentifier);

  return {
    sustainabilityScore: calculateSustainabilityScore(
      packageName,
      openCollectiveData.yearlyRevenueCents,
      openCollectiveData.fundingGoalCents,
      openCollectiveData.teamSize,
    ),
    acceptanceOfFundingScore: calculateAcceptanceOfFundingScore(packageName, npmData.fundingUrl, ''),
    licenseTypeScore: calculateLicenseTypeScore(packageName, npmData.licenseIdentifier),
    financialRoadmapScore: calculateFinancialRoadmapScore(
      packageName,
      openCollectiveData.fundingGoalCents,
      openCollectiveData.currency,
    ),
    organisationalActivityScore: await calculateOrganisationalActivityScore(
      packageName,
      gitHubData,
      npmData.gitHubRepositoryIdentifier,
    ),
  };
};
