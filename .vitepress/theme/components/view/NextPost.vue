<template>
  <div v-if="nextPostData" :class="[
    'next-post',
    's-card',
    {
      fixed: infoPosition === 'fixed',
      show: infoPosition === 'fixed' && nextPostShow && !footerIsShow,
    }]" @click="router.go(nextPostData.href)">
    <span class="post-tip">
      {{ isNextPost ? "下一篇阅读" : "阅读上一篇" }}
    </span>
    <span class="post-title">
      {{ mdData[nextPostData.href].post.title || "暂无标题" }}
    </span>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vitepress'
import { storeToRefs } from 'pinia'
import { useMainStore, useDataStore } from '@/store/index'

const observer = ref(null)
const isNextPost = ref(true)
const nextPostData = ref(null)
const nextPostShow = ref(false)

const router = useRouter()
const mainStore = useMainStore()
const dataStore = useDataStore()
const { infoPosition, footerIsShow } = storeToRefs(mainStore)
const { mdData, postsData } = storeToRefs(dataStore)

const path = computed(() => {
  if (typeof window === 'undefined') return
  return window.location.pathname
})

const geNextPostData = () => {
  if (!path.value || !postsData.value.length) return false
  const index = postsData.value.findIndex(item => item.href === path.value)
  if (index >= 0 && index < postsData.value.length - 1) {
    nextPostData.value = postsData.value[index + 1]
    isNextPost.value = true
    return true
  } else if (index > 0) {
    nextPostData.value = postsData.value[index - 1]
    isNextPost.value = false
    return true
  }
  nextPostData.value = null
  return false
}

const isShowNext = () => {
  const postDom = document.getElementById("page-content")
  if (!postDom) return false
  if (observer.value) observer.value?.disconnect()
  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      nextPostShow.value = entry.isIntersecting ? false : true
    })
  })
  observer.value?.observe(postDom)
}

watch(() => router.route.path, () => {
  geNextPostData()
  isShowNext()
})

onMounted(() => {
  geNextPostData()
  isShowNext()
})

onBeforeUnmount(() => {
  if (observer.value) observer.value?.disconnect()
})

</script>

<style lang="scss" scoped>
.next-post {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: var(--main-card-background);

  .post-tip {
    font-size: 14px;
    color: var(--main-font-second-color);
    padding-bottom: 8px;
    margin-bottom: 12px;
    border-bottom: 1px dashed var(--main-card-border);
    transition: color 0.3s;
  }

  .post-title {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &.fixed {
    position: fixed;
    right: 20px;
    bottom: 20px;
    opacity: 0;
    z-index: 100;
    width: 300px;
    transform: translateY(180px);
  }

  &.show {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    background-color: var(--main-color);
    border-color: var(--main-color);
    color: var(--main-card-background);
    box-shadow: 0 8px 16px -4px var(--main-color-bg);

    .post-tip {
      opacity: 0.8;
      color: var(--main-card-background);
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
}
</style>
