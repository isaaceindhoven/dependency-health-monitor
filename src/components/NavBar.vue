<script setup lang="ts">
import Menubar from 'primevue/menubar';
import type { MenuItem } from 'primevue/menuitem';

let items: MenuItem[] = [
  {
    label: 'Run report',
    to: '/run-report/select',
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
      <a class="text-900 no-underline pl-3 pr-8" href="#"> DPM </a>
    </template>
    <template #end> Log in / log out </template>
  </Menubar>
</template>

<style scoped></style>
