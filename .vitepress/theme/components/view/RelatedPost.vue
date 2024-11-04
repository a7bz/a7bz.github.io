<template>
    <div v-if="relatedData" class="related-post">
        <div class="title">
            <span class="name">
                <i class="iconfont icon-star"></i>
                相关推荐
            </span>
            <span class="shuffle" @click="router.go(shufflePost(postsData))"> 随便逛逛 </span>
        </div>
        <PostList :data="relatedData" simple un-show-excerpt />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useData, useRouter } from 'vitepress'
import { useDataStore } from '@/store/index'
import { shuffleArray, shufflePost } from '@/scripts/helper'
import PostList from '../common/PostList.vue'

const router = useRouter()
const dataStore = useDataStore()
const { categoryData, postsData } = storeToRefs(dataStore)
const { frontmatter, page } = useData()

const relatedData = ref(null)

const path = computed(() => {
    return page.value.filePath.replace('.md', '').replace('index', '')
})

const getRelatedData = async () => {
    const catName = frontmatter.value.category
    const filteredPosts = categoryData.value[catName]?.filter(item => item !== path.value)
    if (filteredPosts.length == 0)
        return
    relatedData.value = shuffleArray(filteredPosts).slice(0, 2)
    if (relatedData.value.length == 0)
        relatedData.value = null
    console.log(relatedData.value)
}

watch(() => router.route?.path, () => {
    getRelatedData()
})

onMounted(() => {
    getRelatedData()
})

</script>

<style lang="scss" scoped>
.related-post {
    margin-top: 1rem;

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

        .shuffle {
            opacity: 0.6;
            font-size: 14px;
            transition:
                color 0.3s,
                opacity 0.3s;
            cursor: pointer;

            &:hover {
                opacity: 1;
                color: var(--main-color);
            }
        }
    }
}
</style>
