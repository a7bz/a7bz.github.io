<template>
  <div class="post-lists">
    <div v-if="data.length == 0" class="s-card">
      <Empty description="暂无内容" />
    </div>
    <div v-for="(item, index) in data" :key="index" @click="toPost(post(item)?.href)"
      :class="['post-item', 's-card', 'hover', { simple, cover: post(item).cover }]"
      :style="{ animationDelay: `${0.4 + index / 10}s` }">
      <div class="post-content">
        <div v-if="post(item)?.category" class="post-category">
          <span v-for="cat in post(item)?.category" :key="cat" class="cat-name">
            <i class="iconfont icon-folder" />
            {{ cat }}
          </span>
          <span v-if="post(item)?.top" class="top">
            <i class="iconfont icon-align-top" />
            置顶
          </span>
          <span v-if="post(item)?.star" class="star">
            <i class="iconfont icon-star" />
            星标
          </span>
        </div>
        <span class="post-title">
          <i :class="`iconfont icon-${post(item)?.icon}`" />
          {{ post(item)?.title }}
        </span>
        <span v-if="post(item)?.excerpt && !unShowExcerpt" class="post-desc markdown-main-style">
          <div class="post-excerpt" v-html="renderExcerpt(post(item)?.excerpt)" />
        </span>
        <div v-if="!simple" class="post-meta">
          <div class="post-tags">
            <span v-for="tag in post(item)?.tag" v-if="post(item)?.tag" :key="tag" class="tags-name">
              <i class="iconfont icon-hashtag" />
              {{ tag }}
            </span>
            <span class="meta">
              <div class="meta-item">
                <i class="iconfont icon-hot" />
                <span class="post-pageview" :data-path="post(item)?.href">...</span>
              </div>
              <div class="meta-item">
                <i class="iconfont icon-chat" />
                <span class="post-comment" :data-path="post(item)?.href">...</span>
              </div>
            </span>
          </div>
          <span class="post-time">{{ post(item)?.date ?
            formatTimestamp(post(item)?.date) : formatTimestamp(post(item)?.create) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, watch, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import { useData, useRouter } from 'vitepress'
import { storeToRefs } from 'pinia'
import { useDataStore } from '@/store/index'
import { formatTimestamp } from '@/scripts/helper'

const { theme, frontmatter, page } = useData()
const dataStore = useDataStore()
const { mdData } = storeToRefs(dataStore)

const props = defineProps({
  data: {
    type: Array,
    default: []
  },
  simple: {
    type: Boolean,
    default: false
  },
  unShowExcerpt: {
    type: Boolean,
    default: false
  }
})

const pageHref = ref()
const post = (item) => {
  return item.href ? mdData.value[item.href]?.post
    : mdData.value[item]?.post
}

const router = useRouter()
const toPost = (href) => {
  router.go(href)
}

const md = new MarkdownIt()
const renderExcerpt = (excerpt) => {
  return md.render(excerpt)
}

const isPost = computed(() => {
  return page.value.relativePath.startsWith('posts/')
    && !page.value.relativePath.endsWith('index.md')
})

const postMetaUpdate = async () => {
  if (typeof window === 'undefined') return
  if (isPost.value) return
  if (!frontmatter.value.comment && !theme.value.blog.pageComment) {
    console.log('waline comment')
    const { pageviewCount, commentCount } = await import('@waline/client')
    pageviewCount({
      serverURL: theme.value.plugin.comment.serverURL,
      path: pageHref.value,
      selector: '.post-pageview'
    })
    commentCount({
      serverURL: theme.value.plugin.comment.serverURL,
      path: pageHref.value,
      selector: '.post-comment',
      update: false
    })
  }
}

onMounted(() => {
  postMetaUpdate()
  pageHref.value = decodeURIComponent(window.location.pathname)
})

watch(() => router.route?.path, () => {
  pageHref.value = decodeURIComponent(window.location.pathname)
})
</script>

<style lang="scss" scoped>
:deep(.post-excerpt) {
  font-size: 12px;

  p {
    font-size: 0.8rem !important;
  }

  img {
    object-fit: contain;
    max-height: 200px !important;
  }

  h1 {
    font-size: 1.2rem !important;
    display: none;
  }

  h2 {
    font-size: 1rem !important;
    margin: 5px 0;
    padding: 0 !important;
  }
}

.post-lists {
  .post-item {
    padding: 1.6rem 2rem;
    margin-bottom: 1rem;
    animation: fade-up 0.6s 0.4s backwards;
    cursor: pointer;

    .post-content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      height: 100%;

      .post-category {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        color: var(--main-font-second-color);
        font-size: 14px;

        .cat-name {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-right: .8rem;

          .iconfont {
            opacity: 0.8;
            margin-right: 6px;
            color: var(--main-font-second-color);
          }
        }

        .top {
          margin-left: 12px;
          color: var(--main-color);

          .iconfont {
            opacity: 0.8;
            color: var(--main-color);
          }
        }

        .star {
          margin-left: 12px;
          color: var(--main-color);

          .iconfont {
            opacity: 0.8;
            color: var(--main-color);
          }
        }
      }

      .post-title {
        display: inline-block;
        font-size: 15px;
        line-height: 30px;
        font-weight: bold;
        margin: 0.8rem 0;
        transition: color 0.3s;
        display: -webkit-box;
        overflow: hidden;
        word-break: break-all;
        -webkit-box-orient: vertical;
        // -webkit-line-clamp: 2;
      }

      .post-desc {
        margin-top: -0.4rem;
        margin-bottom: 0.8rem;
        opacity: 0.8;
        line-height: 30px;
        display: -webkit-box;
        overflow: hidden;
        word-break: break-all;
        -webkit-box-orient: vertical;
        // -webkit-line-clamp: 2;
      }

      .post-meta {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        color: var(--main-font-second-color);

        .post-tags {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          opacity: 0.8;
          margin-right: 20px;
          overflow: hidden;
          mask: linear-gradient(90deg,
              #fff 0,
              #fff 90%,
              hsla(0, 0%, 100%, 0.6) 95%,
              hsla(0, 0%, 100%, 0) 100%);

          .meta {
            display: flex;
            align-items: center;
            margin-right: 10px;

            .meta-item {
              margin-right: 12px;
            }

            .iconfont {
              margin-right: 5px;
            }
          }

          .tags-name {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-right: 12px;
            white-space: nowrap;
            transition: color 0.3s;

            .iconfont {
              font-weight: normal;
              opacity: 0.6;
              margin-right: 4px;
              transition: color 0.3s;
            }

            &:hover {
              color: var(--main-color);

              .iconfont {
                color: var(--main-color);
              }
            }
          }

          @media (max-width: 768px) {
            flex-direction: column;
            align-items: flex-start;

            .tags-name {
              width: 100%;
              margin-bottom: 0.5rem; // 增加标签和元数据之间的间距
            }
          }
        }

        .post-time {
          opacity: 0.6;
          font-size: 13px;
          white-space: nowrap;
        }
      }
    }

    &.simple {
      animation: none;
      padding: 0.5rem 1.4rem;
      background-color: var(--main-card-second-background);
    }

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      .post-content {
        .post-title {
          color: var(--main-color);
        }
      }
    }

    &:active {
      transform: scale(0.98);
    }
  }
}
</style>
