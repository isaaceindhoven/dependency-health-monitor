import type { FinancialReportStore } from '@/helpers/types';
import { defineStore } from 'pinia';

const defaultStore: FinancialReportStore = {
  packageJSON: {},
  reportResults: {},
};

export const useFinancialReportStore = defineStore({
  id: 'financial-report',
  state: () => defaultStore,
  getters: {
    getPackageJSON: (state) => state.packageJSON,
    getReportResults: (state) => state.reportResults,
  },
  actions: {
    setPackageJSON(packageJSON: Record<string, unknown>) {
      this.packageJSON = packageJSON;
    },
    setReportResults(reportResults: Record<string, unknown>) {
      this.reportResults = reportResults;
    },
  },
});
