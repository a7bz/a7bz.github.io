<template>
  <div>
    <ShowTab icon="hashtag" name="标签" :data="tabData" hrefKey="tag" v-if="single" />
    <div v-else>
      <Tab type="tag" :data="tabData" />
      <div>
        <PostList :data="curPostsData" />
        <Pagination :total="tagsData[params.name]?.length || 0" :page="props.page" :limit="theme.blog.pageSize" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useData } from 'vitepress'
import { storeToRefs } from 'pinia'
import Tab from '@/components/common/Tab.vue'
import ShowTab from '@/components/common/ShowTab.vue'
import PostList from '@/components/common/PostList.vue'
import Pagination from '@/components/common/Pagination.vue'
import { useDataStore } from '@/store/index'

const props = defineProps({
  single: {
    type: Boolean,
    default: false
  },
  page: {
    type: Number,
    default: 1
  }
})

const dataStore = useDataStore()
const { tagsData } = storeToRefs(dataStore)
const { params, site, theme } = useData()

onMounted(() => {
  if (params.value)
    document.title = `分类：${params.value.name} | ${site.value.title}`
})

const curPostsData = computed(() => {
  // 获取当前标签的数据
  const currentTagPosts = tagsData.value[params.value?.name] || []
  // 获取每页显示的数量
  const pageSize = theme.value.blog.pageSize
  // 计算起始和结束索引
  const start = (props.page - 1) * pageSize
  const end = start + pageSize
  // 返回当前页的数据
  return currentTagPosts.slice(start, end)
})

const tabData = computed(() => {
  return Object.keys(tagsData.value).map(item => {
    return {
      name: item,
      count: tagsData.value[item].length
    }
  }).sort((a, b) => b.count - a.count)
})
</script>

<style scoped></style>
