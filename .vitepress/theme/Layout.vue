<template>
  <!-- 背景 -->
  <BackGround />

  <Nav />

  <main :class="['mian-layout', { 'is-post': isPost }]">
    <WelcomeBox v-if="page.filePath == 'index.md'" />
    <template v-if="!page.isNotFound">
      <post v-if="isPost" />
      <page v-if="isPage" />
    </template>
    <NotFound v-else></NotFound>
  </main>

  <FooterLink />
  <Footer />

  <Teleport to="body">
    <div :class="['left-menu', { hidden: footerIsShow }]">
      <Player />
    </div>
  </Teleport>

  <RightMenu ref="rightMenuRef" />
  <Loading v-if="!page.isNotFound" />
  <Message />

</template>

<script setup>
import { useData } from 'vitepress'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from "pinia"
import { useMainStore, useDataStore } from "@/store/index"
import { calculateScroll } from './scripts/helper'
import BackGround from './components/layout/BackGround.vue'
import Nav from './components/layout/NavBar.vue'
import NotFound from './components/pages/NotFound.vue'
import Post from './components/view/Post.vue'
import Page from './components/view/Page.vue'
import FooterLink from './components/layout/FooterLink.vue'
import Footer from './components/layout/Footer.vue'
import WelcomeBox from './components/view/WelcomeBox.vue'
import Loading from './components/common/Loading.vue'
import RightMenu from './components/common/RightMenu.vue'
import Message from './components/common/Message.vue'
import Player from './components/layout/Widget/Player.vue'

const store = useMainStore()
const { fontFamily, fontSize, backgroundType, themeType, themeValue } = storeToRefs(store)
const { page } = useData()

const footerIsShow = false
const changeSiteFont = () => {
  try {
    const htmlElement = document.documentElement
    htmlElement.classList.remove("lxgw", "hmos")
    htmlElement.classList.add(fontFamily.value)
    htmlElement.style.fontSize = fontSize.value + "px"
  } catch (error) {
    console.error("切换系统字体样式失败", error)
  }
}

const isPost = computed(() => {
  return page.value.relativePath.startsWith('posts/')
    && !page.value.relativePath.endsWith('index.md')
})

const isPage = computed(() => {
  return page.value.relativePath.startsWith('pages/') || page.value.relativePath.startsWith('page/')
    || page.value.relativePath.endsWith('index.md')
})

const copyTip = () => {
  const copiedText = window.getSelection().toString()
  // 检查文本内容是否不为空
  if (copiedText.trim().length > 0 && typeof $message !== "undefined") {
    $message.success("复制成功，在转载时请标注本文地址")
  }
}


onMounted(() => {
  changeSiteFont()
  changeSiteThemeType()
  window.addEventListener("scroll", calculateScroll)
  window.addEventListener("contextmenu", openRightMenu)
  window.addEventListener("copy", copyTip)
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", changeSiteThemeType)
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", calculateScroll)
  window.removeEventListener("contextmenu", openRightMenu)
})


const rightMenuRef = ref(null)

const openRightMenu = (e) => {
  rightMenuRef.value?.openRightMenu(e)
}

watch(() => [themeType.value, backgroundType.value], () => changeSiteThemeType(),)

const changeSiteThemeType = () => {
  // 主题 class
  const themeClasses = { dark: "dark", light: "light", auto: "auto", }
  // 必要数据
  const htmlElement = document.documentElement
  // 清除所有 class
  Object.values(themeClasses).forEach((themeClass) => {
    htmlElement.classList.remove(themeClass)
  })
  // 添加新的 class
  if (themeType.value === "auto") {
    // 根据当前操作系统颜色方案更改明暗主题
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const autoThemeClass = systemPrefersDark ? themeClasses.dark : themeClasses.light
    htmlElement.classList.add(autoThemeClass)
    themeValue.value = autoThemeClass
  } else if (themeClasses[themeType.value]) {
    htmlElement.classList.add(themeClasses[themeType.value])
    themeValue.value = themeClasses[themeType.value]
  }
  if (backgroundType.value === "image") htmlElement.classList.add("image")
  else htmlElement.classList.remove("image")
}

const dataStore = useDataStore()
const { categoryData, mdData, postsData, starData, tagsData } = storeToRefs(dataStore)

if (import.meta.env.DEV && import.meta.hot) {
  __VUE_HMR_RUNTIME__.categoryDataUpdate = (data) => {
    categoryData.value = {}
    Object.assign(categoryData.value, data)
  }
  __VUE_HMR_RUNTIME__.mdDataUpdate = (data) => {
    mdData.value = {}
    Object.assign(mdData.value, data)
  }
  __VUE_HMR_RUNTIME__.postsDataUpdate = (data) => {
    postsData.value = []
    Object.assign(postsData.value, data)
  }
  __VUE_HMR_RUNTIME__.starDataUpdate = (data) => {
    starData.value = []
    Object.assign(starData.value, data)
  }
  __VUE_HMR_RUNTIME__.tagsDataUpdate = (data) => {
    tagsData.value = {}
    Object.assign(tagsData.value, data)
  }
}
</script>

<style lang="scss" scoped>
.mian-layout {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  // 手动实现加载动画
  animation: show 0.5s forwards;
  animation-duration: 0.5s;
  display: block;

  &.loading {
    display: none;
  }

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;

    &.is-post {
      padding: 0;
    }
  }
}

.left-menu {
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 1002;
  transition:
    opacity 0.3s,
    transform 0.3s;

  &.hidden {
    opacity: 0;
    transform: translateY(100px);
  }
}
</style>