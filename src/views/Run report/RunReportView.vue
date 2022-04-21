<template>
  <ExecutionSteps class="mb-8" />
  <router-view v-slot="{ Component }" @prevPage="prevPage($event)" @nextPage="nextPage($event)">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
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

<script setup>
import Button from 'primevue/button';
import ExecutionSteps from '@/components/ExecutionSteps.vue';
import { useFinancialReportStore } from '@/stores/financial-report';
import { useRouter } from 'vue-router';

const store = useFinancialReportStore();
const router = useRouter();

const nextPage = () => {
  const nextStep = store.nextStep();
  router.push(nextStep.to);
};

const prevPage = () => {
  const prevStep = store.previousStep();
  router.push(prevStep.to);
};
</script>

<style lang="scss" scoped></style>
