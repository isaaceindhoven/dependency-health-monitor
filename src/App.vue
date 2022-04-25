<script setup lang="ts">
import NavBar from './components/NavBar.vue';
</script>

<template>
  <NavBar />
  <div class="p-container pt-4">
    <router-view></router-view>
  </div>
</template>

<style>
@import '@/assets/base.css';
</style>
