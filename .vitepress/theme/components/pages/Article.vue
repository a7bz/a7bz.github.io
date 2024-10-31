<template>
  <div class="archives s-card">
    <div class="title">
      <div class="item" :class="tab == 0 ? 'activate' : ''" @click="tab = 0">
        <h1 class="name">全部文章</h1>
        <sup v-if="postsData?.length" class="num">{{ postsData.length }}</sup>
      </div>
      <div class="item" :class="tab == 1 ? 'activate' : ''" @click="tab = 1">
        <h1 class="name">星标文章</h1>
        <sup v-if="starData?.length" class="num">{{ starData.length }}"></sup>
      </div>
    </div>
    <div class="archives-list">
      <PostList v-show="tab == 0" :data="postsData" un-show-excerpt />
      <PostList v-show="tab == 1" :data="starData" un-show-excerpt />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDataStore } from '@/store/index'
import PostList from '../common/PostList.vue'

const tab = ref(0)
const dataStore = useDataStore()
const { postsData, starData } = storeToRefs(dataStore)

</script>

<style lang="scss" scoped>
.archives {
  padding: 2rem;

  .title {
    display: flex;
    margin-bottom: 1rem;
    justify-content: center;

    .activate {
      color: var(--main-color);
    }

    .item {
      display: flex;
      margin-left: 20px;

      .name {
        margin: 0;
        border-bottom: none;
        font-size: 1.5rem;
      }

      .num {
        margin-left: 8px;
        font-size: 0.8rem;
        font-weight: bold;
        opacity: 0.6;
      }
    }
  }

  .archives-list {
    .year-list {
      margin-bottom: 2rem;

      .year {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: 6px;
        padding-left: 12px;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 1rem;

        &::before {
          content: "";
          position: absolute;
          left: 0;
          width: 4px;
          height: 70%;
          background-color: var(--main-color);
          border-radius: 8px;
        }
      }

      .posts {
        .posts-item {
          padding: 20px;
          margin-bottom: 1rem;

          .title {
            margin-bottom: 16px;
            font-size: 18px;
            font-weight: bold;
            transition: color 0.3s;
          }

          .tags {
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            align-items: center;
            opacity: 0.6;

            .type-item {
              font-size: 14px;
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-right: 8px;

              .name {
                transition: color 0.3s;
              }

              .iconfont {
                margin-right: 2px;
                transition: color 0.3s;
              }

              &:hover {

                .name,
                .iconfont {
                  color: var(--main-color);
                }
              }
            }
          }

          &:last-child {
            margin-bottom: 0;
          }

          &:hover {
            .title {
              color: var(--main-color);
            }
          }
        }
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
