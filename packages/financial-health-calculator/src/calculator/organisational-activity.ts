import pMap from 'p-map';
import { scrapeGitHubProfile } from './../scrapers/github.js';
import type { GitHubCollaborator } from './../types/github/github-collaborator';
import type { GitHubData } from '../types/github/github-data';
import type { OrganisationalActivityScoreCalculationResult } from '../types/score/organisational-activity-score-calculation-result';
import type { GitHubRepositoryIdentifier } from '../types/github/github-repository-identifier';

const collaboratorIsPartOfOrganisation = (organisations: string[], organisation: string): boolean => {
  return organisations.includes(organisation);
};

const getCollaboratorContributionData = async (collaborator: GitHubCollaborator) => {
  const gitHubScrapeResult = await scrapeGitHubProfile(collaborator.name);

  return {
    organisations: gitHubScrapeResult.organisations,
    contributions: collaborator.contributions,
  };
};

export const calculateOrganisationalActivityScore = async (
  packageName: string,
  gitHubData: GitHubData,
  repositoryIdentifier: GitHubRepositoryIdentifier,
): Promise<OrganisationalActivityScoreCalculationResult> => {
  const weight = 0.2;
  let totalContributions = 0;
  let contributionsFromSameOrganisation = 0;

  const pMapResult = await pMap(gitHubData.collaborators, getCollaboratorContributionData, {
    concurrency: 75,
  });

  pMapResult.forEach((result) => {
    if (collaboratorIsPartOfOrganisation(result.organisations, repositoryIdentifier.organisation)) {
      contributionsFromSameOrganisation += result.contributions;
    }
    totalContributions += result.contributions;
  });

  const score = (contributionsFromSameOrganisation / totalContributions) * 100;

  return {
    score,
    weightedScore: score * weight,
    rateLimitLeft: gitHubData.rateLimitLeft,
    explanation: `
        Calculated score with the following data:
            - Total contributions from top 100 contributors: ${totalContributions}
            - Total contributions from top 100 contributors that are from the organisation ${repositoryIdentifier.organisation}: ${contributionsFromSameOrganisation}.
        ${packageName}'s Organisational activity score = Contributions from same organisation / total contributions from top 100 * 100 = ${contributionsFromSameOrganisation} / ${totalContributions} * 100 = ${score}.
      `,
  };
};
