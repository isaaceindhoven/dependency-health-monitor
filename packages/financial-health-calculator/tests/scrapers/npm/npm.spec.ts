import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
// import { scrapeNpm } from '../../../src/scrapers/npm';
import { eslintHTMLCopy, eslintWithoutLicenseIdentifierCopy, eslintWithoutRepository } from './npm-eslint-copy.js';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const restHandlers = [
  rest.get('https://www.npmjs.com/package/eslint', (req, res, ctx) => {
    return res(ctx.status(200), ctx.text(eslintHTMLCopy));
  }),
  rest.get('https://www.npmjs.com/package/eslint-without-license-identifier', (req, res, ctx) => {
    return res(ctx.status(200), ctx.text(eslintWithoutLicenseIdentifierCopy));
  }),
  rest.get('https://www.npmjs.com/package/eslint-without-repository', (req, res, ctx) => {
    return res(ctx.status(200), ctx.text(eslintWithoutRepository));
  }),
];

const server = setupServer(...restHandlers);

describe('scraping npm eslint', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

  afterAll(() => server.close());

  afterEach(() => server.resetHandlers());

  it.skip('gives correct licenseIdentifier when visible', async () => {
    // const scrapedNpm = await scrapeNpm('eslint');
    // expect(scrapedNpm.licenseIdentifier).toBe('MIT');
  });

  it.skip('gives empty licenseIdentifier when no identifier is present', async () => {
    expect(async () => {
      // const scrapedNpm = await scrapeNpm('eslint-without-license-identifier');
      // expect(scrapedNpm.licenseIdentifier).toBe('');
    }).not.toThrow();
  });

  it.skip(`retrieves correct repository identifiers from eslint's github`, async () => {
    expect(async () => {
      // const scrapedNpm = await scrapeNpm('eslint');
      // expect(scrapedNpm.gitHubRepositoryIdentifier?.organisation).toBe('eslint');
      // expect(scrapedNpm.gitHubRepositoryIdentifier?.project).toBe('eslint');
    }).not.toThrow();
  });

  it.skip(`returns undefined when no repository identifier is specified`, async () => {
    expect(async () => {
      // const scrapedNpm = await scrapeNpm('eslint-without-repository');
      // expect(scrapedNpm.gitHubRepositoryIdentifier).toBe(undefined);
    }).not.toThrow();
  });
});
