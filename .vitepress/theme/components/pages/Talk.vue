<template>
    <div class="s-card">
        <div id="qexoDaoDao"></div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { loadScript } from '@/scripts/tool'

onMounted(() => {
    loadScript("https://cdn.jsdelivr.net/gh/Uyoahz26/daodao@main/dist/qexo-dao.min.js", {
        async: true,
        reload: true,
    }).then(() => {
        qexoDaodao?.init({
            el: "#qexoDaoDao",
            avatar: "https://q1.qlogo.cn/g?b=qq&nk=2484068670&s=640",
            name: "荒芜",
            limit: 10,
            useLoadingImg: false,
            baseURL: "https://qexo.a7bz.cn/",
        }).then(function () {
            console.log("qexoDaodao加载完成");
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
