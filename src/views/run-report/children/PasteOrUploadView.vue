<template>
  <!-- <div class="grid">
    <div class="col-12">
      <Editor v-model="inputValue" />
    </div>
    <div class="col-12 text-3xl text-center">or</div>
    <div class="col-12">
      <FileUpload accept=".json" :fileLimit="1" :customUpload="true" @uploader="fileUploaded">
        <template #empty>
          <p class="text-center">
            Drag and drop file here to upload or click the button above and select the file to upload.
          </p>
        </template>
      </FileUpload>
    </div>
  </div> -->
  <div class="grid">
    <div class="col-7">
      <Editor class="h-full" v-model="inputValue" editorStyle="height: 320px" />
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
import Editor from 'primevue/editor';
import FileUpload from 'primevue/fileupload';

import type { FileUploadUploaderEvent } from 'primevue/fileupload';

const editorToolbarOptions = [[{ font: ['Monospace'] }], ['blockquote', 'code-block']];

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

<style lang="scss" scoped></style>
