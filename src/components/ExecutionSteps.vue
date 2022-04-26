<template>
  <Steps :model="store.getSteps" />
</template>

<script setup lang="ts">
import Steps from 'primevue/steps';
import { useStepperStore } from '@/stores/stepper';

const store = useStepperStore();
</script>

<style lang="scss" scoped></style>
