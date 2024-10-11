<template>
  <!-- 背景 -->
  <BackGround />
  <Nav />

  <main :class="['mian-layout']">
    <Home v-if="frontmatter.home" />
    <template v-if="!page.isNotFound">
      <post v-if="page.relativePath.startsWith('posts/') && !page.relativePath.endsWith('index.md')" />
      <page v-if="page.relativePath.startsWith('pages/') || page.relativePath.endsWith('index.md')" />
    </template>
    <NotFound v-else></NotFound>
  </main>

</template>

<script setup>
import { onMounted } from 'vue';
import BackGround from './components/layout/BackGround.vue'
import Nav from './components/layout/NavBar.vue'
import NotFound from './components/pages/NotFound.vue'
import Home from './components/pages/Home.vue'
import Post from './components/view/Post.vue'
import Page from './components/view/Page.vue'
import { useData } from 'vitepress'

import { storeToRefs } from "pinia"
import { mainStore } from "@/store"

const store = mainStore()
const { fontFamily, fontSize } = storeToRefs(store)
const { site, theme, page, frontmatter } = useData()

// 切换系统字体样式
const changeSiteFont = () => {
  try {
    console.log(fontFamily.value)
    const htmlElement = document.documentElement
    htmlElement.classList.remove("lxgw", "hmos")
    htmlElement.classList.add(fontFamily.value)
    htmlElement.style.fontSize = fontSize.value + "px"
  } catch (error) {
    console.error("切换系统字体样式失败", error)
  }
};

onMounted(() => {
  changeSiteFont()
})
</script>

<style scoped></style>
