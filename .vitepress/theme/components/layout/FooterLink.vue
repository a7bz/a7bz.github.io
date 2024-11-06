<template>
  <div class="footer-link">
    <div class="footer-social">
      <div v-for="(item, index) in btnData" :key="index">
        <a :href="item.link" v-if="index < btnData.length / 2" target="_blank" class="social-link">
          <i :class="`iconfont icon-${item.icon}`"></i>
        </a>
      </div>
      <div class="logo" title="返回顶部">
        <img :src="theme.logo" alt="author" class="author" />
      </div>
      <div v-for="(item, index) in btnData" :key="index">
        <a :href="item.link" v-if="index >= btnData.length / 2" target="_blank" class="social-link" rel="noreferrer">
          <i :class="`iconfont icon-${item.icon}`"></i>
        </a>
      </div>
    </div>
    <div class="footer-sitemap">
      <div v-for="(item, index) in footer.sitemap" :key="index" class="sitemap-item">
        <span class="title">{{ item.text }}</span>
        <div class="links">
          <a v-for="(link, linkIndex) in item.items" :key="linkIndex" :href="link.link" class="link-text"
            :target="link.newTab ? '_blank' : null">{{ link.text }}</a>
        </div>
      </div>
      <!-- 随机友链 -->
      <div class="sitemap-item">
        <span class="title friends">
          友链
          <i class="iconfont icon-refresh" />
        </span>
        <div v-if="randomFriends?.length" class="links">
          <a v-for="(link, linkIndex) in randomFriends" :key="linkIndex" :href="link.url" target="_blank"
            class="link-text" rel="noreferrer">
            {{ link.name || link.title }}
          </a>
          <a href="/pages/link" class="link-text"> 更多 </a>
        </div>
        <div v-else class="links">
          <span class="link-text"> 暂无友链 </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
import { ref, computed, onMounted } from 'vue'
const { theme } = useData()
const { footer } = theme.value

const randomFriends = ref([])

const btnData = computed(() => {
  if (footer.btn.length % 2 == 0) {
    return footer.btn
  } else {
    footer.btn.splice(footer.btn.length, 0, {
      icon: 'home',
      link: '/'
    })
    return footer.btn
  }
})

const getRandomFriends = () => {
  fetch(theme.value.blog.friendsLink).then(res => res.json()).then(data => {
    let tmpLink = data.content || []
    tmpLink = tmpLink.filter(item => {
      return item.url.replace(/\/+$/, '') !== theme.value.site.replace(/\/+$/, '')
    })
    randomFriends.value = tmpLink.length >= 4 ? shuffleArray(tmpLink).slice(0, 3) : tmpLink
  })
}

onMounted(() => {
  getRandomFriends()
})
</script>

<style lang="scss" scoped>
.footer-link {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: row;
  margin: 1rem auto;
  margin-bottom: 3rem;
  padding: 0 1rem;
  animation: show 0.3s backwards;

  .footer-bar {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;

    .site-title {
      font-weight: bold;
      font-size: 22px;
    }

    .site-desc {
      margin: 0.6rem 0;
      font-weight: bold;
      font-size: 18px;
      color: var(--main-font-second-color);
    }

    .to-home {
      padding: 8px 16px;
      border-radius: 25px;
      margin-top: 8px;
      font-size: 14px;
      color: var(--main-font-color);
      background-color: var(--main-card-second-background);
      border: 1px solid var(--main-card-border);
      transition:
        color 0.3s,
        transform 0.3s,
        border-color 0.3s,
        background-color 0.3s;
      cursor: pointer;

      &:hover {
        color: var(--main-card-background);
        background-color: var(--main-color);
        transform: scale(1.1);
        border-color: var(--main-color);
      }
    }
  }

  .footer-social {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;

    .social-link {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      margin: 1rem 26px;
      border-radius: 50%;
      background-color: var(--main-font-color);
      transition:
        transform 0.3s,
        background-color 0.3s;

      .iconfont {
        font-size: 20px;
        color: var(--main-card-background);
      }

      &:hover {
        transform: scale(1.15);
        background-color: var(--main-color);
      }

      &:active {
        transform: scale(1);
      }
    }

    .logo {
      width: 60px;
      height: 60px;
      margin: 0 1rem;
      transition: transform 0.3s;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
      }

      &:hover {
        transform: scale(1.2);
      }

      &:active {
        transform: scale(1);
      }
    }

    @media (max-width: 768px) {
      .logo {
        display: none;
      }
    }
  }

  .footer-sitemap {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 1rem 0;

    .sitemap-item {
      min-width: 120px;

      .title {
        display: inline-block;
        margin: 1rem 0 0.7rem;
        font-size: 16px;
        font-weight: bold;
        margin-left: 8px;
        color: var(--main-font-second-color);

        &.friends {
          display: flex;
          flex-direction: row;
          align-items: center;
          cursor: pointer;

          .iconfont {
            font-weight: normal;
            margin-left: 6px;
            opacity: 0.8;
            color: var(--main-font-second-color);
            transition: color 0.3s;

            &:hover {
              color: var(--main-color);
            }
          }
        }
      }

      .links {
        display: flex;
        flex-direction: column;

        .link-text {
          color: var(--main-font-color);
          display: inline-block;
          max-width: 120px;
          width: max-content;
          margin: 4px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow-wrap: break-word;
          padding: 8px;
          border-radius: 12px;
          transition:
            color 0.3s,
            background-color 0.3s;
          cursor: pointer;

          &:hover {
            color: var(--main-color);
            background-color: var(--main-color-bg);
          }
        }
      }
    }
  }
}
</style>
