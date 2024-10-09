<template>
  <template v-if="!page.isNotFound">
    <content />
  </template>
  <NotFound v-else></NotFound>
</template>

<script setup>
import NotFound from './components/NotFound.vue'
import { useData } from 'vitepress'
const { site, theme, page } = useData()
</script>

<style scoped></style>
