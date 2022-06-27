import fetch, { Headers } from 'node-fetch';
import pMap from 'p-map';
import { scrapeGitHubProfile } from './../scrapers/github';
import type { GitHubRateLimitData } from './../types/github/github-rate-limit-data';
import type { GitHubCollaborator } from '../types/github/github-collaborator';
import type { GitHubRepositoryIdentifier } from './../types/github/github-repository-identifier';
import type { GitHubData } from './../types/github/github-data';

export const fetchGitHubDataFactory = (gitHubAccessToken: string) => {
  const fetchCollaboratorData = async (url: string): Promise<GitHubCollaborator[]> => {
    const headers = new Headers();
    headers.append('Authorization', `token ${gitHubAccessToken}`);

    const collaboratorsData: Record<string, unknown>[] = await fetch(url, {
      headers,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response?.message === 'Bad credentials') {
          throw Error(response.message);
        }
        return response;
      });

    const collaborators: GitHubCollaborator[] = collaboratorsData.map((data) => ({
      id: data.id as number,
      name: data.login as string,
      contributionCount: data.contributions as number,
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

  const collaboratorIsPartOfOrganisation = (organisations: string[], organisation: string): boolean => {
    return organisations.includes(organisation);
  };

  const getCollaboratorData = async (collaborator: GitHubCollaborator) => {
    const gitHubScrapeResult = await scrapeGitHubProfile(collaborator.name);

    return {
      organisations: gitHubScrapeResult.organisations,
      contributionCount: collaborator.contributionCount,
    };
  };

  const getContributionDataFromTop100Contributors = async (
    gitHubTop100Collaborators: GitHubCollaborator[],
    organisationName: string,
  ) => {
    let totalContributions = 0;
    let contributionsFromSameOrganisation = 0;

    const pMapResult = await pMap(gitHubTop100Collaborators, getCollaboratorData, {
      concurrency: 75,
    });

    pMapResult.forEach((result) => {
      if (collaboratorIsPartOfOrganisation(result.organisations, organisationName)) {
        contributionsFromSameOrganisation += result.contributionCount;
      }
      totalContributions += result.contributionCount;
    });

    return {
      totalContributions,
      contributionsFromSameOrganisation,
    };
  };

  const fetchGitHubData = async (repositoryIdentifier: GitHubRepositoryIdentifier): Promise<GitHubData> => {
    const collaboratorsDataFetchUrl = `https://api.github.com/repos/${repositoryIdentifier.organisation}/${repositoryIdentifier.project}/contributors?page=1&per_page=100`;
    const rateLimitUrl = 'https://api.github.com/rate_limit';

    const collaborators = await fetchCollaboratorData(collaboratorsDataFetchUrl);
    const rateLimitLeft = await fetchRateLimitLeft(rateLimitUrl);

    const { totalContributions, contributionsFromSameOrganisation } = await getContributionDataFromTop100Contributors(
      collaborators,
      repositoryIdentifier.organisation,
    );

    return {
      collaborators,
      rateLimitLeft,
      totalContributions,
      contributionsFromSameOrganisation,
    };
  };

  return {
    fetchGitHubData,
  };
};
