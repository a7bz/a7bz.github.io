<template>
  <!-- 背景 -->
  <BackGround />
  <Nav />


  <template v-if="!page.isNotFound">
    <content />
  </template>
  <NotFound v-else></NotFound>
</template>

<script setup>
import { onMounted } from 'vue';
import BackGround from './components/layout/BackGround.vue'
import Nav from './components/layout/NavBar.vue'
import NotFound from './components/pages/NotFound.vue'
import { useData } from 'vitepress'

import { storeToRefs } from "pinia"
import { mainStore } from "@/store"

const store = mainStore()
const { fontFamily, fontSize } = storeToRefs(store)
const { site, theme, page } = useData()

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
