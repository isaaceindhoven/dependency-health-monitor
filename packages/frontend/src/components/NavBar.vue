<script setup lang="ts">
import Menubar from 'primevue/menubar';
import type { MenuItem } from 'primevue/menuitem';

let items: MenuItem[] = [
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
      <a class="text-900 no-underline pl-3 pr-8" href="/"> DPM </a>
    </template>
  </Menubar>
</template>

<style scoped></style>
