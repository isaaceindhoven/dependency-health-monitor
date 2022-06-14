import type { GitHubRepositoryIdentifier } from '../github/github-repository-identifier';
export interface NpmScrapeResult {
  licenseIdentifier: string;
  gitHubRepositoryIdentifier?: GitHubRepositoryIdentifier;
}
