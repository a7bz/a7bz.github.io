<template>
  <div>
    <Tab type="tag" :data="tabData" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import Tab from '../common/Tab.vue'
import { tagsData } from '@casual/index.js'

const data = ref(tagsData)

const tabData = computed(() => {
  return Object.keys(data.value).map(item => {
    return {
      name: item,
      count: data.value[item].length
    }
  })
})

if (import.meta.env.DEV && import.meta.hot) {
  __VUE_HMR_RUNTIME__.tagsDataUpdate = (data) => {
    data.value = data
  }
}

</script>

<style scoped></style>
