import { GitHubRepositoryIdentifier } from './github-repository-identifier';

export interface NpmData {
  fundingUrl: string;
  licenseIdentifier: string;
  gitHubRepositoryIdentifier?: GitHubRepositoryIdentifier;
}
