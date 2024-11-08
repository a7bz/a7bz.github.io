<template>
    <div v-if="theme.value?.blog?.qexo" class="s-card">
        <div id="qexoDaoDao"></div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useData } from 'vitepress'
import { loadScript } from '@/scripts/tool'

const { theme } = useData()

onMounted(() => {
    if (!theme.value?.blog?.qexo) return
    loadScript("https://cdn.jsdelivr.net/gh/Uyoahz26/daodao@main/dist/qexo-dao.min.js", {
        async: true,
        reload: true,
    }).then(() => {
        qexoDaodao?.init({
            el: "#qexoDaoDao",
            avatar: theme.value?.siteData.author.cover,
            name: theme.value?.siteData.author.name,
            limit: 10,
            useLoadingImg: false,
            baseURL: theme.value?.blog.qexo,
        }).then(() => {

        })
    })
})
</script>

<style lang="scss" scoped>
.s-card {
    padding: 20px;
}

.xk-card-name {
    .avatar {
        .avatar-img {
            border-radius: 25% !important;

        }
    }
}

.icon-article:before {
    content: "\e61e" !important;
}
</style>
