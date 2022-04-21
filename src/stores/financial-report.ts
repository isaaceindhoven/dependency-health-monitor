import { defineStore } from 'pinia';
import { getStepsForExecutionMethod } from '@/helpers/steps-per-execution-method';

import type { MenuItem } from 'primevue/menuitem';
import type { FinancialReportStore, ExecutionMethod } from '@/helpers/types';

const defaultStore: FinancialReportStore = {
  executionMethod: 'Upload',
  steps: getStepsForExecutionMethod('Upload') as MenuItem[],
  activeStepIndex: 0,
};

export const useFinancialReportStore = defineStore({
  id: 'steps',
  state: (): FinancialReportStore => defaultStore,
  getters: {
    getSteps: (state) => state.steps,
    getExecutionMethod: (state) => state.executionMethod,
    getActiveStepIndex: (state) => state.activeStepIndex,
  },
  actions: {
    setExecutionMethod(executionMethod: ExecutionMethod) {
      this.executionMethod = executionMethod;

      const newSteps = getStepsForExecutionMethod(executionMethod);
      this.setSteps(newSteps as MenuItem[]);
    },
    nextStep() {
      this.activeStepIndex++;

      return this.steps[this.activeStepIndex];
    },
    previousStep() {
      if (this.activeStepIndex === 0) {
        return this.steps[0];
      }

      this.activeStepIndex--;
      return this.steps[this.activeStepIndex];
    },
    setSteps(newSteps: MenuItem[], activeStepIndex?: number) {
      this.steps = newSteps;

      if (activeStepIndex) {
        this.activeStepIndex = activeStepIndex;
      }
    },
  },
});
