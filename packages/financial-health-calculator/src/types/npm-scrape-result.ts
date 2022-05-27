import { GitHubRepositoryIdentifier } from './github-repository-identifier';
export interface NpmScrapeResult {
  licenseIdentifier: string;
  gitHubRepositoryIdentifier?: GitHubRepositoryIdentifier;
}
