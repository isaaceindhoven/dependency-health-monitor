<template>
  <div class="grid">
    <div v-if="calculationInProgress" class="col-12 align-items-center flex flex-column">
      <p class="text-center mb-5">
        Financial health calculation is in progress. Please wait, this may take up to x minutes...
      </p>
      <ProgressSpinner />
    </div>
    <div v-else class="col-12">
      <DataTable
        @value-change="valueChange"
        @page="pageChange"
        :rows="pageSize"
        :paginator="true"
        :value="dependencies"
        :scrollable="true"
        scrollHeight="450px"
        responsiveLayout="scroll"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} dependencies"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      >
        <template #header>
          <div class="table-header">
            NPM dependency list
            <Button
              @click="executeFinancialHealthReportOnPage"
              label="Execute financial health report on all dependencies on this page"
            />
          </div>
        </template>
        <Column
          v-for="col of dataTableColumns"
          :field="col.field"
          :header="col.header"
          :sortable="col.sortable"
          :data-type="col.dataType"
          :key="(col.field as string)"
        ></Column>
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
import { useFinancialReportStore } from '@/stores/financial-report';
import type { DataTablePageEvent } from 'primevue/datatable';
import type { ColumnProps } from 'primevue/column';
import type { FinancialHealthScoreCalculationResult } from '@dependency-health-monitor/financial-health-calculator/src/types/score/financial-health-score-calculation-result';
import type { EquityScore } from '@dependency-health-monitor/equity-score-calculator/src/types/equity-score';

const pageSize = 10;
const dataTableColumns: Ref<ColumnProps[]> = ref([
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
]);
const executedHealthReports: Record<string, any>[] = [];

let dependencies: Ref<Record<string, unknown>[]> = ref([]);
let calculationInProgress = ref(true);
let newDataTableValues: Record<string, unknown>[] = [];
let currentPageValues: Record<string, unknown>[] = [];
let currentPage = 1;

onMounted(() => {
  const financialStore = useFinancialReportStore();
  const packageJSON = financialStore.getPackageJSON;

  fetchNPMDependenciesForPackageJSON(packageJSON).then((data: Record<string, number>) => {
    dependencies.value = Object.keys(data).map((dependency) => ({
      dependency,
      occurrence: data[dependency],
    }));
    calculationInProgress.value = false;
    currentPageValues = Object.values(dependencies.value).slice(0, 10);
  });
});

const updateCurrentPageValues = () => {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * pageSize;
  currentPageValues = Object.values(newDataTableValues).slice(startIndex, endIndex);
};

const valueChange = (valueChange: Record<string, unknown>[]) => {
  newDataTableValues = valueChange;
  updateCurrentPageValues();
};

const pageChange = (event: DataTablePageEvent) => {
  currentPage = event.page + 1;
  updateCurrentPageValues();
};

const executeFinancialHealthReportOnPage = async () => {
  for (const value of currentPageValues) {
    const dependencyName = value.dependency as string;
    const financialHealthCalculation = await executeFinancialHealthReport(dependencyName);

    const financialHealthReport: FinancialHealthScoreCalculationResult =
      financialHealthCalculation.financialHealthReport;
    const equityReport: EquityScore = financialHealthCalculation.equityReport;

    executedHealthReports.push({
      dependency: dependencyName,
      financialHealthReport,
      equityReport,
    });

    const index = dependencies.value.findIndex((val) => val.dependency === dependencyName);
    dependencies.value[index]['financialHealthScore'] = financialHealthReport.finalScore;
    dependencies.value[index]['equityScore'] = equityReport.severity;

    if (dataTableColumns.value.length == 2) {
      addFinancialHealthAndEquityColumns();
    }
  }
};

const addFinancialHealthAndEquityColumns = () => {
  dataTableColumns.value.push(
    {
      field: 'financialHealthScore',
      header: 'Financial health score',
      dataType: 'numeric',
    },
    {
      field: 'equityScore',
      header: 'Equity score',
    },
  );
};
</script>

<style scoped></style>
