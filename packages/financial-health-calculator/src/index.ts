import { MAX_FINANCIAL_HEALTH_SCORE } from './constants.js';
import { calculateOrganisationalActivityScore } from './calculator/organisational-activity.js';
import { calculateSustainabilityScore } from './calculator/sustainability.js';
import { calculateAcceptanceOfFundingScore } from './calculator/acceptance-of-funding.js';
import { fetchOpenCollectiveDataFactory } from './data-fetchers/open-collective.js';
import { calculateFinancialRoadmapScore } from './calculator/financial-roadmap.js';
import { calculateLicenseTypeScore } from './calculator/license-type.js';
import { fetchGitHubDataFactory } from './data-fetchers/github.js';
import { fetchNpmData } from './data-fetchers/npm.js';
import type { FinancialHealthScoreCalculationResult } from './types/score/financial-health-score-calculation-result';

export const calculateFinancialHealthScore = async (
  packageName: string,
  userLocale: string,
  gitHubAccessToken: string,
  openCollectiveApiKey: string,
): Promise<FinancialHealthScoreCalculationResult> => {
  const npmData = await fetchNpmData(packageName);

  if (!npmData.gitHubRepositoryIdentifier) {
    throw new Error(
      `No GitHub repository found for project: ${packageName}. Please check if their NPM page is linked to a GitHub repository.`,
    );
  }
  const openCollectiveDataFactory = fetchOpenCollectiveDataFactory(openCollectiveApiKey);
  const openCollectiveData = await openCollectiveDataFactory.fetchOpenCollectiveData(packageName);
  const gitHubDataFactory = fetchGitHubDataFactory(gitHubAccessToken);
  const gitHubData = await gitHubDataFactory.fetchGitHubData(npmData.gitHubRepositoryIdentifier);

  const acceptanceOfFundingScore = calculateAcceptanceOfFundingScore(packageName, npmData.fundingUrl, '');
  const licenseTypeScore = calculateLicenseTypeScore(packageName, npmData.licenseIdentifier);
  const sustainabilityScore = calculateSustainabilityScore(
    packageName,
    openCollectiveData.yearlyRevenueCents,
    openCollectiveData.fundingGoalCents,
    openCollectiveData.teamSize,
    openCollectiveData.currency,
    userLocale,
  );
  const financialRoadmapScore = calculateFinancialRoadmapScore(
    packageName,
    openCollectiveData.fundingGoalCents,
    openCollectiveData.currency,
    userLocale,
  );
  const organisationalActivityScore = calculateOrganisationalActivityScore(
    packageName,
    npmData.gitHubRepositoryIdentifier.organisation,
    gitHubData.totalContributions,
    gitHubData.contributionsFromSameOrganisation,
    userLocale,
  );

  const totalScore =
    sustainabilityScore.weightedScore +
    acceptanceOfFundingScore.weightedScore +
    licenseTypeScore.weightedScore +
    financialRoadmapScore.weightedScore +
    organisationalActivityScore.weightedScore;

  const finalScore = (totalScore / MAX_FINANCIAL_HEALTH_SCORE) * 100;

  return {
    sustainabilityScore,
    acceptanceOfFundingScore,
    licenseTypeScore,
    financialRoadmapScore,
    organisationalActivityScore,
    finalScore,
  };
};
