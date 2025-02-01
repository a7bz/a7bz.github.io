<template>
  <div v-if="!hasContent" class="s-card empty">
    <Empty description="暂无内容" />
  </div>
  <div :class="[frontmatter.layout || 'page', { 'has-aside': frontmatter.aside }]">
    <div class="page-content">
      <Content id="page-content" :class="['markdown-main-style', { 's-card': frontmatter.card }]" />
      <Comments class="s-card" v-if="theme.blog.pageComment || frontmatter.comment" />
    </div>
    <Aside v-if="frontmatter.aside" />
  </div>
</template>

<script setup>
import { useData, useRoute } from 'vitepress'
import { nextTick, onMounted, ref, watch } from 'vue'
import Aside from '@/components/layout/Aside/index.vue'
import Comments from '@/components/plugin/Comments/index.vue'
const { theme, frontmatter } = useData()
const route = useRoute()
const hasContent = ref(false)
const handle = () => {
  hasContent.value = false
  const content = document.querySelector('#page-content > div')
  if (content) {
    hasContent.value = content.hasChildNodes()
  }
}
onMounted(() => {
  handle()
})
watch(() => route.path, () => {
  nextTick(() => {
    handle()
  })
})
</script>

<style lang="scss" scoped>
@use "@/styles/post.scss";

.empty {
  width: 100%;
  height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page {
  width: 100%;
  display: flex;
  flex-direction: row;
  animation: fade-up 0.6s 0.1s backwards;

  .page-content {
    width: 100%;
    transition: width 0.3s;

    :deep(#main-comment) {
      width: 100%;

      .comment-content {
        .atk-list {
          .atk-list-header {
            margin-bottom: 8px;
          }

          .atk-list-comments-wrap {
            >.atk-comment-wrap {
              padding: 0.8rem;
              margin-bottom: 1rem;
              border-bottom: none;
              border-radius: 16px;
              background-color: var(--main-card-background);
              border: 1px solid var(--main-card-border);
              box-shadow: 0 8px 16px -4px var(--main-border-shadow);
            }
          }
        }
      }
    }

    .s-card {
      padding: 1rem 2rem;
    }
  }

  &.has-aside {
    animation: fade-up 0.6s 0.3s backwards;

    .page-content {
      width: calc(100% - 300px);
    }

    .main-aside {
      width: 300px;
      padding-left: 1rem;
    }
  }

  @media (max-width: 1200px) {
    .page-content {
      width: 100% !important;
    }

    .main-aside {
      display: none;
    }
  }
}
</style>
