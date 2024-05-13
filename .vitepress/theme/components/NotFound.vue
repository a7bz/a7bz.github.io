<template>
  <div>
    {{ page }}
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
const { site, theme, page } = useData()

</script>

<style scoped></style>
