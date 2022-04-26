<template>
  <ExecutionSteps class="mb-6" />
  <router-view @prevPage="prevPage()" @nextPage="nextPage()"></router-view>
  <div class="grid grid-nogutter justify-content-end pt-4">
    <Button v-if="store.getActiveStepIndex > 0" label="Back" @click="prevPage()" icon="pi pi-angle-left" />
    <Button
      label="Next"
      class="ml-2"
      icon="pi pi-angle-right"
      icon-pos="right"
      v-if="store.getActiveStepIndex < store.getSteps.length"
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
  router.push(nextStep.to || '/');
};

const prevPage = () => {
  const prevStep = store.previousStep();
  router.push(prevStep.to || '/');
};
</script>

<style lang="scss">
.p-menuitem-link {
  padding: 1rem;
}
</style>
