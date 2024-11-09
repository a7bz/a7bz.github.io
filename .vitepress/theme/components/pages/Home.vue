<template>
  <div>
    <Tab home type="category" :data="tabData" />
    <div>
      <PostList :data="curPostsData" />
      <Pagination :total="postsData.length" :page="props.page" :limit="theme.blog.pageSize" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useData } from 'vitepress'
import { useDataStore } from '@/store/index'
import Tab from '@/components/common/Tab.vue'
import PostList from '@/components/common/PostList.vue'
import Pagination from '@/components/common/Pagination.vue'

const props = defineProps({
  page: {
    type: Number,
    default: 1
  }
})

const { theme } = useData()
const dataStore = useDataStore()
const { categoryData, postsData } = storeToRefs(dataStore)

const curPostsData = computed(() => {
  const pageSize = theme.value.blog.pageSize
  const start = (props.page - 1) * pageSize
  const end = start + pageSize
  return postsData.value.slice(start, end)
})

const tabData = computed(() => {
  return Object.keys(categoryData.value).map(item => {
    return {
      name: item,
      count: categoryData.value[item].length
    }
  }).sort((a, b) => b.count - a.count)
})

</script>

<style lang="scss" scoped></style>
