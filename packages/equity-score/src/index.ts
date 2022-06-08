import { minimumFinancialHealthScale } from './constants.js';
import { fetchNpmWeeklyDownloads } from './data-fetcher/npm-weekly-downloads.js';
import { getEquitySeverity, roundUpToNearestLogOf10 } from './helpers.js';

export const getEquityScore = async (packageName: string, financialHealthScore: number) => {
  const weeklyDownloads = await fetchNpmWeeklyDownloads(packageName);
  const nearestLogRoundedUp = roundUpToNearestLogOf10(weeklyDownloads);
  const minimumFinancialHealthScore = minimumFinancialHealthScale[nearestLogRoundedUp];

  const financialHealthDifference = financialHealthScore - minimumFinancialHealthScore;
  const severity = getEquitySeverity(financialHealthDifference);

  return {
    difference: financialHealthDifference,
    severity,
    explanation: `${packageName} has ${weeklyDownloads} weekly downloads and is therefore expected to have a minimum financial health score of ${minimumFinancialHealthScale}. ${packageName}'s financial health score is ${financialHealthScore}. The difference between the ideal and the current is ${financialHealthDifference} and is therefore seen as ${severity}.`,
  };
};
