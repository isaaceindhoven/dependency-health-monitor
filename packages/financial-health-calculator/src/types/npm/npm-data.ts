import type { GitHubRepositoryIdentifier } from '../github/github-repository-identifier';

export interface NpmData {
  fundingUrl: string;
  licenseIdentifier?: string;
  gitHubRepositoryIdentifier?: GitHubRepositoryIdentifier;
}
