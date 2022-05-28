import pacote from 'pacote';
import { scrapeNpm } from '../scrapers/npm.js';
import type { NpmData } from '../types/npm/npm-data';

type Funding = { url: string };

function isFunding(element: unknown): element is Funding {
  return element !== undefined && (element as Funding).url !== undefined;
}

export const fetchNpmData = async (packageName: string): Promise<NpmData> => {
  const projectData = await pacote.manifest(packageName);
  const scrapeResult = await scrapeNpm(packageName);

  let fundingUrl = '';

  if (isFunding(projectData.funding)) {
    fundingUrl = projectData.funding.url;
  }

  return {
    fundingUrl,
    licenseIdentifier: scrapeResult.licenseIdentifier,
    gitHubRepositoryIdentifier: scrapeResult.gitHubRepositoryIdentifier,
  };
};
