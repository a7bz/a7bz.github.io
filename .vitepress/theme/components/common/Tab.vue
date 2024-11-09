<template>
    <div v-if="type != 'click'" class="type-bar s-card hover">
        <div class="all-type-container">
            <div class="all-type">
                <a href="/" v-if="home" :class="['type-item', { choose: pageHref == '/' }]">主页</a>
                <a :href="`/${prefix}/${type}/${item.name}`" v-for="(item, index) in data" :key="index"
                    :class="['type-item', { choose: pageHref == `/${prefix}/${type}/${item.name}` }]"
                    @mousedown="startDrag($event, item)" @click="adjustTabPosition($event)">
                    {{ item.name || item.title }}
                    <span class="num">{{ item.count || item.num }}</span>
                </a>
            </div>
        </div>
        <a :href="`/${prefix}/${type}`" class="more-type">
            <i class="iconfont icon-arrow-right" />
            更多
        </a>
    </div>
    <div v-else class="type-bar s-card hover">
        <div class="all-type-container">
            <div class="all-type">
                <div v-for="(item, index2) in data" :key="index2" :class="['type-item', { choose: index2 == curIndex }]"
                    @click="adjustTabPosition($event, index2)" @mousedown="startDrag($event, item)">
                    {{ item.name || item.title }}
                    <span class="num">{{ item.count || item.num }}</span>
                </div>
            </div>
        </div>
        <div :href="`/${prefix}/${type}`" class="more-type">
            <i class="iconfont icon-arrow-right" />
            更多
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vitepress'
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
    prefix: {
        type: String,
        default: 'pages'
    },
    type: {
        type: String,
        default: 'category'
    },
    home: {
        type: Boolean,
        default: false
    },
    data: {
        type: Array,
        default: []
    }
})

const curIndex = ref(0)
const pageHref = ref()
const router = useRouter()
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)
const draggingTab = ref(null)

onMounted(() => {
    pageHref.value = decodeURIComponent(window.location.pathname)
})

watch(() => router.route?.path, () => {
    pageHref.value = decodeURIComponent(window.location.pathname)
})

// 当鼠标按下时开始拖动
const startDrag = (e, item) => {
    isDragging.value = true
    draggingTab.value = item
    startX.value = e.clientX
    scrollLeft.value = e.target.parentNode.scrollLeft
    e.preventDefault() // 防止默认的文本选择等行为
}


// 点击 tab 时调整其位置
const adjustTabPosition = (event, index) => {
    const tab = event.target
    const container = tab.closest('.all-type-container')
    const containerWidth = container.offsetWidth
    const tabOffsetLeft = tab.offsetLeft
    const tabWidth = tab.offsetWidth

    // 计算 tab 距离左边的距离，确保 tab 的位置不会被遮挡
    const scrollPosition = tabOffsetLeft - (containerWidth / 2) + (tabWidth / 2)

    container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth' // 平滑滚动
    })
    if (props.type == 'click') {
        curIndex.value = index
    }
}
</script>

<style lang="scss" scoped>
.type-bar {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding: 0.6rem;
    font-weight: bold;
    animation: fade-up 0.6s 0.3s backwards;

    .all-type-container {
        width: 100%;
        overflow-x: auto;
        -ms-overflow-style: none;
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .all-type {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-right: 12px;
        min-width: 100%;
    }

    .type-item {
        display: flex;
        align-items: center;
        padding: 0.1rem 0.5rem;
        margin-right: 6px;
        font-weight: bold;
        border-radius: 8px;
        white-space: nowrap;
        height: 30px;
        cursor: pointer;
        flex-shrink: 0;

        .num {
            margin-left: 4px;
            font-weight: normal;
            padding: 2px 6px;
            font-size: 0.75rem;
            color: var(--main-font-color);
            background-color: var(--main-card-border);
            border-radius: 8px;
        }

        &.choose {
            color: var(--main-card-background);
            background-color: var(--main-color);

            .num {
                color: var(--main-color);
            }
        }

        &:hover {
            color: var(--main-card-background);
            background-color: var(--main-color);
        }

        &.dragging {
            opacity: 0.7;
        }
    }

    .more-type {
        display: flex;
        flex-direction: row;
        align-items: center;
        white-space: nowrap;
        margin-right: 4px;
        margin-left: 8px;

        .iconfont {
            font-size: 0.9375rem;
            margin-right: 8px;
        }

        &:hover {
            .iconfont {
                color: var(--main-color);
            }
        }
    }
}
</style>
