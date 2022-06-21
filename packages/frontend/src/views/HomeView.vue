<template>
  <div class="grid pt-6">
    <div class="col-6">
      <h1 class="text-6xl line-height-2 font-semibold mb-2">Help improve Open-Source sustainability!</h1>
      <h4 class="text-2xl font-light mb-4">
        A lot of Open-Source projects suffer from financial sustainability and face the risk of not getting maintained
        due to a lack of resources. Use the Dependency Health Monitor to view the financial state of your dependencies
        and support your dependency!
      </h4>
      <Button @click="redirectToExecuteReportPage" label="Execute the report!" icon="pi pi-heart" />
    </div>
    <div id="help-improve" class="col-6">
      <img v-if="darkMode" src="@/assets/help-improve-dark.svg" />
      <img v-else src="@/assets/help-improve-light.svg" />
      <div class="flex justify-content-center">
        <Button
          @click="openStorySetPage"
          label="People illustrations by Storyset"
          class="p-button-text"
          icon="pi pi-external-link"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import Button from 'primevue/button';
import { ref } from 'vue';

const darkMode = ref(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

const redirectToExecuteReportPage = () => {
  router.push({ path: '/run-report/select' });
};

const openStorySetPage = () => {
  window.open('https://storyset.com/people');
};
</script>

<style lang="scss" scoped></style>
