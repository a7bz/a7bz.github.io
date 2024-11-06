<template>
    <div>
        <LinkList :listData="link" useFriendsLink />
    </div>
</template>

<script setup>
import { useData } from 'vitepress'
import { ref, onMounted } from 'vue'
import LinkList from '@/components/common/LinkList.vue'

const { theme } = useData()
const link = ref([])

onMounted(() => {
    fetch(theme.value.blog.friendsLink).then(res => res.json()).then(data => {
        link.value = data.content
        console.log(data)
    })
})
</script>

<style scoped></style>
