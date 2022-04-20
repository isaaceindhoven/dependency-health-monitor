<template>
  <div class="grid justify-content-center">
    <!-- <SelectButton v-model="selectedOption" :options="options" optionLabel="text" optionValue="name" /> -->
    <div class="col-4" v-for="option in options" :key="option.name">
      <SelectButtonCard :name="option.name" :text="option.text" v-model="selectedOption" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SelectButton from 'primevue/selectbutton';
import SelectButtonCard from '../components/SelectButtonCard.vue';

let selectedOption = ref('GitHub');
const options = [
  {
    name: 'GitHub',
    text: 'Log in and select a repository',
  },
  {
    name: 'Upload',
    text: 'Upload or paste a package.json',
  },
  {
    name: 'Public URL',
    text: 'Run report using public repository URL',
  },
];

const printNewValue = (newValue) => {
  selectedOption.value = newValue;
};
</script>

<style lang="scss" scoped></style>
