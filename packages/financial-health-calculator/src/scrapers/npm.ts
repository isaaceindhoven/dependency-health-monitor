import fetch from 'node-fetch';

import { HTMLElement, parse } from 'node-html-parser';
import type { GitHubRepositoryIdentifier } from '../types/github/github-repository-identifier';
import type { NpmScrapeResult } from './../types/npm/npm-scrape-result';

const getLicenseIdentifier = (root: HTMLElement): string => {
  const h3Elements = root.getElementsByTagName('h3');
  const h3Arr = Array.from(h3Elements);
  const licenseElement = h3Arr.filter((e) => e.innerText === 'License')[0];

  if (!licenseElement) {
    return '';
  }

  const licenseParentElement = licenseElement.parentNode;
  const licenseIdentifier = licenseParentElement.getElementsByTagName('p')[0];

  return licenseIdentifier.innerText;
};

const getGitHubRepositoryIdentifier = (root: HTMLElement): GitHubRepositoryIdentifier | undefined => {
  const h3Elements = root.getElementsByTagName('h3');
  const h3Arr = Array.from(h3Elements);
  const repositoryElement = h3Arr.filter((e) => e.innerText === 'Repository')[0];

  if (!repositoryElement) {
    return undefined;
  }

  const repositoryParentElement = repositoryElement.parentNode;
  const repositoryPTag = repositoryParentElement.getElementsByTagName('a')[0];
  const hrefAttribute = repositoryPTag.getAttribute('href');

  if (!hrefAttribute) {
    return undefined;
  }

  const splitRepositoryText = hrefAttribute.split('/');

  return {
    organisation: splitRepositoryText[3],
    project: splitRepositoryText[4],
  };
};

export const scrapeNpm = async (packageName: string): Promise<NpmScrapeResult> => {
  const response = await fetch(`https://www.npmjs.com/package/${packageName}`);
  const npmHtml = await response.text();
  const root = parse(npmHtml);

  const licenseIdentifier = getLicenseIdentifier(root);
  const gitHubRepositoryIdentifier = getGitHubRepositoryIdentifier(root);

  return {
    licenseIdentifier,
    gitHubRepositoryIdentifier,
  };
};
