<template>
  <div>
    <ShowTab icon="folder" name="分类" :data="tabData" hrefKey="category" v-if="single" />
    <Tab type="category" :data="tabData" v-else />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import { categoryData } from '@casual/index.js'
import ShowTab from '../common/ShowTab.vue'
import Tab from '../common/Tab.vue'

const props = defineProps({
  single: {
    type: Boolean,
    default: false
  }
})

const curData = ref(categoryData)

const { params, site } = useData()

if(params.value)
  document.title = `分类：${params.value.name} | ${site.value.title}`

const tabData = computed(() => {
  return Object.keys(curData.value).map(item => {
    return {
      name: item,
      count: curData.value[item].length
    }
  }).sort((a, b) => b.count - a.count)
})

if (import.meta.env.DEV && import.meta.hot) {
  __VUE_HMR_RUNTIME__.categoryDataUpdate = (data) => {
    Object.assign(curData.value, data)
  }
}

</script>

<style scoped></style>
