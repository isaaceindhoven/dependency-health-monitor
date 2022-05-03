<template>
  <div class="grid justify-content-center">
    <div class="col-4" v-for="option in executionOptions" :key="option.name">
      <SelectButtonCard :name="option.name" :text="option.text" v-model="selectedOption" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SelectButtonCard from '@/components/SelectButtonCard.vue';

import { ref, watch } from 'vue';
import { useStepperStore } from '@/stores/stepper';
import { executionOptions } from '@/helpers/execution-options';
import type { ExecutionMethod } from '@/helpers/types';

const store = useStepperStore();

let selectedOption = ref<ExecutionMethod>('Upload');

watch(selectedOption, (newVal) => {
  store.setExecutionMethod(newVal);
});
</script>

<style lang="scss" scoped></style>
