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
        :rows="10"
        :paginator="true"
        :value="dependencies"
        :rowsPerPageOptions="[10, 20, 50]"
        responsiveLayout="scroll"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} dependencies"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      >
        <Column field="dependency" header="Dependency" sortable></Column>
        <Column field="occurrence" header="Occurrence" sortable dataType="numeric"></Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner';
import { ref, onMounted, type Ref } from 'vue';
import { fetchNPMDependenciesForPackageJSON } from '@/services/fetch-depencies';
import { useFinancialReportStore } from '@/stores/financial-report';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

let dependencies: Ref<Record<string, unknown>[]> = ref([]);
let calculationInProgress = ref(true);

onMounted(() => {
  const financialStore = useFinancialReportStore();
  const packageJSON = financialStore.getPackageJSON;

  fetchNPMDependenciesForPackageJSON(packageJSON).then((data: Record<string, number>) => {
    console.log(data);

    dependencies.value = Object.keys(data).map((dependency) => ({
      dependency,
      occurrence: data[dependency],
    }));
    calculationInProgress.value = false;
  });
});
</script>

<style scoped></style>
