<script setup lang="ts">
import Navbar from './components/NavBar.vue';
</script>

<template>
  <Navbar />
  <div class="p-container pt-4">
    <router-view></router-view>
  </div>
</template>

<style>
@import '@/assets/base.css';
</style>
