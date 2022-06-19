import { minimumFinancialHealthScale } from './constants.js';
import { fetchNpmWeeklyDownloads } from './data-fetcher/npm-weekly-downloads.js';
import { getEquitySeverity, roundDownToNearestLogOf10 } from './helpers.js';

export const calculateEquityScore = async (packageName: string, financialHealthScore: number) => {
  const weeklyDownloads = await fetchNpmWeeklyDownloads(packageName);
  const nearestLogRoundedDown = roundDownToNearestLogOf10(weeklyDownloads);
  const smallestAcceptableLogOf10 = +Object.keys(minimumFinancialHealthScale)[0];
  const scaleProjectFallsIn = Math.max(smallestAcceptableLogOf10, nearestLogRoundedDown);

  const minimumFinancialHealthScore = minimumFinancialHealthScale[scaleProjectFallsIn];
  const financialHealthDifference = financialHealthScore - minimumFinancialHealthScore;
  const severity = getEquitySeverity(financialHealthDifference);

  return {
    difference: financialHealthDifference,
    severity,
    explanation: `${packageName} has ${weeklyDownloads} weekly downloads and is therefore expected to have a minimum financial health score of ${minimumFinancialHealthScore}. ${packageName}'s financial health score is ${financialHealthScore}. The difference between the ideal and the current is ${financialHealthDifference} and is therefore seen as ${severity}.`,
  };
};
