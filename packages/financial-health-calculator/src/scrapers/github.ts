import { HTMLElement, parse } from 'node-html-parser';
import type { GitHubProfileScrapeResult } from '../types/github/github-profile-scrape-result';

const getUserOrganizations = (gitHubProfile: HTMLElement): string[] => {
  const h2Elements = gitHubProfile.getElementsByTagName('h2');
  const h2Arr = Array.from(h2Elements);

  const organizationElement = h2Arr.filter((e) => e.innerText === 'Organizations')[0];

  if (!organizationElement) {
    return [];
  }

  const organizationParentElement = organizationElement.parentNode;

  if (!organizationParentElement) {
    return [];
  }

  const aTags = organizationParentElement.getElementsByTagName('a');

  const organisations: string[] = [];
  aTags.forEach((aTag) => {
    if (aTag.getAttribute('href')) {
      // Line above assures the href attribute is not null, undefined or empty
      const hrefString = aTag.getAttribute('href') as string;
      const organisationString = hrefString[0] === '/' ? hrefString.substring(1) : hrefString;
      organisations.push(organisationString);
    }
  });

  return organisations;
};

export const scrapeGitHubProfile = async (user: string): Promise<GitHubProfileScrapeResult> => {
  const response = await fetch(`https://github.com/${user}`);
  const gitHubProfileHtml = await response.text();
  const root = parse(gitHubProfileHtml);

  const organisations = getUserOrganizations(root);

  return {
    organisations,
  };
};
