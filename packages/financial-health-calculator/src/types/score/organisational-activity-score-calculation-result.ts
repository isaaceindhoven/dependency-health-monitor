import type { GitHubRateLimitData } from '../github/github-rate-limit-data';
import type { ScoreCalculationResult } from './score-calculation-result';

export interface OrganisationalActivityScoreCalculationResult extends ScoreCalculationResult {
  rateLimitLeft: GitHubRateLimitData;
}
