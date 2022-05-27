import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { scrapeNpm } from '../../../scrapers/npm';
import { eslintHTMLCopy, eslintWithoutLicenseIdentifierCopy } from './npm-eslint-copy.js';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const restHandlers = [
  rest.get('https://www.npmjs.com/package/eslint', (req, res, ctx) => {
    return res(ctx.status(200), ctx.body(eslintHTMLCopy));
  }),
  rest.get('https://www.npmjs.com/package/eslint-without-license-identifier', (req, res, ctx) => {
    return res(ctx.status(200), ctx.body(eslintWithoutLicenseIdentifierCopy));
  }),
];

const server = setupServer(...restHandlers);

describe('scraping npm eslint', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

  afterAll(() => server.close());

  afterEach(() => server.resetHandlers());

  it('gives correct licenseIdentifier when visible', async () => {
    const scrapedLicenseIdentifier = await scrapeNpm('eslint');

    expect(scrapedLicenseIdentifier.licenseIdentifier).toBe('MIT');
  });

  it('gives empty licenseIdentifier when no identifier is present', async () => {
    expect(async () => {
      const scrapedLicenseIdentifier = await scrapeNpm('eslint-without-license-identifier');
      expect(scrapedLicenseIdentifier.licenseIdentifier).toBe('');
    }).not.toThrow();
  });
});
