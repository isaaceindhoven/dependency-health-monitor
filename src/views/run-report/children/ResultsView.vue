<template>
  <div class="grid">
    <div v-if="calculationInProgress" class="col-12 align-items-center flex flex-column">
      <p class="text-center mb-5">
        Financial health calculation is in progress. Please wait, this may take up to x minutes...
      </p>
      <ProgressSpinner />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner';
import { ref } from 'vue';

let calculationInProgress = ref(true);
</script>

<style scoped></style>
