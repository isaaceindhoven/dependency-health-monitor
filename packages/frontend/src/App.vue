<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import DynamicDialog from 'primevue/dynamicdialog';
import Toast from 'primevue/toast';
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
