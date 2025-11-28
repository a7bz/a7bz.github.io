<template>
    <div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(async () => {
    const { RecentComments } = await import('@waline/client')
    RecentComments({
        serverURL: 'https://waline.a7bz.cn',
        count: 5
    }).then(({ comments }) => {
    })
})
</script>

<style scoped></style>
