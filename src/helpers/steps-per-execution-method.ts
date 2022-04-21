import type { MenuItem } from 'primevue/menuitem';
import type { ExecutionMethod } from './types';

const gitHubSteps: MenuItem[] = [
  {
    label: 'Select an execution method',
    to: '/',
  },
  {
    label: 'Log in',
    to: '/',
  },
  {
    label: 'Select repository',
    to: '/',
  },
  {
    label: 'Confirm & Execute',
    to: '/',
  },
  {
    label: 'View results',
    to: '/',
  },
];

const uploadOrPasteSteps: MenuItem[] = [
  {
    label: 'Select an execution method',
    to: '/',
  },
  {
    label: 'Paste or upload file',
    to: '/',
  },
  {
    label: 'Confirm & Execute',
    to: '/',
  },
  {
    label: 'View results',
    to: '/',
  },
];

const publicURLSteps: MenuItem[] = [
  {
    label: 'Select an execution method',
    to: '/',
  },
  {
    label: 'Insert public repository URL',
    to: '/',
  },
  {
    label: 'Confirm & Execute',
    to: '/',
  },
  {
    label: 'View results',
    to: '/',
  },
];

const stepsPerExecutionMethod: Record<ExecutionMethod, MenuItem[]> = {
  GitHub: gitHubSteps,
  Upload: uploadOrPasteSteps,
  'Public URL': publicURLSteps,
};

const getStepsForExecutionMethod = (method: ExecutionMethod) => {
  return stepsPerExecutionMethod[method];
};

export { getStepsForExecutionMethod };
