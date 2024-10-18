<template>
  <div>
    <ShowTab icon="folder" name="分类" :data="tabData" hrefKey="category" v-if="single" />
    <div v-else>
      <Tab home type="category" :data="tabData" />
      <PostList :data="categoryData[params.name]" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useData } from 'vitepress'
import { storeToRefs } from 'pinia'
import ShowTab from '../common/ShowTab.vue'
import Tab from '../common/Tab.vue'
import PostList from '../common/PostList.vue'
import { useDataStore } from '@/store/index'
const props = defineProps({
  single: {
    type: Boolean,
    default: false
  }
})
const dataStore = useDataStore()
const { categoryData } = storeToRefs(dataStore)
const { params, site } = useData()

onMounted(() => {
  if (params.value)
    document.title = `分类：${params.value.name} | ${site.value.title}`
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

<style scoped></style>
