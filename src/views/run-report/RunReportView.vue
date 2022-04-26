<template>
  <ExecutionSteps class="mb-6" />
  <router-view></router-view>
  <div class="grid grid-nogutter justify-content-end pt-4">
    <Button v-if="store.getActiveStepIndex > 0" label="Back" @click="prevPage()" icon="pi pi-angle-left" />
    <Button
      v-if="store.getActiveStepIndex < store.getSteps.length"
      label="Next"
      class="ml-2"
      icon="pi pi-angle-right"
      icon-pos="right"
      :disabled="!store.getAllowAdvance"
      @click="nextPage()"
    />
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import ExecutionSteps from '@/components/ExecutionSteps.vue';
import { useStepperStore } from '@/stores/stepper';
import { useRouter } from 'vue-router';

const store = useStepperStore();
const router = useRouter();

const nextPage = () => {
  const nextStep = store.nextStep();
  const allowAdvanceForNextStep = store.getActiveStepIndex + 1 < store.getMaxAllowedStepIndex;

  store.setAllowAdvance(allowAdvanceForNextStep);
  router.push(nextStep.to || '/');
};

const prevPage = () => {
  const prevStep = store.previousStep();
  store.setAllowAdvance(true);
  router.push(prevStep.to || '/');
};
</script>

<style lang="scss">
.p-menuitem-link {
  padding: 1rem;
}
</style>
