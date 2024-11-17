<template>
  <div class="hello s-card" @mouseleave="resetHello">
    <span class="tip" @click="changeHello">{{ helloText }}</span>
    <div class="content">
      <div class="site-logo">
        <img :src="theme.logo" alt="logo" class="logo-img" />
      </div>
      <div class="site-desc">
        {{ theme.description }}
      </div>
    </div>
    <div class="info">
      <div class="name">
        <span class="author">{{ theme.title }}</span>
        <span class="desc">{{ theme.description }}</span>
      </div>
      <div class="site-data">
        <div class="data-item">
          <div @click="pageJump('/pages/article')">
            <div class="data-name">文章</div>
            <div class="data-num">{{ postsData.length }}</div>
          </div>
        </div>
        <div class="data-item">
          <div @click="pageJump('/pages/category')">
            <div class="data-name">分类</div>
            <div class="data-num">{{ Object.keys(categoryData).length }}</div>
          </div>
        </div>
        <div class="data-item">
          <div @click="pageJump('/pages/tag')">
            <div class="data-name">标签</div>
            <div class="data-num">{{ Object.keys(tagsData).length }}</div>
          </div>
        </div>
      </div>
      <div class="link">
        <a v-for="(item, index) in theme.social" :key="index" target="_blank" class="social-link" :href="item.link"
          rel="noreferrer">
          <i :class="`iconfont icon-${item.icon}`"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useData, useRouter } from 'vitepress'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { getGreetings } from '@/scripts/helper'
import { useDataStore, useMainStore } from '@/store'

const store = useMainStore()
const dataStore = useDataStore()
const router = useRouter()
const { postsData, tagsData, categoryData } = storeToRefs(dataStore)
const { theme } = useData()
const helloClick = ref(0)
const helloTimeOut = ref(null)
const helloText = ref(getGreetings())
const resetHello = () => {
  helloClick.value = 0
  if (isHasUser()) return false
  helloText.value = getGreetings()
}

const pageJump = (path) => {
  if (!path) return false
  if (window.matchMedia("(max-width: 768px)").matches)
    store.changeShowStatus("mobileMenuShow")
  router.go(path)
}

const changeHello = () => {
  clearTimeout(helloTimeOut.value)
  helloClick.value++
  if (helloClick.value === 1) {
    helloText.value = "点这里干什么？"
  } else if (helloClick.value === 2) {
    helloText.value = "怎么还点？"
  } else if (helloClick.value === 3) {
    helloText.value = "那你点吧！"
  } else if (helloClick.value === 100) {
    helloText.value = "怎么还在点？？？"
  } else {
    helloText.value = `x ${helloClick.value - 3}`
  }
  helloTimeOut.value = setTimeout(() => {
    resetHello()
  }, 3000)
}


// 是否具有用户
const isHasUser = () => {
  // 检查本地存储
  const userData = localStorage.getItem("ArtalkUser")
  if (!userData) return false
  // 获取用户数据
  const { nick } = JSON.parse(userData)
  const hello = ["很高兴见到你", "好久不见", "欢迎回来"]
  // 随机问候语
  helloText.value = hello[Math.floor(Math.random() * hello.length)] + "，" + nick
  return true
}

onMounted(() => {
  isHasUser()
})

onBeforeUnmount(() => {
  clearTimeout(helloTimeOut.value)
})

</script>

<style lang="scss" scoped>
.hello {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--main-color);
  color: var(--main-card-background);
  border: none;

  .tip {
    display: inline-block;
    min-width: 140px;
    text-align: center;
    padding: 6px 12px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: bold;
    background-color: var(--main-color-opacity);
    margin-bottom: 12px;
    transition:
      color 0.3s,
      transform 0.3s,
      background-color 0.3s;

    &:hover {
      transform: scale(1.1);
      color: var(--main-font-color);
      background-color: var(--main-card-background);
    }

    &:active {
      transform: scale(1);
    }
  }

  .content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 150px;

    .site-logo {
      position: absolute;
      width: 130px;
      height: 130px;
      transition:
        transform cubic-bezier(0.69, 0.39, 0, 1.21) 0.3s,
        opacity cubic-bezier(0.69, 0.39, 0, 1.21) 0.3s;
      transform-origin: bottom;

      .logo-img {
        width: 130px;
        height: 130px;
        border: 5px solid white;
        border-radius: 50%;
      }
    }

    .site-desc {
      padding: 10px;
      display: block;
      height: 100%;
      margin-top: 20px;
      font-size: 1.1rem;
      line-height: 1.5;
      opacity: 0;
      transition: opacity 0.3s;
    }
  }

  .info {
    width: 100%;
    margin-top: 20px;

    .name {
      display: flex;
      flex-direction: column;
      text-align: center;

      .author {
        font-weight: bold;
        font-size: 20px;
      }

      .desc {
        font-size: 12px;
        opacity: 0.6;
      }
    }

    .site-data {
      text-align: center;
      display: table;
      table-layout: fixed;
      width: 100%;
      margin-top: 1rem;

      .data-item {
        display: table-cell;
        position: relative;

        &:not(:last-child)::after {
          opacity: .8;
          position: absolute;
          content: "";
          width: 2px;
          right: 0;
          height: 70%;
          background: var(--main-card-background);
          top: 15%
        }

        .data-name {
          color: var(--main-card-background) !important;
        }

        .data-num {
          color: var(--main-card-background) !important;
        }
      }
    }

    .link {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-top: 10px;

      .social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        margin-left: 12px;
        background-color: var(--main-color-opacity);
        border-radius: 50%;

        .iconfont {
          font-size: 22px;
          color: var(--main-card-background);
        }

        &:first-child {
          margin-left: 0;
        }

        &:hover {
          transform: scale(1.1);
          background-color: var(--main-card-background);

          .iconfont {
            color: var(--main-font-color);
          }
        }
      }
    }
  }

  &:hover {
    .content {
      .site-logo {
        opacity: 0;
        transform: scale(0);
      }

      .site-desc {
        opacity: 1;
      }
    }
  }
}
</style>
