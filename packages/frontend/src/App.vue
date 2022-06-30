<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import DynamicDialog from 'primevue/dynamicdialog';
import Toast from 'primevue/toast';
</script>

<template>
  <NavBar />
  <div class="p-container pt-4">
    <DynamicDialog />
    <Toast />
    <router-view></router-view>
  </div>
</template>

<style>
@import '@/assets/base.css';
</style>
