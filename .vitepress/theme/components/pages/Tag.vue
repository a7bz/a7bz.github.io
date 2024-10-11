<template>
  <div>
    <Tab type="tag" :data="tabData" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Tab from '../layout/Tab.vue'
import { tagsData } from '@casual/index.js'

const tabData = computed(() => {
  const tmp = Object.keys(tagsData).map(item => {
    return {
      name: item,
      count: tagsData[item].length
    }
  })
  console.log(tmp)
  return tmp
})


</script>

<style scoped></style>
