<template>
  <div v-if="Object.keys(financialReportState.packageJSON).length === 0" class="grid">
    <h4>Please <a href="/run-report">upload or paste your package.json</a> first!</h4>
  </div>
  <div v-else class="grid">
    <div v-if="calculationInProgress" class="col-12 align-items-center flex flex-column">
      <p class="text-center mb-5">
        Financial health calculation is in progress. Please wait, this may take up to x minutes...
      </p>
      <ProgressSpinner />
    </div>
    <div v-else class="col-12">
      <DataTable
        :rows="pageSize"
        :paginator="true"
        :value="dependencies"
        :scrollable="true"
        scroll-height="450px"
        responsive-layout="scroll"
        current-page-report-template="Showing {first} to {last} of {totalRecords} dependencies"
        paginator-template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        @value-change="valueChange"
        @page="pageChange"
      >
        <template #header>
          <div class="flex justify-content-between align-items-center">
            <h4>Dependencies found for {{ financialReportState.packageJSON.name }}</h4>
            <Button
              v-if="financialReportStatus === FinancialReportStatus.NotExecuted"
              label="Execute financial health report on this page"
              @click="executeFinancialHealthReportOnPage"
            />
            <Button
              v-else-if="financialReportStatus === FinancialReportStatus.InProgress"
              label="In progress"
              icon="pi pi-spin pi-spinner"
              disabled
            />
            <Button
              v-else-if="financialReportStatus === FinancialReportStatus.Finished"
              class="p-button-success"
              label="Financial report already executed for this page"
              icon="pi pi-check"
              disabled
            />
          </div>
        </template>
        <Column
          v-for="col of dataTableColumns"
          :key="(col.field as string)"
          :field="col.field"
          :header="col.header"
          :sortable="col.sortable"
          :data-type="col.dataType"
        ></Column>
        <Column
          v-if="showExtraInformationColumn"
          header-style="width: 4rem; text-align: center"
          body-style="text-align: center; overflow: visible"
          header="Calculation clarification"
        >
          <template #body="{ data }">
            <Button
              v-if="executedHealthReports.has(data.dependency)"
              class="p-button-rounded p-button-text p-button-secondary"
              type="button"
              icon="pi pi-angle-right"
              @click="() => moreInformationClicked(data.dependency)"
            ></Button>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { ref, onMounted, type Ref } from 'vue';
import { fetchNPMDependenciesForPackageJSON } from '@/services/fetch-dependencies';
import { executeFinancialHealthReport } from '@/services/execute-financial-health-report';
import { useFinancialReportState } from '@/composables/financial-report';
import { useDialog } from 'primevue/usedialog';
import type { DataTablePageEvent } from 'primevue/datatable';
import type { ColumnProps } from 'primevue/column';
import type { FinancialHealthScoreCalculationResult } from '@dependency-health-monitor/financial-health-calculator/src/types/score/financial-health-score-calculation-result';
import type { EquityScore } from '@dependency-health-monitor/equity-score-calculator/src/types/equity-score';
import ScoreCalculationClarificationVue from '../../components/ScoreCalculationClarification.vue';

type RateLimitLeft = {
  remaining: number;
  reset: number;
};

type FinancialHealthReportResponse = {
  financialHealthReport: FinancialHealthScoreCalculationResult;
  equityReport: EquityScore;
  rateLimitLeft: RateLimitLeft;
};

enum FinancialReportStatus {
  NotExecuted = 1,
  InProgress,
  Finished,
  Failure,
}

const pageSize = 5;
const standardColumns: ColumnProps[] = [
  {
    field: 'dependency',
    header: 'Dependency',
    sortable: true,
  },
  {
    field: 'occurrence',
    header: 'Occurrence',
    dataType: 'numeric',
    sortable: true,
  },
];
const dataTableColumns: Ref<ColumnProps[]> = ref(standardColumns);
const executedHealthReports: Ref<Map<string, FinancialHealthReportResponse>> = ref(new Map());
const showExtraInformationColumn = ref(false);
const dependencies: Ref<Record<string, unknown>[]> = ref([]);
const calculationInProgress = ref(true);
const financialReportState = useFinancialReportState();
const financialReportStatus = ref(FinancialReportStatus.NotExecuted);

let newDataTableValues: Record<string, unknown>[] = [];
let currentPageValues: Record<string, unknown>[] = [];
let currentPage = 1;

onMounted(() => {
  const { packageJSON } = financialReportState.value;

  fetchNPMDependenciesForPackageJSON(packageJSON).then((data: Record<string, number>) => {
    dependencies.value = Object.keys(data).map((dependency) => ({
      dependency,
      occurrence: data[dependency],
    }));
    calculationInProgress.value = false;
    currentPageValues = Object.values(dependencies.value).slice(0, pageSize);
  });
});

const showFinancialHealthAndEquityColumns = () => {
  showExtraInformationColumn.value = true;
  dataTableColumns.value = [
    ...standardColumns,
    {
      field: 'financialHealthScore',
      header: 'Financial health score',
      dataType: 'numeric',
    },
    {
      field: 'equityScore',
      header: 'Equity score',
    },
  ];
};

const updateCurrentPageValues = () => {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * pageSize;
  currentPageValues = Object.values(newDataTableValues).slice(startIndex, endIndex);
};

const resetColumns = () => {
  showExtraInformationColumn.value = false;
  dataTableColumns.value = standardColumns;
};

const updateColumns = () => {
  let noReportExecutedCount = 0;

  currentPageValues.forEach((value) => {
    if (!executedHealthReports.value.has(value.dependency as string)) {
      noReportExecutedCount = +noReportExecutedCount;
    }
  });

  if (noReportExecutedCount === pageSize) {
    financialReportStatus.value = FinancialReportStatus.NotExecuted;
    resetColumns();
  } else {
    financialReportStatus.value = FinancialReportStatus.Finished;
    showFinancialHealthAndEquityColumns();
  }
};

const valueChange = (value: Record<string, unknown>[]) => {
  newDataTableValues = value;
  updateCurrentPageValues();
  updateColumns();
};

const pageChange = (event: DataTablePageEvent) => {
  currentPage = event.page + 1;
  updateCurrentPageValues();
  updateColumns();
};

const executeFinancialHealthReportOnPage = async () => {
  financialReportStatus.value = FinancialReportStatus.InProgress;

  currentPageValues.forEach((value) => {
    const dependencyName = value.dependency as string;
    if (executedHealthReports.value.has(dependencyName)) return;

    executeFinancialHealthReport(dependencyName).then((calculationResponse: FinancialHealthReportResponse) => {
      executedHealthReports.value.set(dependencyName, calculationResponse);

      const { financialHealthReport } = calculationResponse;
      const { equityReport } = calculationResponse;

      const index = dependencies.value.findIndex((val) => val.dependency === dependencyName);
      dependencies.value[index].financialHealthScore = financialHealthReport.finalScore;
      dependencies.value[index].equityScore = equityReport.severity;

      if (dataTableColumns.value.length === 2) {
        showFinancialHealthAndEquityColumns();
      }

      financialReportStatus.value = FinancialReportStatus.Finished;
    });
  });
};

const moreInformationClicked = (packageName: string) => {
  const dialog = useDialog();
  const calculationReport = executedHealthReports.value.get(packageName);

  dialog.open(ScoreCalculationClarificationVue, {
    props: {
      header: 'Score calculation clarification',
      modal: true,
    },
    data: {
      financialHealthReport: calculationReport?.financialHealthReport,
      equityReport: calculationReport?.equityReport,
    },
  });
};
</script>
