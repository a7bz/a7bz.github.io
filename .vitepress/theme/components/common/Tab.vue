<template>
    <div class="type-bar s-card hover">
        <div class="all-type">
            <a href="/" v-if="home" :class="['type-item', { choose: pageHref == '/' }]">主页</a>
            <a :href="`/${prefix}/${type}/${item.name}`" v-for="(item, index) in data" :key="index"
                :class="['type-item', { choose: pageHref == `/${prefix}/${type}/${item.name}` }]">
                {{ item.name }}
                <span class="num">{{ item.count }}</span>
            </a>
        </div>
        <a :href="`/${prefix}/${type}`" class="more-type">
            <i class="iconfont icon-arrow-right" />
            更多
        </a>
    </div>
</template>

<script setup>
import { computed } from 'vue'

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

const pageHref = computed(() => {
    return window.location.pathname
})

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

    .all-type {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-right: 12px;
        overflow: hidden;
        mask: linear-gradient(90deg,
                #fff 0,
                #fff 90%,
                hsla(0, 0%, 100%, 0.6) 95%,
                hsla(0, 0%, 100%, 0) 100%);

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

            &.hidden {
                display: none;
            }

            &:hover {
                color: var(--main-card-background);
                background-color: var(--main-color);
            }
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
    }}
</style>
