import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { scrapeGitHubProfile } from '../../../scrapers/github';
import { gitHubProfileMockHtml, gitHubProfileMockWithoutOrganization } from './github-profile-copy.js';

const restHandlers = [
  rest.get('https://github.com/Ensar025', (req, res, ctx) => {
    return res(ctx.status(200), ctx.text(gitHubProfileMockHtml));
  }),
  rest.get('https://github.com/Ensar025-without-organization', (req, res, ctx) => {
    return res(ctx.status(200), ctx.text(gitHubProfileMockWithoutOrganization));
  }),
];

const server = setupServer(...restHandlers);

describe('scraping github', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

  afterAll(() => server.close());

  afterEach(() => server.resetHandlers());

  it(`returns the list of the organisations the user is a part of`, async () => {
    const gitHubScrapeResult = await scrapeGitHubProfile('Ensar025');
    const expectedOrganisations = ['isaaceindhoven'];

    expectedOrganisations.forEach((expectedOrganisation, index) => {
      expect(gitHubScrapeResult.organisations[index]).toBe(expectedOrganisation);
    });
  });

  it(`returns an empty array when the user is not part of an organisation`, async () => {
    expect(async () => {
      const gitHubScrapeResult = await scrapeGitHubProfile('Ensar025-without-organization');
      expect(gitHubScrapeResult.organisations.length).toBe(0);
    }).not.toThrow();
  });
});
