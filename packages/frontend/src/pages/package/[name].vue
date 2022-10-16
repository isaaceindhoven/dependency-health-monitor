<template>
  <div>
    <DataTable :value="data" responsiveLayout="scroll">
      <Column field="name" header="Name"></Column>
      <Column field="quantity" header="Quantity"></Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

interface PackageResponse {
  packages: Record<string, any>;
}

const router = useRouter();
const packageName = router.currentRoute.value.params.name;
if (!packageName) createError('No package name provided');
const url = '/api/run-report/' + packageName;
const { data } = await useFetch<PackageResponse>(url);
</script>
