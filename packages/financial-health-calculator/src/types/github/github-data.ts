import type { GitHubRateLimitData } from './github-rate-limit-data';
import type { GitHubCollaborator } from './github-collaborator';

export interface GitHubData {
  collaborators: GitHubCollaborator[];
  rateLimitLeft: GitHubRateLimitData;
  totalContributions: number;
  contributionsFromSameOrganisation: number;
}
