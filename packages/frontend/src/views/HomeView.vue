<template>
  <div class="grid pt-6">
    <div class="col-6">
      <h1 class="text-6xl line-height-2 font-semibold mb-2">
        <a href="#">Help improve Open-Source sustainability!</a>
      </h1>
      <h4 class="text-2xl font-light mb-4">
        A lot of Open-Source projects suffer from financial sustainability and face the risk of not getting maintained
        due to a lack of resources. Use the Dependency Health Monitor to view the financial state of your dependencies
        and support your dependency!
      </h4>
      <a class="p-button p-component no-underline" href="/run-report/select">
        <span class="pi pi-heart p-button-icon p-button-icon-left"></span
        ><span class="p-button-label">Execute the report!</span>
      </a>
    </div>
    <div id="help-improve" class="col-6">
      <IconHelpImproveVue />
      <div class="flex justify-content-center">
        <a
          class="p-button p-component p-button-text no-underline"
          href="https://storyset.com/people"
          target="_blank"
          rel="noopener noreferer"
        >
          <span class="pi pi-external-link p-button-icon p-button-icon-left mr-3"></span
          ><span class="p-button-label">People illustrations by Storyset</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import IconHelpImproveVue from '@/components/icons/IconHelpImprove.vue';
</script>

<style lang="scss" scoped></style>
