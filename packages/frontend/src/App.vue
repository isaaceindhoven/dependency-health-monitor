<script setup lang="ts">
import DynamicDialog from 'primevue/dynamicdialog/DynamicDialog.vue';
import Toast from 'primevue/toast';
import NavBar from './components/NavBar.vue';
</script>

<template>
  <div>
    <NavBar />
    <div class="p-container pt-4">
      <DynamicDialog />
      <Toast />
      <NuxtPage />
    </div>
  </div>
</template>
