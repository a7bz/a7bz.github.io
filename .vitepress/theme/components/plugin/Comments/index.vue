<template>
    <div ref="mainCommentRef" id="main-comment" class="comment">
        <div class="title">
            <span class="name">
                <i class="iconfont icon-chat"></i>
                评论
            </span>
            <!-- <span class="tool" @click="router.go('/pages/privacy')"> 隐私政策 </span> -->
        </div>
        <Waline v-if="theme.plugin.comment.provider === 'Waline'" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useData, useRouter } from 'vitepress'
import Waline from './Waline.vue'
const { theme } = useData()
const router = useRouter()
const mainCommentRef = ref(null)

const scrollToComments = () => {
    if (typeof window === 'undefined') return
    if (!mainCommentRef.value) return false
    const elementRect = mainCommentRef.value.getBoundingClientRect()
    const elementTop = elementRect.top + window.scrollY
    window.scrollBy({ top: elementTop - 80, behavior: "smooth" })
}

defineExpose({ scrollToComments })
</script>

<style lang="scss" scoped>
.comment {
    margin-top: 2rem;

    .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin: 3rem 0 1rem 0;
        padding: 0 6px;

        .name {
            display: flex;
            align-items: center;
            font-size: 24px;
            font-weight: bold;

            .iconfont {
                font-size: 26px;
                font-weight: normal;
                margin-right: 8px;
            }
        }

        .tool {
            opacity: 0.6;
            font-size: 14px;
            cursor: pointer;
            transition:
                opacity 0.3s,
                color 0.3s;

            &:hover {
                opacity: 1;
                color: var(--main-color);
            }
        }
    }
}
</style>
