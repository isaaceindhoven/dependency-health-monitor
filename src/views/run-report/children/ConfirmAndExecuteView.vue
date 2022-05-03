<template>
  <div class="grid">
    <div class="col-12">
      <TextArea v-model="packageJSON" class="w-full" rows="30" disabled />
    </div>
  </div>
</template>

<script setup lang="ts">
import TextArea from 'primevue/textarea';
import { useFinancialReportStore } from '@/stores/financial-report';
import { ref, onMounted } from 'vue';
import { useStepperStore } from '@/stores/stepper';

const store = useFinancialReportStore();
const stepStore = useStepperStore();

const packageJSON = ref(JSON.stringify(store.getPackageJSON, undefined, 2));

onMounted(() => {
  const advanceAllowed = stepStore.getMaxAllowedStepIndex >= stepStore.getActiveStepIndex;
  stepStore.setAllowAdvance(advanceAllowed);
});
</script>

<style scoped></style>
