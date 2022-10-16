<template>
  <form action="/api/run-report/package-name" method="post" @submit="submitForm">
    <div class="flex flex-column gap-2">
      <label for="packageName">Package name</label>
      <div class="p-inputgroup">
        <AutoComplete
          v-model="packageNameAutoComplete"
          :input-props="{ id: 'packageName', name: 'packageName' }"
          :suggestions="searchResults"
          :class="{
            'p-invalid': errors.packageName,
          }"
          option-label="label"
          @complete="searchPackage"
        />
        <Button type="submit" label="Run report" />
      </div>
      <small v-if="errors.packageName" id="packageNameHelp" class="p-error">
        {{ errors.packageName }}
      </small>
    </div>
  </form>
</template>

<script setup lang="ts">
import Button from 'primevue/button/Button.vue';
import AutoComplete, { AutoCompleteCompleteEvent } from 'primevue/autocomplete';
import { NpmsIO } from 'npms.io';
import { useField, useForm } from 'vee-validate';
import { toFormValidator } from '@vee-validate/zod';
import { RunReportByPackageNameRequestModel } from '@/models/run-report/package-name';

const npmsIO = new NpmsIO();
const packageNameAutoComplete = ref<{ label: string; value: string }>();
const searchResults = ref([]);

const { submitForm, errors } = useForm({
  validationSchema: toFormValidator(RunReportByPackageNameRequestModel),
});
const { value: packageNameValue } = useField('packageName', {
  initialValue: '',
});

watch(packageNameAutoComplete, (value) => {
  packageNameValue.value = value.value;
});

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
