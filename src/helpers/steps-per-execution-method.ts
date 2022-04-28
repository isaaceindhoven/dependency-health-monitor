import type { MenuItem } from 'primevue/menuitem';
import type { ExecutionMethod } from './types';

const pathPrefix = '/run-report';

const gitHubSteps: MenuItem[] = [
  {
    label: 'Select an execution method',
    to: pathPrefix + '/select',
  },
  {
    label: 'Log in',
    to: pathPrefix + '/',
  },
  {
    label: 'Select repository',
    to: pathPrefix + '/',
  },
  {
    label: 'Confirm & Execute',
    to: pathPrefix + '/',
  },
  {
    label: 'View results',
    to: pathPrefix + '/',
  },
];

const pasteOrUploadSteps: MenuItem[] = [
  {
    label: 'Select an execution method',
    to: pathPrefix + '/select',
  },
  {
    label: 'Paste or upload file',
    to: pathPrefix + '/paste-or-upload',
  },
  {
    label: 'Confirm & Execute',
    to: pathPrefix + '/confirm',
  },
  {
    label: 'View results',
    to: pathPrefix + '/',
  },
];

const publicURLSteps: MenuItem[] = [
  {
    label: 'Select an execution method',
    to: pathPrefix + '/select',
  },
  {
    label: 'Insert public repository URL',
    to: pathPrefix + '/',
  },
  {
    label: 'Confirm & Execute',
    to: pathPrefix + '/',
  },
  {
    label: 'View results',
    to: pathPrefix + '/',
  },
];

const stepsPerExecutionMethod: Record<ExecutionMethod, MenuItem[]> = {
  GitHub: gitHubSteps,
  Upload: pasteOrUploadSteps,
  'Public URL': publicURLSteps,
};

const getStepsForExecutionMethod = (method: ExecutionMethod) => {
  return stepsPerExecutionMethod[method];
};

export { getStepsForExecutionMethod };
