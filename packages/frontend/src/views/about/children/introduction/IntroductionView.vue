<template>
  <IntroductionMd />
</template>

<script setup lang="ts">
import IntroductionMd from './introduction.md';
</script>

<style scoped lang="scss">
:deep() {
  @import '@/assets/markdown.scss';
}
</style>
