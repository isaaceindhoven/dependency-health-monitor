import pacote, { ManifestResult } from 'pacote';
import type { GitHubRepositoryIdentifier } from './../types/github/github-repository-identifier';
import type { NpmData } from '../types/npm/npm-data';

type Funding = { url: string };

function isFunding(element: unknown): element is Funding {
  return element !== undefined && (element as Funding).url !== undefined;
}

const getGitHubRepositoryIdentifier = (projectData: ManifestResult): GitHubRepositoryIdentifier => {
  let organisation = '';
  let project = '';

  if (projectData.repository && projectData.repository.url && projectData.repository.url.includes('github')) {
    const gitHubRepositoryUrl = projectData.repository.url.replace('git+', '');
    const splitRepositoryUrl = gitHubRepositoryUrl.split('/');

    organisation = splitRepositoryUrl[3];
    project = splitRepositoryUrl[4];
  }

  return {
    organisation,
    project,
  };
};

export const fetchNpmData = async (packageName: string): Promise<NpmData> => {
  const projectData = await pacote.manifest(packageName, {
    fullMetadata: true,
  });

  const licenseIdentifier = projectData.license;
  const gitHubRepositoryIdentifier = getGitHubRepositoryIdentifier(projectData);

  let fundingUrl = '';

  if (isFunding(projectData.funding)) {
    fundingUrl = projectData.funding.url;
  }

  return {
    fundingUrl,
    licenseIdentifier,
    gitHubRepositoryIdentifier,
  };
};
