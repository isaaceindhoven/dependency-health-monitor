export interface GitHubRateLimitData {
  maxLimitPerHr: number;
  remaining: number;
  reset: number;
}
