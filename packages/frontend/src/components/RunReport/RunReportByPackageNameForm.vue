<template>
  <form action="/api/run-report/package-name" method="post">
    <div class="flex flex-column gap-2">
      <label for="packageName">Package name</label>
      <div class="p-inputgroup">
        <AutoComplete
          v-model="packageName"
          :inputProps="{ id: 'packageName', name: 'packageName' }"
          :suggestions="searchResults"
          @complete="searchPackage"
          optionLabel="label"
        />
        <Button type="submit" label="Run report" />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button/Button.vue';
import AutoComplete, { AutoCompleteCompleteEvent } from 'primevue/autocomplete';
import { NpmsIO } from 'npms.io';

const npmsIO = new NpmsIO();
const packageName = ref('');
const searchResults = ref([]);

async function searchPackage(event: AutoCompleteCompleteEvent) {
  const searchPackageResults = await npmsIO.api.search.searchPackage(event.query);

  const orderedSearchResults = [...searchPackageResults.results].sort((a, b) => {
    if (a.searchScore > b.searchScore) return -1;
    if (a.searchScore < b.searchScore) return 1;
    return 0;
  });

  searchResults.value = orderedSearchResults.map(({ package: { name } }) => ({
    label: name,
    value: name,
  }));
}
</script>
