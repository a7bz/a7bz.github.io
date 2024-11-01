<template>
  <link rel="stylesheet" href="/assets/css/waline.css">
  <div ref="commentRef" id="comment-dom" :class="['comment-container', 'waline']" />
</template>

<script setup>
import { useData } from 'vitepress'
import { onMounted, ref } from 'vue'

const { theme } = useData()
const commentRef = ref(null)

onMounted(async () => {
  const { init } = await import('@waline/client')
  const waline = init({
    el: '#comment-dom',
    ...theme.value.plugin.comment
  })
})
</script>

<style lang="scss">
#comment-dom,
.comment-content {
  --waline-theme-color: var(--main-color) !important;
  --waline-active-color: #556AF1 !important;
}

.wl-header {
  label {
    font-size: 1rem !important;
  }
}
</style>

<style lang="scss" scoped>

</style>
