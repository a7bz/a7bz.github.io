<template>
  <div>
    <ShowTab icon="hashtag" name="标签" :data="tabData" hrefKey="tag" v-if="single" />
    <div v-else>
      <Tab type="tag" :data="tabData" />
      <PostList :data="curData[params.name]" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import { tagsData } from '@casual/index.js'
import Tab from '../common/Tab.vue'
import ShowTab from '../common/ShowTab.vue'
import PostList from '../common/PostList.vue'

const props = defineProps({
  single: {
    type: Boolean,
    default: false
  }
})

const curData = ref(tagsData)

const { params,site } = useData()

if(params.value)
  document.title = `标签：${params.value.name} | ${site.value.title}`

const tabData = computed(() => {
  return Object.keys(curData.value).map(item => {
    return {
      name: item,
      count: curData.value[item].length
    }
  }).sort((a, b) => b.count - a.count)
})

if (import.meta.env.DEV && import.meta.hot) {
  __VUE_HMR_RUNTIME__.tagsDataUpdate = (data) => {
    Object.assign(curData.value, data)
  }
}


</script>

<style scoped></style>
