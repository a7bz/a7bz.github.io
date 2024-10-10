<template>
  <!-- 背景 -->
  <BackGround />
  <NavBar />


  <template v-if="!page.isNotFound">
    <content />
  </template>
  <NotFound v-else></NotFound>
</template>

<script setup>
import BackGround from './components/layout/BackGround.vue'
import NavBar from './components/layout/NavBar.vue'
import NotFound from './components/pages/NotFound.vue'
import { useData } from 'vitepress'

const { site, theme, page } = useData()

</script>

<style scoped></style>
