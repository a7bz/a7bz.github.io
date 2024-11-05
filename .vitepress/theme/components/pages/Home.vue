<template>
  <div>
    <Tab home type="category" :data="tabData" />
    <div>
      <PostList :data="postsData" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDataStore } from '@/store/index'
import Tab from '@/components/common/Tab.vue'
import PostList from '@/components/common/PostList.vue'

const dataStore = useDataStore()
const { categoryData, postsData } = storeToRefs(dataStore)

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
