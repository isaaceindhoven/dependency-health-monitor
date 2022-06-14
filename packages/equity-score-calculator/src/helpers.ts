import { minimumFinancialHealthScale } from './constants.js';

export const roundDownToNearestLogOf10 = (numberToRoundDown: number): number => {
  const possibleLogValues = Object.keys(minimumFinancialHealthScale);
  const biggestPossibleLogValue = +possibleLogValues[possibleLogValues.length - 1];

  let nearestLogOf10 = Math.pow(10, Math.floor(Math.log10(numberToRoundDown)));
  nearestLogOf10 = Math.max(0, nearestLogOf10);

  return Math.min(biggestPossibleLogValue, nearestLogOf10);
};

export const getEquitySeverity = (difference: number): string => {
  if (difference >= 11) {
    return 'Extremely equitable';
  } else if (difference >= 6) {
    return 'Very equitable';
  } else if (difference >= -5) {
    return 'Equitable';
  } else if (difference >= -10) {
    return 'Very inequitable';
  } else {
    return 'Extremely inequitable';
  }
};
