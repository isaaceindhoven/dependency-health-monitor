import fetch from 'node-fetch';

import type { GitHubRateLimitData } from './../types/github/github-rate-limit-data';
import type { GitHubCollaborator } from '../types/github/github-collaborator';
import type { GitHubRepositoryIdentifier } from './../types/github/github-repository-identifier';
import type { GitHubData } from './../types/github/github-data';

const fetchCollaboratorData = async (url: string): Promise<GitHubCollaborator[]> => {
  const response = await fetch(url);
  const collaboratorsData: Record<string, unknown>[] = await response.json();
  console.log(collaboratorsData);

  const collaborators: GitHubCollaborator[] = collaboratorsData.map((data) => ({
    id: data.id as number,
    name: data.login as string,
    contributions: data.contributions as number,
  }));

  return collaborators;
};

const fetchRateLimitLeft = async (url: string): Promise<GitHubRateLimitData> => {
  const response = await fetch(url);
  const rateLimitData: Record<string, unknown> = await response.json();

  return {
    maxLimitPerHr: rateLimitData.limit as number,
    remaining: rateLimitData.remaining as number,
    reset: rateLimitData.reset as number,
  };
};

export const fetchGitHubData = async (repositoryIdentifier: GitHubRepositoryIdentifier): Promise<GitHubData> => {
  const collaboratorsDataFetchUrl = `https://api.github.com/repos/${repositoryIdentifier.organisation}/${repositoryIdentifier.project}/contributors?page=1&per_page=100`;
  console.log(collaboratorsDataFetchUrl);

  const rateLimitUrl = 'https://api.github.com/rate_limit';

  return {
    collaborators: await fetchCollaboratorData(collaboratorsDataFetchUrl),
    rateLimitLeft: await fetchRateLimitLeft(rateLimitUrl),
  };
};
