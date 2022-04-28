<template>
  <div class="grid">
    <div class="col-6">
      <TextArea
        @blur="onBlur"
        class="package-json-input"
        v-model="inputValue"
        placeholder="Paste your package.json here"
        rows="30"
      />
      <span class="p-error" v-if="textInputError">{{ textInputError }}</span>
    </div>
    <div class="col-1 text-center flex align-items-center justify-content-center">
      <p class="text-2xl">or</p>
    </div>
    <div class="col-5 align-items-center flex">
      <FileUpload accept=".json" :fileLimit="1" :customUpload="true" @uploader="fileUploaded">
        <template #empty>
          <p class="text-center">
            Drag and drop file here to upload or click the button above and select the file to upload.
          </p>
        </template>
      </FileUpload>
      <span class="p-error" v-if="uploadError">{{ uploadError }}</span>
    </div>
  </div>
</template>

<script setup type="module" lang="ts">
import { ref, onMounted } from 'vue';
import type { FileUploadUploaderEvent } from 'primevue/fileupload';

import TextArea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';

import { useStepperStore } from '@/stores/stepper';
import { useFinancialReportStore } from '@/stores/financial-report';
import { parsePackageJSONStringToObject } from '@/helpers/json-parser';

const stepStore = useStepperStore();
const financialReportStore = useFinancialReportStore();

let inputValue = ref(JSON.stringify(financialReportStore.getPackageJSON, undefined, 2));
let textInputError = ref('');
let uploadError = ref('');

onMounted(() => {
  if (financialReportStore.getPackageJSON && Object.keys(financialReportStore.getPackageJSON).length > 0) {
    stepStore.setAllowAdvance(true);
  }
});

const fileUploaded = (uploadEvent: FileUploadUploaderEvent) => {
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

      if (result.status === 'Success') {
        uploadError.value = '';

        inputValue.value = JSON.stringify(result.value, undefined, 2);
        financialReportStore.setPackageJSON(result.value);
        stepStore.setAllowAdvance(true);
      } else {
        uploadError.value = result.value;
      }
    })
    .catch((err) => console.error(err));
};

const onBlur = () => {
  const result = parsePackageJSONStringToObject(inputValue.value);

  if (result.status === 'Success') {
    textInputError.value = '';

    financialReportStore.setPackageJSON(result.value);
    stepStore.setAllowAdvance(true);
  } else {
    textInputError.value = result.value;
  }
};
</script>

<style lang="scss" scoped>
.package-json-input {
  width: 100%;
  height: 100%;
  font-family: monospace;
}
</style>
