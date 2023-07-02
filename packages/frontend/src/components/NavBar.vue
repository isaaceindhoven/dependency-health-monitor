<script setup lang="ts">
import Menubar from 'primevue/menubar/Menubar.vue';
import type { MenuItem } from 'primevue/menuitem';

const items: MenuItem[] = [
  {
    label: 'Run report',
    to: '/run-report',
  },
  {
    label: 'About us',
    to: '/about',
  },
];
</script>

<template>
  <Menubar class="border-noround" :model="items">
    <template #start>
      <a class="text-900 no-underline pl-3 pr-8" href="/">DPM</a>
    </template>
  </Menubar>
</template>
