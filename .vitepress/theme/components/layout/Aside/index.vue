<template>
    <aside class="main-aside">
        <Intro class="weidgets" />
        <div class="sticky">
            <Toc v-if="toc" class="weidgets" />
            <!-- <Clock class="weidgets" /> -->
            <HotTags class="weidgets" />
            <SiteData class="weidgets" />
            <CommentList class="weidgets" />
        </div>
    </aside>
</template>

<script setup>
import HotTags from './HotTags.vue'
import Intro from './Intro.vue'
import Toc from './Toc.vue'
import SiteData from './SiteData.vue'
import CommentList from '../../plugin/Comments/CommentList.vue'
import Clock from './Clock.vue'
const props = defineProps({
    toc: {
        type: Boolean,
        default: false
    }
})
</script>

<style lang="scss" scoped>
.main-aside {
    padding-left: 1rem;
    display: flex;
    flex-direction: column;
    animation: fade-up 0.6s 0.3s backwards;

    .weidgets {
        padding: 18px;
        margin-bottom: 1rem;

        :deep(.title) {
            margin-bottom: 12px;
            font-weight: bold;
            display: flex;
            align-items: center;
            opacity: 0.75;

            .iconfont {
                opacity: 0.6;
                margin-right: 6px;
            }

            .title-name {
                opacity: 0.8;
            }
        }
    }

    .sticky {
        position: sticky;
        top: calc(60px + 1rem);

        .weidgets {
            animation: fade-up 0.6s 0.4s backwards;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}
</style>