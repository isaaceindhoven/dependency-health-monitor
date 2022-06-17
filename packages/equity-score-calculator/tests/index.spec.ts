import { calculateEquityScore } from '../src/index';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const restHandlers = [
  rest.get('https://api.npmjs.org/downloads/point/last-week/project1', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ downloads: 23_345_231 }));
  }),
  rest.get('https://api.npmjs.org/downloads/point/last-week/project2', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ downloads: 9543 }));
  }),
  rest.get('https://api.npmjs.org/downloads/point/last-week/project3', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ downloads: 23_030_340_564 }));
  }),
];

const server = setupServer(...restHandlers);

describe('equity score calculator', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

  afterAll(() => server.close());

  afterEach(() => server.resetHandlers());
  it('calculates the equity correctly when the weekly downloads is inside the scale', async () => {
    expect(async () => {
      const financialHealthScore = 70;
      const equityScore = await calculateEquityScore('project1', financialHealthScore);

      expect(equityScore.difference).toBe(-5);
      expect(equityScore.severity).toBe('Equitable');
    }).not.toThrow();
  });

  it('calculates the equity correctly when the weekly downloads is smaller than the values in the scale', async () => {
    expect(async () => {
      const financialHealthScore = 0;
      const equityScore = await calculateEquityScore('project2', financialHealthScore);

      expect(equityScore.difference).toBe(-30);
      expect(equityScore.severity).toBe('Extremely inequitable');
    }).not.toThrow();
  });

  it('calculates the equity correctly when the weekly downloads is bigger than the values in the scale', async () => {
    expect(async () => {
      const financialHealthScore = 78;
      const equityScore = await calculateEquityScore('project3', financialHealthScore);

      expect(equityScore.difference).toBe(-7);
      expect(equityScore.severity).toBe('Very inequitable');
    }).not.toThrow();
  });
});
