<script setup lang="ts">
import Menubar from 'primevue/menubar';
import { MenuItem } from 'primevue/menuitem';

let items: MenuItem[] = [
  {
    label: 'Run report',
    to: '#',
  },
  {
    label: 'About us',
    to: '#',
  },
];
</script>

<template>
  <Menubar class="border-noround" :model="items">
    <template #start>
      <a class="text-900 no-underline mr-7" href="#"> DPM </a>
    </template>
    <template #end> Log in / log out </template>
  </Menubar>
</template>

<style scoped></style>
