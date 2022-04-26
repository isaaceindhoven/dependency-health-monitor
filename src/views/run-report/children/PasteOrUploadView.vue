<template>
  <div class="grid">
    <div class="col-6">
      <TextArea class="package-json-input" v-model="inputValue" placeholder="Paste your package.json here" />
    </div>
    <div class="col-1 text-center flex align-items-center justify-content-center">
      <p class="text-2xl">or</p>
    </div>
    <div class="col-5">
      <FileUpload class="h-full" accept=".json" :fileLimit="1" :customUpload="true" @uploader="fileUploaded">
        <template #empty>
          <p class="text-center">
            Drag and drop file here to upload or click the button above and select the file to upload.
          </p>
        </template>
      </FileUpload>
    </div>
  </div>
</template>

<script setup lang="ts">
import TextArea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';

import type { FileUploadUploaderEvent } from 'primevue/fileupload';

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
      console.log(value);
    })
    .catch((err) => console.error(err));
};

let inputValue = '';
</script>

<style lang="scss" scoped>
.package-json-input {
  width: 100%;
  height: 100%;
  font-family: monospace;
}
</style>
