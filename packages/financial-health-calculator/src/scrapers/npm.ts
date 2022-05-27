import { GitHubRepositoryIdentifier } from './../types/github-repository-identifier';
import { HTMLElement, parse } from 'node-html-parser';
import type { NpmScrapeResult } from './../types/npm-scrape-result';

const getLicenseIdentifier = (root: HTMLElement): string => {
  const h3Elements = root.getElementsByTagName('h3');
  const h3Arr = Array.from(h3Elements);
  const licenseElement = h3Arr.filter((e) => e.innerText === 'License')[0];

  if (!licenseElement) {
    return '';
  }

  const licenseParentElement = licenseElement.parentNode;
  const licenseIdentifier = licenseParentElement.childNodes[1].innerText;

  return licenseIdentifier;
};

const getGitHubRepositoryIdentifiers = (root: HTMLElement): GitHubRepositoryIdentifier | undefined => {
  const h3Elements = root.getElementsByTagName('h3');
  const h3Arr = Array.from(h3Elements);
  const repositoryElement = h3Arr.filter((e) => e.innerText === 'Repository')[0];

  if (!repositoryElement) {
    return undefined;
  }

  const repositoryParentElement = repositoryElement.parentNode;
  const repositoryText = repositoryParentElement.childNodes[1].childNodes[0].innerText;

  const splitRepositoryText = repositoryText.split('/');

  return {
    organisation: splitRepositoryText[1],
    project: splitRepositoryText[0],
  };
};

export const scrapeNpm = async (packageName: string): Promise<NpmScrapeResult> => {
  const response = await fetch(`https://www.npmjs.com/package/${packageName}`);
  const npmHtml = await response.text();
  const root = parse(npmHtml);

  const licenseIdentifier = getLicenseIdentifier(root);
  const gitHubRepositoryIdentifier = getGitHubRepositoryIdentifiers(root);

  return {
    licenseIdentifier,
    gitHubRepositoryIdentifier,
  };
};
