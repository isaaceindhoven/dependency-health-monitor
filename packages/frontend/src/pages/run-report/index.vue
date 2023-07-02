<template>
  <TabView class="p-tabview">
    <TabPanel header="By package name">
      <RunReportByPackageNameForm />
    </TabPanel>
    <TabPanel header="By text input" :disabled="true">
      <span>Paste your package.json here</span>
      <TextArea v-model="inputValue" class="package-json-input" rows="30" @blur="onBlur" />
    </TabPanel>
    <TabPanel header="By upload" :disabled="true">
      <span>Paste or upload package.json file</span>
      <FileUpload
        ref="fileUploadRef"
        mode="basic"
        :file-limit="1"
        :custom-upload="true"
        :auto="true"
        choose-label="Upload"
        accept=".json"
        @uploader="customUpload"
        @clear="resetUploadedFileCount"
      />
    </TabPanel>
  </TabView>
</template>

<script setup type="module" lang="ts">
import { ref, onMounted } from 'vue';
import type { FileUploadUploaderEvent } from 'primevue/fileupload';
import TextArea from 'primevue/textarea/Textarea.vue';
import FileUpload from 'primevue/fileupload/FileUpload.vue';
import { parsePackageJSONStringToObject } from '@/helpers/json-parser';
import { useFinancialReportState } from '@/composables/financial-report';

import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

const financialReportState = useFinancialReportState();
const allowAdvance = ref(false);
const fileUploadRef = ref();

const inputValue = ref(JSON.stringify(financialReportState.value.packageJSON, undefined, 2));
const pasteOrUploadError = ref('');

onMounted(() => {
  if (financialReportState.value.packageJSON && Object.keys(financialReportState.value.packageJSON).length > 0) {
    allowAdvance.value = true;
  }
});

const customUpload = (uploadEvent: FileUploadUploaderEvent) => {
  let file: File;

  if (uploadEvent.files instanceof File) {
    file = uploadEvent.files;
  } else {
    [file] = uploadEvent.files;
  }

  file
    .text()
    .then((value) => {
      const result = parsePackageJSONStringToObject(value);
      pasteOrUploadError.value = '';

      inputValue.value = JSON.stringify(result, undefined, 2);
      financialReportState.value.packageJSON = result;
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

    financialReportState.value.packageJSON = result;
    allowAdvance.value = true;
  } catch (error: any) {
    pasteOrUploadError.value = error;
    allowAdvance.value = false;
  }
};
</script>

<style lang="scss" scoped>
.package-json-input {
  width: 100%;
  height: 100%;
  font-family: monospace;
  resize: none;
}

.p-tabview::v-deep {
  .p-tabview-nav {
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
  }

  .p-tabview-title {
    font-weight: 600;
    font-size: 0.875rem;
  }
}
</style>
