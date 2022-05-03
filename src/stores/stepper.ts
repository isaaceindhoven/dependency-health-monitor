import { defineStore } from 'pinia';
import { getStepsForExecutionMethod } from '@/helpers/steps-per-execution-method';

import type { MenuItem } from 'primevue/menuitem';
import type { ExecutionMethod, StepsStore } from '@/helpers/types';

const defaultStore: StepsStore = {
  executionMethod: 'Upload',
  steps: getStepsForExecutionMethod('Upload') as MenuItem[],
  activeStepIndex: 0,
  maxAllowedStepIndex: 0,
  allowAdvance: true,
};

export const useStepperStore = defineStore({
  id: 'steps',
  state: () => defaultStore,
  getters: {
    getSteps: (state) => state.steps,
    getExecutionMethod: (state) => state.executionMethod,
    getActiveStepIndex: (state) => state.activeStepIndex,
    getAllowAdvance: (state) => state.allowAdvance,
    getMaxAllowedStepIndex: (state) => state.maxAllowedStepIndex,
  },
  actions: {
    setExecutionMethod(executionMethod: ExecutionMethod) {
      this.executionMethod = executionMethod;

      const newSteps = getStepsForExecutionMethod(executionMethod);
      this.setSteps(newSteps as MenuItem[]);
    },
    nextStep() {
      if (this.activeStepIndex < this.steps.length - 1) {
        this.activeStepIndex++;

        if (this.activeStepIndex > this.maxAllowedStepIndex) {
          this.maxAllowedStepIndex = this.activeStepIndex;
        }
      }

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
    setAllowAdvance(newState: boolean) {
      this.allowAdvance = newState;
    },
  },
});
