import type { MenuItem } from 'primevue/menuitem';

type ExecutionMethod = 'GitHub' | 'Upload' | 'Public URL';

interface FinancialReportStore {
  executionMethod: ExecutionMethod;
  steps: MenuItem[];
  activeStepIndex: number;
}

export type { ExecutionMethod, FinancialReportStore };
