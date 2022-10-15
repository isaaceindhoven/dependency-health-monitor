import type { FinancialReportStore } from '@/helpers/types';

const defaultStore: FinancialReportStore = {
  packageJSON: {},
  reportResults: {},
};

export const useFinancialReportState = () =>
  useState<FinancialReportStore>('financial-report', () => ({ ...defaultStore }));
