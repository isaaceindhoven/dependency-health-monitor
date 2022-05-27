import { GitHubData } from '../types/github/github-data';
import { scrapeGitHubProfile } from './../scrapers/github';
import type { OrganisationalActivityScoreCalculationResult } from '../types/score/organisational-activity-score-calculation-result';
import type { GitHubRepositoryIdentifier } from '../types/github/github-repository-identifier';

const collaboratorIsPartOfOrganisation = (organisations: string[], organisation: string): boolean => {
  return organisations.includes(organisation);
};

export const calculateOrganisationalActivityScore = async (
  packageName: string,
  gitHubData: GitHubData,
  repositoryIdentifier: GitHubRepositoryIdentifier,
): Promise<OrganisationalActivityScoreCalculationResult> => {
  let totalContributions = 0;
  let contributionsFromSameOrganisation = 0;

  gitHubData.collaborators.forEach(async (collaborator) => {
    const gitHubScrapeResult = await scrapeGitHubProfile(collaborator.name);

    if (collaboratorIsPartOfOrganisation(gitHubScrapeResult.organisations, repositoryIdentifier.organisation)) {
      contributionsFromSameOrganisation += collaborator.contributions;
    }

    totalContributions += collaborator.contributions;
  });

  const score = (contributionsFromSameOrganisation / totalContributions) * 100;

  return {
    score,
    rateLimitLeft: gitHubData.rateLimitLeft,
    explanation: `
        Calculated score with the following data:
            - Total contributions from top 100 contributors: ${totalContributions}
            - Total contributions from top 100 contributors that are from the organisation ${repositoryIdentifier.organisation}: ${contributionsFromSameOrganisation}.
        ${packageName}'s Organisational activity score = Contributions from same organisation / total contributions from top 100 * 100 = ${contributionsFromSameOrganisation} / ${totalContributions} * 100 = ${score}.
      `,
  };
};
