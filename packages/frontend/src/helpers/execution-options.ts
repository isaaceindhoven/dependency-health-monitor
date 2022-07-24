import type { ExecutionMethod } from '@/helpers/types';

interface ExecutionOption {
  name: ExecutionMethod;
  text: string;
}

const executionOptions: ExecutionOption[] = [
  {
    name: 'GitHub',
    text: 'Log in and select a repository',
  },
  {
    name: 'Upload',
    text: 'Upload or paste a package.json',
  },
  {
    name: 'Public URL',
    text: 'Run report using public repository URL',
  },
];

export { executionOptions };
