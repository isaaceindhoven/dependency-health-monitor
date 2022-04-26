import type { MenuItem } from 'primevue/menuitem';

type ExecutionMethod = 'GitHub' | 'Upload' | 'Public URL';

interface StepsStore {
  executionMethod: ExecutionMethod;
  steps: MenuItem[];
  activeStepIndex: number;
  maxAllowedStepIndex: number;
  allowAdvance: boolean;
}

interface FinancialReportStore {
  packageJSON: Record<string, unknown>;
  reportResults: Record<string, unknown>;
}

export type { ExecutionMethod, StepsStore, FinancialReportStore };
