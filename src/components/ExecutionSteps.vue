<template>
  <Steps :model="store.getSteps" />
</template>

<script setup lang="ts">
import Steps from 'primevue/steps';
import { useFinancialReportStore } from '@/stores/financial-report';

const store = useFinancialReportStore();
</script>

<style lang="scss" scoped></style>
