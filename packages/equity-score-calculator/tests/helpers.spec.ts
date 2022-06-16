import { roundDownToNearestLogOf10 } from '../src/helpers';
import { describe, it, expect } from 'vitest';

describe('equity score helper', () => {
  it('accurately rounds down to the NPM weekly downloads to the nearest log of 10', async () => {
    expect(() => {
      const number = 87432;
      const roundedUpNearestLogOf10 = 10000;

      const calculatedNearestLogOf10 = roundDownToNearestLogOf10(number);

      expect(calculatedNearestLogOf10).toBe(roundedUpNearestLogOf10);
    }).not.toThrow();
  });

  it('rounds up to the NPM weekly downloads to 0 when the weekly downloads is 0 instead of returning -Infinity', async () => {
    expect(() => {
      const number = 0;
      const roundedUpNearestLogOf10 = 0;

      const calculatedNearestLogOf10 = roundDownToNearestLogOf10(number);

      expect(calculatedNearestLogOf10).toBe(roundedUpNearestLogOf10);
    }).not.toThrow();
  });
});
