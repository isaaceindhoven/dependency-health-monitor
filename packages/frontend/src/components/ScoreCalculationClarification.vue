<template>
  <DataTable :value="calculationResults" responsiveLayout="scroll">
    <Column field="topic" header="Topic"></Column>
    <Column field="score" header="Score"></Column>
    <Column field="explanation" header="Explanation">
      <template #body="slotProps">
        <span v-for="(line, index) in slotProps.data.explanation.split(/\n/g)" :key="index">
          {{ line }}
          <br />
        </span>
      </template>
    </Column>
  </DataTable>
  <Toast />
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Toast from 'primevue/toast';
import { ref, inject, onMounted, type Ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import type { FinancialHealthScoreCalculationResult } from '@dependency-health-monitor/financial-health-calculator/src/types/score/financial-health-score-calculation-result';
import type { EquityScore } from '@dependency-health-monitor/equity-score-calculator/src/types/equity-score';

interface CalculationResults {
  topic: string;
  score: number | string;
  explanation: string;
}

interface FinancialHealthCalculationResults {
  financialHealthReport: FinancialHealthScoreCalculationResult;
  equityReport: EquityScore;
}

interface DialogRef {
  content: Record<string, unknown>;
  options: Record<string, unknown>;
  data: FinancialHealthCalculationResults;
}

const dialogRef = inject<Ref<DialogRef>>('dialogRef');
const calculationResults = ref<CalculationResults[]>([]);

onMounted(() => {
  if (!dialogRef) {
    const toast = useToast();
    toast.add({
      severity: 'error',
      summary: 'A problem occurred',
      detail: 'DialogRef is empty. Please create a GitHub issue.',
      life: 3000,
    });

    return;
  }
  const data = dialogRef.value.data;
  const financialHealthReport = data.financialHealthReport;
  const equityReport = data.equityReport;
  const resultsToText: CalculationResults[] = [];

  for (const scoreKey of Object.keys(financialHealthReport)) {
    if (scoreKey === 'finalScore') {
      continue;
    }
    const splitScoreKeys = scoreKey.replace(/([A-Z])/g, ' $1');
    const scoreKeyText = splitScoreKeys.charAt(0).toUpperCase() + splitScoreKeys.slice(1);
    resultsToText.push({
      topic: scoreKeyText,
      // @ts-ignore: Object.keys(financialHealthReport) ensures that the key is in the financialHealthReport object
      score: financialHealthReport[scoreKey].weightedScore,
      // @ts-ignore: Object.keys(financialHealthReport) ensures that the key is in the financialHealthReport object
      explanation: financialHealthReport[scoreKey].explanation,
    });
  }

  resultsToText.push({
    topic: 'Equity score',
    score: equityReport.severity,
    explanation: equityReport.explanation,
  });

  calculationResults.value = resultsToText;
});
</script>
