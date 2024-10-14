<template>
  <div>
    <WelcomeBox />
    <Tab home type="category" :data="tabData" />
    <div>
      <PostList :data="curPosts" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { postsData, categoryData } from '@casual/index'
import Tab from '../common/Tab.vue'
import PostList from '../common/PostList.vue'
import WelcomeBox from '../view/WelcomeBox.vue'

const curData = ref(categoryData)
const curPosts = ref(postsData)

const tabData = computed(() => {
  return Object.keys(curData.value).map(item => {
    return {
      name: item,
      count: curData.value[item].length
    }
  }).sort((a, b) => b.count - a.count)
})

if (import.meta.env.DEV && import.meta.hot) {
  __VUE_HMR_RUNTIME__.postsDataUpdate = (data) => {
    Object.assign(curPosts.value, data)
  }
}

</script>

<style lang="scss" scoped></style>
