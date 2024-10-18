<template>
  <div>
    <ShowTab icon="hashtag" name="标签" :data="tabData" hrefKey="tag" v-if="single" />
    <div v-else>
      <Tab type="tag" :data="tabData" />
      <PostList :data="tagsData[params.name]" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useData } from 'vitepress'
import { storeToRefs } from 'pinia'
import Tab from '../common/Tab.vue'
import ShowTab from '../common/ShowTab.vue'
import PostList from '../common/PostList.vue'
import { useDataStore } from '@/store/index'

const props = defineProps({
  single: {
    type: Boolean,
    default: false
  }
})

const dataStore = useDataStore()
const { tagsData } = storeToRefs(dataStore)
const { params, site } = useData()

onMounted(() => {
  if (params.value)
    document.title = `分类：${params.value.name} | ${site.value.title}`
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
