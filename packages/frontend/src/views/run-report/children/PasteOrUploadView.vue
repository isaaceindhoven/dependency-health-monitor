<template>
  <div class="grid">
    <div class="p-fileupload p-fileupload-advanced p-component col-12">
      <div class="p-fileupload-buttonbar flex justify-content-between align-items-center">
        <span>Paste or upload package.json file</span>
        <FileUpload
          ref="fileUploadRef"
          mode="basic"
          @uploader="customUpload"
          @clear="resetUploadedFileCount"
          :fileLimit="1"
          :customUpload="true"
          :auto="true"
          chooseLabel="Upload"
          accept=".json"
        />
      </div>
      <div class="p-fileupload-content">
        <TextArea
          @blur="onBlur"
          class="package-json-input"
          v-model="inputValue"
          placeholder="Paste your package.json here"
          rows="30"
        />
        <span class="p-error" v-if="pasteOrUploadError">{{ pasteOrUploadError }}</span>
      </div>
    </div>
  </div>
  <div class="grid grid-nogutter justify-content-end">
    <Button
      :disabled="!allowAdvance"
      @click="advanceToResultsView"
      label="Submit & Execute report"
      icon="pi pi-angle-right"
      icon-pos="right"
    />
  </div>
</template>

<script setup type="module" lang="ts">
import { ref, onMounted } from 'vue';
import type { FileUploadUploaderEvent } from 'primevue/fileupload';

import TextArea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import Button from 'primevue/button';

import { useFinancialReportStore } from '@/stores/financial-report';
import { parsePackageJSONStringToObject } from '@/helpers/json-parser';
import { useRouter } from 'vue-router';

const router = useRouter();
const financialReportStore = useFinancialReportStore();
const allowAdvance = ref(false);
const fileUploadRef = ref();

let inputValue = ref(JSON.stringify(financialReportStore.getPackageJSON, undefined, 2));
let pasteOrUploadError = ref('');

onMounted(() => {
  if (financialReportStore.getPackageJSON && Object.keys(financialReportStore.getPackageJSON).length > 0) {
    allowAdvance.value = true;
  }
});

const customUpload = (uploadEvent: FileUploadUploaderEvent) => {
  let file: File;

  if (uploadEvent.files instanceof File) {
    file = uploadEvent.files;
  } else {
    file = uploadEvent.files[0];
  }

  file
    .text()
    .then((value) => {
      const result = parsePackageJSONStringToObject(value);
      pasteOrUploadError.value = '';

      inputValue.value = JSON.stringify(result, undefined, 2);
      financialReportStore.setPackageJSON(result);
      allowAdvance.value = true;
    })
    .catch((err) => {
      pasteOrUploadError.value = err;
      allowAdvance.value = false;
    });
};

const resetUploadedFileCount = () => {
  fileUploadRef.value.uploadedFileCount = 0;
}

const onBlur = () => {
  try {
    const result = parsePackageJSONStringToObject(inputValue.value);
    pasteOrUploadError.value = '';

    financialReportStore.setPackageJSON(result);
    allowAdvance.value = true;
  } catch (error: any) {
    pasteOrUploadError.value = error;
    allowAdvance.value = false;
  }
};

const advanceToResultsView = () => {
  router.push('/financial-report');
};
</script>

<style lang="scss" scoped>
.package-json-input {
  width: 100%;
  height: 100%;
  font-family: monospace;
  resize: none;
}
</style>
